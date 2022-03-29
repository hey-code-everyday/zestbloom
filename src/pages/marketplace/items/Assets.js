import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, Typography } from '@material-ui/core';

import AssetCard from 'components/elements/cards/assetCard';
import LoadMoreBtn from 'components/shared/LoadMoreBtn';
import LottieContainer from 'components/shared/LottieContainer';
import { getFilteredAssetElements } from '../util';
import { getAssetsForMarketPlace } from 'redux/marketplace/actions';
import { useDebounce } from 'react-use';
import {
    upvoteAsset,
    unUpvoteAsset,
    toFavoritesAssets,
    removeFromFavoritesAssets,
    changeMarketplaceAssetVisibility,
    placeABidAction,
    buyNowSuccess,
    removeAsset,
} from 'redux/marketplace/actions';
import Slider from 'components/shared/slider';
import { FILTER_CONFIG } from 'configs';
import axios from 'axios';
import PropTypes from 'prop-types';

const Assets = ({
    title,
    searchValue,
    filterObj,
    sortAssets,
    filterAssetsByTag,
    displayVisibility,
    loadMoreAssets,
    category,
    assetsInWallet,
    afterMakeAnOffer,
}) => {
    const dispatch = useDispatch();
    const { marketplaceAssets, getMarketplaceAssetsLoading, loadMoreMarkURL, loadMoreLoading } =
        useSelector((state) => state.marketplace);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [filterPath, setFilterPath] = useState(null);

    const getAssetsFilter = useCallback(() => {
        const filter = getFilteredAssetElements(
            filterObj,
            sortAssets,
            filterAssetsByTag,
            searchValue,
        );
        setFilterPath(filter);
    }, [filterObj, sortAssets, filterAssetsByTag, searchValue]);

    const getAssets = useCallback(
        (currentRequest) => {
            if (filterPath) dispatch(getAssetsForMarketPlace(filterPath, category, currentRequest));
        },
        [dispatch, category, filterPath],
    );

    useDebounce(
        () => {
            getAssetsFilter();
        },
        500,
        [getAssetsFilter],
    );

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        getAssets(currentRequest);

        return () => currentRequest?.cancel();
    }, [getAssets]);

    if (!category) {
        return null;
    }

    const deleteAssetFromReducer = (guid) => {
        dispatch(removeAsset(guid));
    };

    const assets = marketplaceAssets[category];
    const loadMoreUrl = loadMoreMarkURL[category];

    const isFeaturedAssets =
        filterObj.category.length === 1 && category === FILTER_CONFIG.featured_work;

    const showSlider = isFeaturedAssets && assets && assets?.length > 0;
    return (
        <Grid
            container
            spacing={1}
            className="list-with-link"
            style={!displayVisibility ? { display: 'none' } : {}}
        >
            <Grid item xs={12}>
                <Typography
                    variant="h3"
                    className="text-capitalize mt-5 marketplace-section-title font-primary"
                >
                    {title}
                </Typography>
            </Grid>
            {getMarketplaceAssetsLoading && (!assets || assets?.length === 0) && (
                <LottieContainer
                    containerStyles={{
                        height: '49px',
                        width: '100%',
                        marginTop: '40px',
                    }}
                    lottieStyles={{ width: '49px' }}
                />
            )}
            {assets && assets?.length === 0 && !getMarketplaceAssetsLoading && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    No Assets
                </div>
            )}
            {showSlider ? (
                <Grid item xs={12} className="slide-container">
                    <Slider
                        beforeChange={(current, next) => {
                            if (next >= assets?.length - 5) {
                                loadMoreAssets(loadMoreUrl, category);
                            }
                        }}
                        options={{
                            slidesToScroll: 4,
                            infinite: true,
                        }}
                    >
                        {assets?.map((item) => (
                            <Box p={1.5} key={item?.guid}>
                                <AssetCard
                                    item={item}
                                    upvoteAsset={upvoteAsset}
                                    unUpvoteAsset={unUpvoteAsset}
                                    toFavoritesAssets={toFavoritesAssets}
                                    removeFromFavoritesAssets={removeFromFavoritesAssets}
                                    isLoggedIn={isLoggedIn}
                                    changeAssetVisibility={changeMarketplaceAssetVisibility}
                                    assetsInWallet={assetsInWallet}
                                    updateAsset={placeABidAction}
                                    buyNowSuccess={buyNowSuccess}
                                    afterMakeAnOffer={afterMakeAnOffer}
                                    deleteAssetFromReducer={deleteAssetFromReducer}
                                />
                            </Box>
                        ))}
                    </Slider>
                </Grid>
            ) : (
                <Grid item xs={12} className="assetsGrid">
                    {assets?.map((item) => (
                        <AssetCard
                            key={item.guid}
                            item={item}
                            upvoteAsset={upvoteAsset}
                            unUpvoteAsset={unUpvoteAsset}
                            toFavoritesAssets={toFavoritesAssets}
                            removeFromFavoritesAssets={removeFromFavoritesAssets}
                            isLoggedIn={isLoggedIn}
                            changeAssetVisibility={changeMarketplaceAssetVisibility}
                            assetsInWallet={assetsInWallet}
                            updateAsset={placeABidAction}
                            buyNowSuccess={buyNowSuccess}
                            afterMakeAnOffer={afterMakeAnOffer}
                            deleteAssetFromReducer={deleteAssetFromReducer}
                        />
                    ))}
                </Grid>
            )}

            <Grid item xs={12}>
                {loadMoreUrl &&
                    (loadMoreLoading ? (
                        <LottieContainer
                            containerStyles={{
                                height: '49px',
                                width: '100%',
                                marginTop: '40px',
                            }}
                            lottieStyles={{ width: '49px' }}
                        />
                    ) : (
                        <LoadMoreBtn loadMoreAssets={() => loadMoreAssets(loadMoreUrl, category)} />
                    ))}
            </Grid>
        </Grid>
    );
};

Assets.propTypes = {
    title: PropTypes.string,
    searchValue: PropTypes.string,
    filterObj: PropTypes.object,
    sortAssets: PropTypes.string,
    filterAssetsByTag: PropTypes.array,
    displayVisibility: PropTypes.bool,
    loadMoreAssets: PropTypes.func,
    category: PropTypes.string,
    assetsInWallet: PropTypes.array,
    afterMakeAnOffer: PropTypes.func,
};

export default Assets;
