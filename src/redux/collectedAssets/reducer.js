import * as TYPES from './types.js';

const initialState = {
    collectedAssets: [],
    loadMoreURLCollectedAssets: '',
    loading: false,
    failMessage: {
        error: false,
        message: '',
    },
    visibilityLoading: false,
    loadMoreLoading: false,
    collectedAssetLoading: false,
};

const collectedAssetsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_COLLECTED_ASSETS_REQUEST:
            return {
                ...state,
                collectedAssetLoading: true,
                collectedAssets: [],
                loadMoreURLCollectedAssets: '',
            };
        case TYPES.GET_COLLECTED_ASSETS_SUCCESS:
            return {
                ...state,
                collectedAssets: payload.data,
                loadMoreURLCollectedAssets: payload.next,
                collectedAssetLoading: false,
            };
        case TYPES.GET_COLLECTED_ASSETS_FAIL:
            return {
                ...state,
                collectedAssetLoading: false,
            };
        case TYPES.CLEAN_CREATED_COLLECTED_SUCCESS:
            return {
                ...state,
                collectedAssets: [],
                loadMoreURLCollectedAssets: '',
            };
        case TYPES.LOAD_MORE_COLLECTED_ASSETS_REQUEST:
            return {
                ...state,
                loadMoreLoading: true,
            };
        case TYPES.LOAD_MORE_COLLECTED_ASSETS_SUCCESS:
            return {
                ...state,
                collectedAssets: [...state.collectedAssets, ...payload.data],
                loadMoreURLCollectedAssets: payload.next,
                loadMoreLoading: false,
            };
        case TYPES.LOAD_MORE_COLLECTED_ASSETS_FAIL:
            return {
                ...state,
                loadMoreLoading: false,
            };
        case TYPES.UPVOTING_COLLECTED_ASSET_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.UNUPVOTING_COLLECTED_ASSET_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: false, vote_count: --asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.TO_FAVORITES_COLLECTED_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: true } : { ...asset },
                ),
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_COLLECTED_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: false } : { ...asset },
                ),
                loading: false,
            };
        // case TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_REQUEST:
        //     return {
        //         ...state,
        //         visibilityLoading: true,
        //     };
        case TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((item) =>
                    item.guid === payload.assetGuid ? payload.updatedAsset : item,
                ),
            };
        case TYPES.UPDATE_VISIBILITY_COLLECTED_ASSET_FAIL:
            return {
                ...state,
                visibilityLoading: false,
            };
        case TYPES.COLL_ASSET_BUY_NOW_SECCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
                    asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                ),
            };
        case TYPES.COLL_ASSET_PLACE_A_BID_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
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
        case TYPES.MAKE_OFFER_FROM_COLLECTED_SUCCESS:
            return {
                ...state,
                collectedAssets: state.collectedAssets.map((asset) =>
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
        case TYPES.REMOVE_ASSET_COLLECTED:
            return {
                ...state,
                collectedAssets: state.collectedAssets.filter(
                    (asset) => asset?.guid !== payload.guid,
                ),
            };
        default:
            return state;
    }
};

export default collectedAssetsReducer;
