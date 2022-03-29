import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Container, Grid } from '@material-ui/core';
import Slider from 'components/shared/slider';
import { FILTER_CONFIG } from 'configs';
import AssetCard from 'components/elements/cards/assetCard';
import axios from 'axios';
import { getAssetsForMarketPlace } from 'redux/marketplace/actions';

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
import PropTypes from 'prop-types';

const FeaturedArtworks = ({ assetsInWallet, afterMakeAnOffer }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    const { marketplaceAssets } = useSelector((state) => state.marketplace);
    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        const filterPath = '?page_size=15&category=featured_work';
        dispatch(getAssetsForMarketPlace(filterPath, FILTER_CONFIG.featured_work, currentRequest));

        return () => currentRequest?.cancel();
    }, [dispatch]);

    const deleteAssetFromReducer = (guid) => {
        dispatch(removeAsset(guid));
    };

    const assets = marketplaceAssets[FILTER_CONFIG.featured_work];

    return (
        <div className="marketplace-featured-artworks">
            <Container maxWidth="xl">
                <div>
                    <Container maxWidth="xl">
                        <Box
                            mb={4}
                            textAlign="center"
                            className="marketplace-featured-artworks-title"
                        >
                            <Typography variant="h2">Featured Artwork</Typography>
                        </Box>

                        <Grid container spacing={3} className="list-with-link">
                            <Grid xs={12} item={true}>
                                <Slider
                                    options={{
                                        slidesToShow: 3,
                                        slidesToScroll: 3,
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
                                                removeFromFavoritesAssets={
                                                    removeFromFavoritesAssets
                                                }
                                                isLoggedIn={isLoggedIn}
                                                changeAssetVisibility={
                                                    changeMarketplaceAssetVisibility
                                                }
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
                        </Grid>
                    </Container>
                </div>
            </Container>
        </div>
    );
};

FeaturedArtworks.propTypes = {
    assetsInWallet: PropTypes.array,
    afterMakeAnOffer: PropTypes.func,
};

export default FeaturedArtworks;
