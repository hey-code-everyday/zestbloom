import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Grid, Typography } from '@material-ui/core';
import { AssetsFromWallet } from './index';
import AssetGridCard from 'components/elements/cards/AssetGridCard';
import AssetListCard from 'components/elements/cards/AssetListCard';
import { getCollectedAssets, loadMoreCollectedItems } from 'redux/collectedAssets/actions';
import LottieContainer from '../../components/shared/LottieContainer';
import LoadMoreBtn from '../../components/shared/LoadMoreBtn';
import ProfileGalleryView from './ProfileGalleryView';

const ProfileCollections = ({ viewMode, filters }) => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { user: authUser } = useSelector((state) => state.auth);
    const isMyProfile = authUser?.username === username;
    const { collectedAssets, loadMoreURLCollectedAssets, collectedAssetLoading, loadMoreLoading } =
        useSelector((state) => state.collectedAssets);
    // const { callingAssetsAction } = useSelector((state) => state.marketplace);
    const assetsInWallet = useContext(AssetsFromWallet);

    const loadMore = () => {
        dispatch(loadMoreCollectedItems(loadMoreURLCollectedAssets));
    };

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        const name = username || authUser?.username;
        if (name) {
            dispatch(getCollectedAssets(name, filters, '', '', currentRequest));
        }
    }, [dispatch, username, authUser, filters]);

    return (
        <div>
            {collectedAssetLoading && (
                <LottieContainer
                    containerStyles={{
                        height: '49px',
                        width: '100%',
                        marginTop: '40px',
                    }}
                    lottieStyles={{ width: '49px' }}
                />
            )}
            {collectedAssets && collectedAssets?.length === 0 && !collectedAssetLoading && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h4" style={{ padding: '64px 0' }}>
                        No Assets
                    </Typography>
                </div>
            )}
            {collectedAssets && collectedAssets.length > 0 && (
                <>
                    {viewMode === 'tile' ? (
                        <ProfileGalleryView
                            items={collectedAssets}
                            isMyProfile={isMyProfile}
                            assetsInWallet={assetsInWallet}
                        />
                    ) : (
                        <Grid container spacing={0} style={{ margin: '48px 0' }}>
                            {collectedAssets.map((item) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={viewMode === 'list' ? 12 : 6}
                                    md={viewMode === 'list' ? 12 : 4}
                                    lg={viewMode === 'list' ? 12 : 3}
                                    key={item.guid}
                                    style={{
                                        padding: 16,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {viewMode === 'grid' ? (
                                        <AssetGridCard item={item} />
                                    ) : (
                                        <AssetListCard item={item} />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}
            {loadMoreURLCollectedAssets &&
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
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <LoadMoreBtn loadMoreAssets={loadMore} />
                    </div>
                ))}
        </div>
    );
};
export default ProfileCollections;
