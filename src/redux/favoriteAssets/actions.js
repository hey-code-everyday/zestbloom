import * as TYPES from './types.js';
import AssetsServise from './services';

export const placeABidAction = ({ asset_guid, auction_guid, bid }) => ({
    type: TYPES.FAV_ASSET_PLACE_A_BID_SUCCESS,
    payload: {
        asset_guid,
        auction_guid,
        bid,
    },
});

export const buyNowSuccess = (asset_guid) => ({
    type: TYPES.FAV_ASSET_BUY_NOW_SECCESS,
    payload: {
        asset_guid,
    },
});

export const afterMakeAnOffer = ({ asset_guid, old_offer_guid, new_offer }) => ({
    type: TYPES.MAKE_OFFER_FROM_FAVORITES_SUCCESS,
    payload: { asset_guid, old_offer_guid, new_offer },
});

export const getFavoriteAssets = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_FAVORITES_ASSETS_REQUEST });
    return AssetsServise.getFavoriteAssets(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_FAVORITES_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        });
};

export const loadMoreFavoritesItems = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_FAVORITES_ASSETS_REQUEST });
    return AssetsServise.loadMoreFavoritesItems(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_FAVORITES_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while load more favorite assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while load more favorite assets',
                },
            });
        });
};

export const upvoteFavoriteAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UPVOTING_FAVORITE_ASSET_REQUEST });
    return AssetsServise.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_FAVORITE_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UPVOTING_FAVORITE_ASSET_FAIL,
                payload: {
                    message: 'Error while upvoting favorte assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UPVOTING_FAVORITE_ASSET_FAIL,
                payload: {
                    message: 'Error while upvoting favorte assets',
                },
            });
        });
};

export const unUpvoteFavoriteAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UNUPVOTING_FAVORITE_ASSET_REQUEST });
    return AssetsServise.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_FAVORITE_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UNUPVOTING_FAVORITE_ASSET_FAIL,
                payload: {
                    message: 'Error while unupvoting favorte assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UNUPVOTING_FAVORITE_ASSET_FAIL,
                payload: {
                    message: 'Error while unupvoting favorte assets',
                },
            });
        });
};

export const removeAsset = (guid) => ({
    type: TYPES.REMOVE_FROM_FAVORITES_ASSETS_SUCCESS,
    payload: { guid },
});

export const removeFromFavoritesAssets = (guid) => (dispatch) => {
    dispatch({ type: TYPES.REMOVE_FROM_FAVORITES_ASSETS_REQUEST });
    return AssetsServise.removeFromFavorites(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch(removeAsset(guid));
            }
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ASSETS_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        });
};

export const changeFavoriteAssetVisibility = (nodeGuid, values, assetGuid) => (dispatch) => {
    dispatch({ type: TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_REQUEST });
    return AssetsServise.updateAsset(nodeGuid, values)
        .then((response) => {
            if (response.status === 200) {
                const updatedAsset = response?.data;
                return dispatch({
                    type: TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_SUCCESS,
                    payload: { assetGuid, nodeGuid, updatedAsset },
                });
            }
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_FAIL,
                payload: { error: '' },
            });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({
                type: TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_FAIL,
                payload: { error: '' },
            });
        });
};
