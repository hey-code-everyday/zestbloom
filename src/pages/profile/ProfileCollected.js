import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

import { Grid, Box, Typography, MenuItem } from '@material-ui/core';
import {
    getCollectedAssets,
    getCollectedAssetsForTable,
    loadMoreCollectedItems,
    upvoteCollectedAsset,
    unUpvoteCollectedAsset,
    toFavoritesCollectedAssets,
    removeFromFavoritesCollectedAssets,
    changeCollectedAssetVisibility,
    placeABidAction,
    buyNowSuccess,
    afterMakeAnOffer,
    removeAsset,
} from 'redux/collectedAssets/actions';
import { updateAssetVisibilities } from 'redux/marketplace/actions';

import AssetCard from 'components/elements/cards/assetCard';
import AssetList from 'components/elements/list/assetList';
import LottieContainer from 'components/shared/LottieContainer';
import FlexibleDropdownFilter from 'components/shared/dropdown/flexible-dropdown-filter';
import FlexibleDropdownSort from 'components/shared/dropdown/flexible-dropdown-sort';
import ShowStyle, { SHOW_TYPE } from 'components/shared/ShowStyle';
import SearchBox from 'components/shared/SearchBox';
import SelectAll from 'components/shared/SelectAll';
import { AssetsFromWallet } from '.';
import { PROFILE_FILTERS_COLLECTION, PROFILE_SORTS } from 'configs';
import PropTypes from 'prop-types';

const ProfileCollected = ({ user }) => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { user: authUser } = useSelector((state) => state.auth);
    const isMyProfile = authUser?.username === username;
    const [filters, setFilters] = useState(
        PROFILE_FILTERS_COLLECTION.reduce((acc, cur) => ({ ...acc, [cur.category.value]: [] }), {}),
    );
    const [sortOption, setSortOption] = useState('');
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [showType, setShowType] = useState(SHOW_TYPE.grid);
    const [listViewSort, setListViewSort] = useState({ field: 'created_at', direction: 'desc' });
    const [searchKey, setSearchKey] = useState('');

    const { collectedAssets, loadMoreURLCollectedAssets, collectedAssetLoading, loadMoreLoading } =
        useSelector((state) => state.collectedAssets);
    const { callingAssetsAction } = useSelector((state) => state.marketplace);
    const assetsInWallet = useContext(AssetsFromWallet);

    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        const name = username || user?.username;
        if (name) {
            if (showType === SHOW_TYPE.grid) {
                dispatch(getCollectedAssets(name, filters, sortOption, searchKey, currentRequest));
            } else {
                let tableSort = '';
                if (listViewSort.direction === 'asc') {
                    tableSort = `${listViewSort.field}`;
                } else if (listViewSort.direction === 'desc') {
                    tableSort = `-${listViewSort.field}`;
                }
                dispatch(
                    getCollectedAssetsForTable(name, filters, tableSort, searchKey, currentRequest),
                );
            }
        }
        return () => currentRequest?.cancel();
    }, [dispatch, username, user, filters, sortOption, searchKey, showType, listViewSort]);

    const loadMore = () => {
        dispatch(loadMoreCollectedItems(loadMoreURLCollectedAssets));
    };

    const handleSelectAsset = (checked, assetIds) => {
        if (checked) {
            setSelectedAssets(Array.from(new Set([...selectedAssets, ...assetIds])));
        } else {
            setSelectedAssets(selectedAssets.filter((a) => !assetIds.includes(a)));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedAssets(collectedAssets.map((item) => item?.asset?.asset_id));
        } else {
            setSelectedAssets([]);
        }
    };

    const setToPrivate = () => {
        if (selectedAssets.length > 0) {
            dispatch(
                updateAssetVisibilities({
                    asset_ids: selectedAssets,
                    visibility: 'private',
                }),
            );
            setSelectedAssets([]);
        }
    };

    const setToPublic = () => {
        if (selectedAssets.length > 0) {
            dispatch(
                updateAssetVisibilities({
                    asset_ids: selectedAssets,
                    visibility: 'public',
                }),
            );
            setSelectedAssets([]);
        }
    };

    const handleCreateGroup = () => {
        console.log('handleCreateGroup');
    };
    const deleteAssetFromReducer = (guid) => {
        dispatch(removeAsset(guid));
    };
    return (
        <>
            <div className="profile-filter">
                <SearchBox
                    searchKey={searchKey}
                    onSearch={(e) => {
                        setSelectedAssets([]);
                        setSearchKey(e);
                    }}
                />
                <Box display="flex" className="right-btns-group">
                    <ShowStyle
                        selected={showType}
                        onChange={(e) => {
                            setSelectedAssets([]);
                            setShowType(e);
                        }}
                    />
                    <FlexibleDropdownFilter
                        filters={PROFILE_FILTERS_COLLECTION}
                        setFilters={(e) => {
                            setSelectedAssets([]);
                            setFilters(e);
                        }}
                        selectedFilters={filters}
                    />
                    <FlexibleDropdownSort
                        setSort={(e) => {
                            setSelectedAssets([]);
                            setSortOption(e);
                        }}
                        sortOptions={PROFILE_SORTS}
                        sortingOption={sortOption}
                    />
                </Box>
            </div>
            {isMyProfile && showType === SHOW_TYPE.grid && (
                <SelectAll
                    handleSelectAll={handleSelectAll}
                    selectedCount={selectedAssets.length}
                    allCount={collectedAssets.length}
                >
                    <MenuItem onClick={() => setToPrivate()}>Set To Private</MenuItem>
                    <MenuItem onClick={() => setToPublic()}>Set To Public</MenuItem>
                    <MenuItem onClick={() => handleCreateGroup()}>Create Group</MenuItem>
                </SelectAll>
            )}
            <Box overflow="auto">
                {showType === SHOW_TYPE.grid && (
                    <InfiniteScroll
                        dataLength={collectedAssets.length}
                        next={loadMore}
                        hasMore={loadMoreURLCollectedAssets ? true : false}
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
                        style={{ overflow: 'hidden' }}
                    >
                        <Grid
                            container
                            spacing={3}
                            justifyContent={collectedAssets?.length === 0 ? 'center' : 'flex-start'}
                        >
                            {collectedAssetLoading && collectedAssets?.length === 0 && (
                                <LottieContainer
                                    containerStyles={{
                                        height: '49px',
                                        width: '100%',
                                        marginTop: '40px',
                                    }}
                                    lottieStyles={{ width: '50px' }}
                                />
                            )}
                            <Grid item xs={12} className="mobile-only">
                                <Box pt={3}>
                                    <Typography variant="h4" className="text-white">
                                        Collections
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} className="assetsGrid mb-2">
                                {collectedAssets?.map((item, index) => (
                                    <AssetCard
                                        key={item?.guid + index}
                                        item={item}
                                        upvoteAsset={upvoteCollectedAsset}
                                        unUpvoteAsset={unUpvoteCollectedAsset}
                                        toFavoritesAssets={toFavoritesCollectedAssets}
                                        removeFromFavoritesAssets={
                                            removeFromFavoritesCollectedAssets
                                        }
                                        changeAssetVisibility={changeCollectedAssetVisibility}
                                        isLoggedIn={true}
                                        assetsInWallet={assetsInWallet}
                                        updateAsset={placeABidAction}
                                        buyNowSuccess={buyNowSuccess}
                                        collected={true}
                                        afterMakeAnOffer={afterMakeAnOffer}
                                        selectable
                                        selected={selectedAssets.includes(item?.asset?.asset_id)}
                                        selectAsset={handleSelectAsset}
                                        deleteAssetFromReducer={deleteAssetFromReducer}
                                        isMyProfile={isMyProfile}
                                    />
                                ))}
                            </Grid>
                        </Grid>
                    </InfiniteScroll>
                )}

                {showType === SHOW_TYPE.list && (
                    <AssetList
                        items={collectedAssets}
                        changeAssetVisibility={changeCollectedAssetVisibility}
                        selectedAssets={selectedAssets}
                        hasMore={loadMoreURLCollectedAssets ? true : false}
                        sort={listViewSort}
                        onSortChange={(sort) => {
                            setSelectedAssets([]);
                            setListViewSort(sort);
                        }}
                        selectAsset={handleSelectAsset}
                        loadMore={loadMore}
                        loadMoreLoading={loadMoreLoading}
                        showGroupAction
                        setToPrivate={setToPrivate}
                        setToPublic={setToPublic}
                        handleCreateGroup={handleCreateGroup}
                        loading={collectedAssetLoading && collectedAssets?.length === 0}
                        callingAssetAction={callingAssetsAction}
                        isMyProfile={isMyProfile}
                    />
                )}
            </Box>
        </>
    );
};

ProfileCollected.propTypes = {
    user: PropTypes.object,
};

export default ProfileCollected;
