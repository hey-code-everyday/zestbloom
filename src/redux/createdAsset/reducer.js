import * as TYPES from './types.js';

const initialState = {
    createdAssets: [],
    loadMoreURL: null,
    createdAssetLoading: true,
    failMessage: {
        error: false,
        message: '',
    },
    visibilityLoading: false,
    loadMoreLoading: false,
};

const createdAssetsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_CREATED_ASSETS_REQUEST:
            return {
                ...state,
                createdAssetLoading: true,
                createdAssets: [],
                loadMoreURL: '',
            };
        case TYPES.GET_CREATED_ASSETS_SUCCESS:
            return {
                ...state,
                createdAssets: payload.data,
                loadMoreURL: payload.next,
                createdAssetLoading: false,
            };
        case TYPES.GET_CREATED_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                createdAssetLoading: false,
            };
        case TYPES.CLEAN_CREATED_ASSETS_SUCCESS:
            return {
                ...state,
                createdAssets: [],
                loadMoreURL: '',
            };
        // case TYPES.UPDATE_VISIBILITY_CREATED_ASSET_REQUEST:
        //     return {
        //         ...state,
        //         visibilityLoading: true,
        //     };
        case TYPES.UPDATE_VISIBILITY_CREATED_ASSET_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((item) =>
                    item.guid === payload.assetGuid ? payload.updatedAsset : item,
                ),
            };
        case TYPES.UPDATE_VISIBILITY_CREATED_ASSET_FAIL:
            return {
                ...state,
                visibilityLoading: false,
            };
        case TYPES.LOAD_MORE_ASSETS_REQUEST:
            return {
                ...state,
                loadMoreLoading: true,
            };
        case TYPES.LOAD_MORE_ASSETS_SUCCESS:
            return {
                ...state,
                createdAssets: [...state.createdAssets, ...payload.data],
                loadMoreURL: payload.next,
                loadMoreLoading: false,
            };
        case TYPES.LOAD_MORE_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loadMoreLoading: false,
            };
        case TYPES.UPVOTING_CREATED_ASSET_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                        : { ...asset },
                ),
                createdAssetLoading: false,
            };
        case TYPES.UNUPVOTING_CREATED_ASSET_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: false, vote_count: --asset.vote_count }
                        : { ...asset },
                ),
                createdAssetLoading: false,
            };
        case TYPES.TO_FAVORITES_CREATED_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: true } : { ...asset },
                ),
                createdAssetLoading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_CREATED_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: false } : { ...asset },
                ),
                createdAssetLoading: false,
            };
        case TYPES.REMOVE_ASSET_CREATED:
            return {
                ...state,
                createdAssets: state.createdAssets.filter((asset) => asset?.guid !== payload.guid),
            };
        case TYPES.CR_ASSET_BUY_NOW_SECCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
                    asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                ),
            };
        case TYPES.CR_ASSET_PLACE_A_BID_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
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
        case TYPES.MAKE_OFFER_FROM_CREATED_SUCCESS:
            return {
                ...state,
                createdAssets: state.createdAssets.map((asset) =>
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
            return {
                ...state,
            };
    }
};

export default createdAssetsReducer;
