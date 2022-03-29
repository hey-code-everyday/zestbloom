import * as TYPES from './types.js';
import AssetsServise from './services';

export const removeAsset = (guid) => ({
    type: TYPES.REMOVE_ASSET_COLLECTED,
    payload: { guid },
});

export const cleanUpCollectedItems = () => ({ type: TYPES.CLEAN_CREATED_COLLECTED_SUCCESS });
export const getCollectedAssets =
    (username, filters, sort, searchkey, currentRequest) => (dispatch) => {
        dispatch({ type: TYPES.GET_COLLECTED_ASSETS_REQUEST });
        return AssetsServise.getCollectedAssets(username, filters, sort, searchkey, currentRequest)
            .then((response) => {
                if (response.status === 200) {
                    return dispatch({
                        type: TYPES.GET_COLLECTED_ASSETS_SUCCESS,
                        payload: {
                            data: response?.data?.results,
                            next: response.data.next,
                        },
                    });
                }
                return dispatch({
                    type: TYPES.GET_COLLECTED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting collected assets',
                    },
                });
            })
            .catch((err) => {
                return dispatch({
                    type: TYPES.GET_COLLECTED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting collected assets',
                    },
                });
            });
    };

export const getCollectedAssetsForTable =
    (username, filters, sort, searchkey, currentRequest) => (dispatch) => {
        dispatch({ type: TYPES.GET_COLLECTED_ASSETS_REQUEST });
        return AssetsServise.getCollectedAssetsForTable(
            username,
            filters,
            sort,
            searchkey,
            currentRequest,
        )
            .then((response) => {
                if (response.status === 200) {
                    return dispatch({
                        type: TYPES.GET_COLLECTED_ASSETS_SUCCESS,
                        payload: {
                            data: response?.data?.results,
                            next: response.data.next,
                        },
                    });
                }
                return dispatch({
                    type: TYPES.GET_COLLECTED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting collected assets',
                    },
                });
            })
            .catch((err) => {
                return dispatch({
                    type: TYPES.GET_COLLECTED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting collected assets',
                    },
                });
            });
    };

export const placeABidAction = ({ asset_guid, auction_guid, bid }) => ({
    type: TYPES.COLL_ASSET_PLACE_A_BID_SUCCESS,
    payload: {
        asset_guid,
        auction_guid,
        bid,
    },
});

export const afterMakeAnOffer = ({ asset_guid, old_offer_guid, new_offer }) => ({
    type: TYPES.MAKE_OFFER_FROM_COLLECTED_SUCCESS,
    payload: { asset_guid, old_offer_guid, new_offer },
});

export const buyNowSuccess = (asset_guid) => ({
    type: TYPES.COLL_ASSET_BUY_NOW_SECCESS,
    payload: {
        asset_guid,
    },
});

export const loadMoreCollectedItems = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_COLLECTED_ASSETS_REQUEST });
    return AssetsServise.loadMoreCollectedItems(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_COLLECTED_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            dispatch({ type: TYPES.LOAD_MORE_COLLECTED_ASSETS_FAIL });
        })
        .catch((err) => {
            dispatch({ type: TYPES.LOAD_MORE_COLLECTED_ASSETS_FAIL });
            console.log(err);
        });
};

export const collectAsset = (guid, data) => (dispatch) => {
    return AssetsServise.collectAsset(guid, data)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            return err?.response;
        });
};

export const upvoteCollectedAsset = (guid) => (dispatch) => {
    return AssetsServise.upvoteCollectedAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_COLLECTED_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const unUpvoteCollectedAsset = (guid) => (dispatch) => {
    return AssetsServise.unUpvoteCollectedAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_COLLECTED_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
export const toFavoritesCollectedAssets = (guid) => (dispatch) => {
    return AssetsServise.toFavoritesCollectedAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.TO_FAVORITES_COLLECTED_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const removeFromFavoritesCollectedAssets = (guid) => (dispatch) => {
    return AssetsServise.removeFromFavoritesCollected(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.REMOVE_FROM_FAVORITES_COLLECTED_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const changeCollectedAssetVisibility = (nodeGuid, values, assetGuid) => (dispatch) => {
    dispatch({ type: TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_REQUEST });
    return AssetsServise.updateAsset(nodeGuid, values)
        .then((response) => {
            if (response.status === 200) {
                const updatedAsset = response?.data;
                return dispatch({
                    type: TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_SUCCESS,
                    payload: { assetGuid, nodeGuid, updatedAsset },
                });
            }
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_FAIL,
                payload: { error: '' },
            });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_FAIL,
                payload: { error: '' },
            });
        });
};

export const collectAssetOfferByEscrow = (guid, data) => (disptach) => {
    return AssetsServise.collectAssetOfferByEscrow(guid, data)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};
