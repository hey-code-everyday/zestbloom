import * as TYPES from './types.js';

const initialState = {
    favoriteAssets: [],
    loadMoreFavoriteAssetsURL: '',
    loading: false,
    failMessage: {
        error: false,
        message: '',
    },
    visibilityLoading: false,
    loadMoreLoading: false,
    favoriteAssetLoading: true,
};

const favoriteAssetsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_FAVORITES_ASSETS_REQUEST:
            return {
                ...state,
                favoriteAssetLoading: true,
            };
        case TYPES.GET_FAVORITES_ASSETS_SUCCESS:
            return {
                ...state,
                favoriteAssets: payload.data,
                loadMoreFavoriteAssetsURL: payload.next,
                favoriteAssetLoading: false,
            };
        case TYPES.GET_FAVORITES_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                favoriteAssetLoading: false,
            };
        case TYPES.LOAD_MORE_FAVORITES_ASSETS_REQUEST:
            return {
                ...state,
                loadMoreLoading: true,
            };
        case TYPES.LOAD_MORE_FAVORITES_ASSETS_SUCCESS:
            return {
                ...state,
                favoriteAssets: [...state.favoriteAssets, ...payload.data],
                loadMoreFavoriteAssetsURL: payload.next,
                loadMoreLoading: false,
            };
        case TYPES.LOAD_MORE_FAVORITES_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loadMoreLoading: false,
            };
        case TYPES.UPVOTING_FAVORITE_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UPVOTING_FAVORITE_ASSET_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.UPVOTING_FAVORITE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_FAVORITE_ASSET_REQUEST:
            return {
                ...state,
                loading: false,
            };
        case TYPES.UNUPVOTING_FAVORITE_ASSET_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: false, vote_count: --asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.UNUPVOTING_FAVORITE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSETS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSETS_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.filter((asset) => asset.guid !== payload.guid),
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        // case TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_REQUEST:
        //     return {
        //         ...state,
        //         visibilityLoading: true,
        //     };
        case TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((item) =>
                    item.guid === payload.assetGuid ? payload.updatedAsset : item,
                ),
            };
        case TYPES.UPDATE_VISIBILITY_FAVORITE_ASSET_FAIL:
            return {
                ...state,
                visibilityLoading: false,
            };
        case TYPES.FAV_ASSET_BUY_NOW_SECCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((asset) =>
                    asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                ),
            };
        case TYPES.FAV_ASSET_PLACE_A_BID_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((asset) =>
                    asset.guid === payload.asset_guid
                        ? {
                              ...asset,
                              base_node: {
                                  ...asset?.base_node,
                                  auctions: asset?.base_node?.auctions?.map((x) =>
                                      x.guid === payload.auction_guid
                                          ? {
                                                ...x,
                                                bid_count: x?.bid_count + 1,
                                                last_bid: payload?.bid,
                                            }
                                          : x,
                                  ),
                              },
                          }
                        : { ...asset },
                ),
            };
        case TYPES.MAKE_OFFER_FROM_FAVORITES_SUCCESS:
            return {
                ...state,
                favoriteAssets: state.favoriteAssets.map((asset) =>
                    asset.guid === payload.asset_guid
                        ? {
                              ...asset,
                              offers: [
                                  ...asset?.offers?.filter(
                                      (offer) => offer?.guid !== payload?.old_offer_guid,
                                  ),
                                  payload?.new_offer,
                              ],
                          }
                        : asset,
                ),
            };
        default:
            return state;
    }
};

export default favoriteAssetsReducer;
