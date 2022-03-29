import * as TYPES from './types.js';
import AssetsServise from './services';

export const cleanCreatedAssets = () => ({ type: TYPES.CLEAN_CREATED_ASSETS_SUCCESS });

export const removeAsset = (guid) => ({
    type: TYPES.REMOVE_ASSET_CREATED,
    payload: { guid },
});

export const placeABidAction = ({ asset_guid, auction_guid, bid }) => ({
    type: TYPES.CR_ASSET_PLACE_A_BID_SUCCESS,
    payload: {
        asset_guid,
        auction_guid,
        bid,
    },
});

export const buyNowSuccess = (asset_guid) => ({
    type: TYPES.CR_ASSET_BUY_NOW_SECCESS,
    payload: {
        asset_guid,
    },
});

export const afterMakeAnOffer = ({ asset_guid, old_offer_guid, new_offer }) => ({
    type: TYPES.MAKE_OFFER_FROM_CREATED_SUCCESS,
    payload: { asset_guid, old_offer_guid, new_offer },
});

export const getCreatedAssets =
    (username, filters, sort, searchKey, currentRequest) => (dispatch) => {
        dispatch({ type: TYPES.GET_CREATED_ASSETS_REQUEST });
        return AssetsServise.getCreatedAssets(username, filters, sort, searchKey, currentRequest)
            .then((response) => {
                if (response.status === 200) {
                    return dispatch({
                        type: TYPES.GET_CREATED_ASSETS_SUCCESS,
                        payload: {
                            data: response.data.results,
                            next: response.data.next,
                        },
                    });
                }
                return dispatch({
                    type: TYPES.GET_CREATED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting created assets',
                    },
                });
            })
            .catch((err) => {
                return dispatch({
                    type: TYPES.GET_CREATED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting created assets',
                    },
                });
            });
    };

export const getCreatedAssetsForTable =
    (username, filters, sort, searchKey, currentRequest) => (dispatch) => {
        dispatch({ type: TYPES.GET_CREATED_ASSETS_REQUEST });
        return AssetsServise.getCreatedAssetsForTable(
            username,
            filters,
            sort,
            searchKey,
            currentRequest,
        )
            .then((response) => {
                if (response.status === 200) {
                    return dispatch({
                        type: TYPES.GET_CREATED_ASSETS_SUCCESS,
                        payload: {
                            data: response.data.results,
                            next: response.data.next,
                        },
                    });
                }
                return dispatch({
                    type: TYPES.GET_CREATED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting created assets',
                    },
                });
            })
            .catch((err) => {
                return dispatch({
                    type: TYPES.GET_CREATED_ASSETS_FAIL,
                    payload: {
                        message: 'Error while getting created assets',
                    },
                });
            });
    };

export const loadMoreCreatedItems = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_ASSETS_REQUEST });
    return AssetsServise.loadMoreCreatedItems(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_ASSETS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_ASSETS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        });
};

export const changeCreatedAssetVisibility = (nodeGuid, values, assetGuid) => (dispatch) => {
    dispatch({ type: TYPES.UPDATE_VISIBILITY_CREATED_ASSET_REQUEST });
    return AssetsServise.updateAsset(nodeGuid, values)
        .then((response) => {
            if (response.status === 200) {
                const updatedAsset = response?.data;
                return dispatch({
                    type: TYPES.UPDATE_VISIBILITY_CREATED_ASSET_SUCCESS,
                    payload: { assetGuid, nodeGuid, updatedAsset },
                });
            }
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_CREATED_ASSET_FAIL,
                payload: { error: '' },
            });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_CREATED_ASSET_FAIL,
                payload: { error: '' },
            });
        });
};

export const upvoteCreatedAsset = (guid) => (dispatch) => {
    return AssetsServise.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_CREATED_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const unUpvoteCreatedAsset = (guid) => (dispatch) => {
    return AssetsServise.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_CREATED_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
export const toFavoritesCreatedAssets = (guid) => (dispatch) => {
    return AssetsServise.addToFavorites(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.TO_FAVORITES_CREATED_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const removeFromFavoritesCreatedAssets = (guid) => (dispatch) => {
    return AssetsServise.removeFromFavorites(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.REMOVE_FROM_FAVORITES_CREATED_SUCCESS,
                    payload: { guid },
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
