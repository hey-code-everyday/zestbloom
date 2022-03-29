import React, { useEffect, useContext } from 'react';
import { Grid } from '@material-ui/core';
import {
    getFavoriteAssets,
    loadMoreFavoritesItems,
    unUpvoteFavoriteAsset,
    upvoteFavoriteAsset,
    removeFromFavoritesAssets,
    changeFavoriteAssetVisibility,
    placeABidAction,
    buyNowSuccess,
    afterMakeAnOffer,
    removeAsset,
} from 'redux/favoriteAssets/actions';
import { useDispatch, useSelector } from 'react-redux';
import AssetCard from '../../components/elements/cards/assetCard';
import LottieContainer from 'components/shared/LottieContainer';
import { AssetsFromWallet } from '.';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const ProfileFavorites = () => {
    const { favoriteAssets, loadMoreFavoriteAssetsURL, favoriteAssetLoading } = useSelector(
        (state) => state.favoriteAssets,
    );
    const dispatch = useDispatch();

    const assetsInWallet = useContext(AssetsFromWallet);

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        dispatch(getFavoriteAssets(currentRequest));

        return () => currentRequest?.cancel();
    }, [dispatch]);

    const loadMore = () => {
        dispatch(loadMoreFavoritesItems(loadMoreFavoriteAssetsURL));
    };

    const deleteAssetFromReducer = (guid) => {
        dispatch(removeAsset(guid));
    };

    return (
        <div>
            <InfiniteScroll
                dataLength={favoriteAssets.length}
                next={loadMore}
                hasMore={loadMoreFavoriteAssetsURL ? true : false}
                loader={
                    <LottieContainer
                        containerStyles={{
                            height: '49px',
                            width: '100%',
                            marginTop: '40px',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                }
                style={{ overflow: 'hidden', minHeight: '100px' }}
            >
                <Grid
                    container
                    spacing={3}
                    justifyContent={favoriteAssets.length === 0 ? 'center' : 'flex-start'}
                >
                    {favoriteAssetLoading && favoriteAssets?.length === 0 && (
                        <LottieContainer
                            containerStyles={{
                                height: '49px',
                                width: '100%',
                                marginTop: '40px',
                            }}
                            lottieStyles={{ width: '50px' }}
                        />
                    )}
                    {favoriteAssets?.length === 0 && !favoriteAssetLoading && (
                        <span style={{ fontSize: '18px', padding: '25px' }}>No Assets</span>
                    )}

                    <Grid item xs={12} className="assetsGrid mb-2">
                        {favoriteAssets?.map((item) => (
                            <AssetCard
                                key={item.guid}
                                item={item}
                                upvoteAsset={upvoteFavoriteAsset}
                                unUpvoteAsset={unUpvoteFavoriteAsset}
                                toFavoritesAssets={() => {}}
                                removeFromFavoritesAssets={removeFromFavoritesAssets}
                                isLoggedIn={true}
                                changeAssetVisibility={changeFavoriteAssetVisibility}
                                assetsInWallet={assetsInWallet}
                                updateAsset={placeABidAction}
                                buyNowSuccess={buyNowSuccess}
                                afterMakeAnOffer={afterMakeAnOffer}
                                deleteAssetFromReducer={deleteAssetFromReducer}
                            />
                        ))}
                    </Grid>
                </Grid>
            </InfiniteScroll>
        </div>
    );
};

export default ProfileFavorites;
