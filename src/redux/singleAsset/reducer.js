import * as TYPES from './types.js';

const initialState = {
    loading: false,
    getAssetLoading: false,
    pageNotFound: false,
    currentAsset: {},
    assetsWithSameTag: [],
    failMessage: {
        error: false,
        message: '',
    },
    reportTemplates: [],
    visibilityLoading: false,
    activities: [],
    loadMoreActivitiesURL: '',
    reloadAsset: 0,
    timeoutId: null,
};

const singleAssetReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_ONE_ASSET_REQUEST:
            return {
                ...state,
                getAssetLoading: true,
            };
        case TYPES.GET_ONE_ASSET_SUCCESS:
            return {
                ...state,
                currentAsset: payload.data,
                getAssetLoading: false,
            };
        case TYPES.GET_ONE_ASSET_FAIL:
            return {
                ...state,
                getAssetLoading: false,
                pageNotFound: true,
            };
        case TYPES.CHANGE_ASSET_VISIBILITY_REQUEST:
            return {
                ...state,
                visibilityLoading: true,
            };
        case TYPES.CHANGE_ASSET_VISIBILITY_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    nodes: state.currentAsset?.nodes?.map((x) =>
                        x.guid === payload.nodeGuid ? { ...x, visibility: payload.visibility } : x,
                    ),
                },
                visibilityLoading: false,
            };
        case TYPES.CHANGE_ASSET_VISIBILITY_FAIL:
            return {
                ...state,
                visibilityLoading: false,
            };

        case TYPES.EMPTY_ONE_ASSET:
            return {
                ...state,
                currentAsset: {},
                pageNotFound: false,
            };
        case TYPES.UPVOTING_ONE_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UPVOTING_ONE_ASSET_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    voted: true,
                    vote_count: ++state.currentAsset.vote_count,
                },
                loading: false,
            };
        case TYPES.UPVOTING_ONE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_ONE_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UNUPVOTING_ONE_ASSET_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    voted: false,
                    vote_count: --state.currentAsset.vote_count,
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_ONE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.ADD_TO_FAVORITES_ONE_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.ADD_TO_FAVORITES_ONE_ASSET_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    favorite: true,
                    favorite_count: ++state.currentAsset.favorite_count,
                },
                loading: true,
            };
        case TYPES.ADD_TO_FAVORITES_ONE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    favorite: false,
                    favorite_count: --state.currentAsset.favorite_count,
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.GET_ASSETS_WITH_SAME_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_ASSETS_WITH_SAME_TAG_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: payload.data,
                loading: false,
            };
        case TYPES.GET_ASSETS_WITH_SAME_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.UPVOTING_ASSET_WITH_SAME_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UPVOTING_ASSET_WITH_SAME_TAG_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.UPVOTING_ASSET_WITH_SAME_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
                    asset.guid === payload.guid
                        ? { ...asset, voted: false, vote_count: --asset.vote_count }
                        : { ...asset },
                ),
                loading: false,
            };
        case TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: true } : { ...asset },
                ),
                loading: false,
            };
        case TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
                    asset.guid === payload.guid ? { ...asset, favorite: false } : { ...asset },
                ),
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.GET_REPORT_TEMPLATES_REQUEST:
            return {
                ...state,
            };
        case TYPES.GET_REPORT_TEMPLATES_SUCCESS:
            return {
                ...state,
                reportTemplates: payload.templates,
            };
        case TYPES.GET_REPORT_TEMPLATES_FAIL:
            return {
                ...state,
            };
        case TYPES.DELETE_CONTRACT_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    base_node:
                        state?.currentAsset?.base_node?.guid === payload?.guid
                            ? {
                                  ...state.currentAsset.base_node,
                                  sales: [],
                              }
                            : { ...state.currentAsset.base_node },
                    nodes: state?.currentAsset?.nodes?.map((node) =>
                        node?.guid === payload?.guid ? { ...node, sales: [] } : node,
                    ),
                },
            };
        case TYPES.CANCEL_OFFER_SUCCESS:
            return {
                ...state,
                currentAsset: {
                    ...state.currentAsset,
                    offers: state.currentAsset?.offers?.filter((x) => x.guid !== payload.guid),
                },
            };
        case TYPES.GET_SINGLE_ASSET_ACTIVITIES_SUCCESS:
            return {
                ...state,
                activities: payload.data,
                loadMoreActivitiesURL: payload.next,
            };
        case TYPES.LOAD_MORE_SINGLE_ASSET_ACTIVITIES_SUCCESS:
            return {
                ...state,
                activities: [...state.activities, ...payload.data],
                loadMoreActivitiesURL: payload.next,
            };
        case TYPES.RELOAD_ASSET_SUCCESS: {
            return {
                ...state,
                reloadAsset: state.reloadAsset + 1,
            };
        }
        case TYPES.SET_TIMEOUT_ID: {
            return {
                ...state,
                timeoutId: payload,
            };
        }
        case TYPES.MORE_TG_ASSET_BUY_NOW_SECCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
                    asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                ),
            };
        case TYPES.MORE_TG_ASSET_PLACE_A_BID_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
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
        case TYPES.MAKE_OFFER_FROM_SINGLE_PG_SAME_TAGS_SUCCESS:
            return {
                ...state,
                assetsWithSameTag: state.assetsWithSameTag.map((asset) =>
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
        case TYPES.REMOVE_ASSET_WITH_SAME_TAGS:
            return {
                ...state,
                assetsWithSameTag: state.createdAssets.filter(
                    (asset) => asset?.guid !== payload.guid,
                ),
            };
        default:
            return state;
    }
};

export default singleAssetReducer;
