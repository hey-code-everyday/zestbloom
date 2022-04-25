import * as TYPES from './types';
import * as PROFILE_TYPES from '../profile/types';

const initialState = {
    users: [],
    minCardPeople: [],
    loadMoreUsersURL: null,
    marketplaceAssets: {},
    loadMoreMarkURL: {},
    assetsTags: [],
    assetsStaticTags: [],
    peopleTags: [],
    failMessage: {
        error: false,
        message: '',
    },
    loading: false,
    peopleFromFooter: { viewType: '', sort: '' },
    searchFromHomePage: '',
    filterByTagFromSide: null,
    visibilityLoading: false,
    loadMoreLoading: false,
    featuredArtist: [],
    fromFeaturedArtist: false,
    bannerPlaceholder: [],
    bannerPlaceholderLoading: false,
    getMarketplaceAssetsLoading: false,
    callingAssetsAction: false,
    initBannerPlaceholderState: false,
    initFeaturedArtistState: false,
};

const marketplaceReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_USERS_REQUEST:
            return {
                ...state,
                getUsersLoading: true,
            };
        case TYPES.GET_USERS_SUCCESS:
            return {
                ...state,
                users: payload.data,
                loadMoreUsersURL: payload.next,
                getUsersLoading: false,
            };
        case TYPES.GET_USERS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                getUsersLoading: false,
            };
        case TYPES.GET_MIN_CARD_PEOPLE_REQUEST:
            return {
                ...state,
                minCardPeopleloading: true,
            };
        case TYPES.GET_MIN_CARD_PEOPLE_SUCCESS: {
            return {
                ...state,
                minCardPeople: payload.data,
                minCardPeopleloading: false,
            };
        }
        case TYPES.GET_MIN_CARD_PEOPLE_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                minCardPeopleloading: false,
            };
        case TYPES.LOAD_MORE_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.LOAD_MORE_USERS_SUCCESS:
            return {
                ...state,
                users: [...state.users, ...payload.data],
                loadMoreUsersURL: payload.next,
                loading: false,
            };
        case TYPES.LOAD_MORE_USERS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.REMOVE_MARKETPLACE_SEARCH_RESULT:
            return {
                ...state,
                marketplaceAssets: {},
            };
        case TYPES.GET_MARKETPLACE_ASSETS_REQUEST:
            return {
                ...state,
                marketplaceAssets: {},
                getMarketplaceAssetsLoading: true,
            };
        case TYPES.GET_MARKETPLACE_ASSETS_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    [payload.category]: payload.data,
                },
                loadMoreMarkURL: {
                    ...state.loadMoreMarkURL,
                    [payload.category]: payload.next,
                },
                getMarketplaceAssetsLoading: false,
            };
        case TYPES.GET_MARKETPLACE_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                getMarketplaceAssetsLoading: false,
            };
        case TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_REQUEST:
            return {
                ...state,
                getMarketplaceAssetsLoading: true,
            };
        case TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    [payload.tag]: payload.data,
                },
                loadMoreMarkURL: {
                    ...state.loadMoreMarkURL,
                    [payload.tag]: payload.next,
                },
                getMarketplaceAssetsLoading: false,
            };
        case TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                getMarketplaceAssetsLoading: false,
            };

        // case TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_REQUEST: {
        //     return {
        //         ...state,
        //         visibilityLoading: true,
        //     };
        // }
        case TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_SUCCESS: {
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets.all_assets.map((item) =>
                        item.guid === payload.assetGuid ? payload.updatedAsset : item,
                    ),
                    featured_work: state.marketplaceAssets.featured_work.map((item) =>
                        item.guid === payload.assetGuid ? payload.updatedAsset : item,
                    ),
                },
            };
        }
        case TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_FAIL: {
            return {
                ...state,
                visibilityLoading: false,
            };
        }
        case TYPES.LOAD_MORE_MARKETPLACE_ASSETS_REQUEST:
            return {
                ...state,
                loadMoreLoading: true,
            };
        case TYPES.LOAD_MORE_MARKETPLACE_ASSETS_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    [payload.category]: [
                        ...(state.marketplaceAssets[payload.category] ?? []),
                        ...payload.data,
                    ],
                },
                loadMoreMarkURL: {
                    ...state.loadMoreMarkURL,
                    [payload.category]: payload.next,
                },
                loadMoreLoading: false,
            };
        case TYPES.LOAD_MORE_MARKETPLACE_ASSETS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loadMoreLoading: false,
            };
        case TYPES.UPVOTING_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UPVOTING_ASSET_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets?.all_assets?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                            : asset,
                    ),
                    featured_work: state.marketplaceAssets?.featured_work?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, voted: true, vote_count: ++asset.vote_count }
                            : asset,
                    ),
                },
                loading: false,
            };
        case TYPES.UPVOTING_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_ASSET_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UNUPVOTING_ASSET_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets?.all_assets?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, voted: false, vote_count: --asset.vote_count }
                            : asset,
                    ),
                    featured_work: state.marketplaceAssets?.featured_work?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, voted: false, vote_count: --asset.vote_count }
                            : asset,
                    ),
                },
                loading: false,
            };
        case TYPES.UNUPVOTING_ASSET_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.TO_FAVORITES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.TO_FAVORITES_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets?.all_assets?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, favorite: true, favorite_count: ++asset.favorite_count }
                            : asset,
                    ),
                    featured_work: state.marketplaceAssets?.featured_work?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, favorite: true, favorite_count: ++asset.favorite_count }
                            : asset,
                    ),
                },
                loading: false,
            };
        case TYPES.TO_FAVORITES_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.REMOVE_FROM_FAVORITES_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets?.all_assets?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, favorite: false, favorite_count: --asset.favorite_count }
                            : asset,
                    ),
                    featured_work: state.marketplaceAssets?.featured_work?.map((asset) =>
                        asset.guid === payload.guid
                            ? { ...asset, favorite: false, favorite_count: --asset.favorite_count }
                            : asset,
                    ),
                },
                loading: false,
            };
        case TYPES.REMOVE_FROM_FAVORITES_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.GET_ASSETS_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_ASSETS_TAGS_SUCCESS:
            return {
                ...state,
                assetsTags: payload,
                loading: true,
            };
        case TYPES.GET_ASSETS_TAGS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.GET_ASSETS_STATIC_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_ASSETS_STATIC_TAGS_SUCCESS:
            return {
                ...state,
                assetsStaticTags: payload,
                loading: false,
            };
        case TYPES.GET_ASSETS_STATIC_TAGS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.ADD_ASSETS_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.ADD_ASSETS_TAGS_SUCCESS:
            return {
                ...state,
                assetsTags: [...state.assetsTags, payload],
                loading: false,
            };
        case TYPES.ADD_ASSETS_TAGS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.GET_PEOPLE_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_PEOPLE_TAGS_SUCCESS:
            return {
                ...state,
                peopleTags: payload,
                loading: false,
            };
        case TYPES.GET_PEOPLE_TAGS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
            };
        case TYPES.SEARCH_PEOPLE_FROM_FOOTER_SUCCESS:
            return {
                ...state,
                peopleFromFooter: payload,
            };
        case TYPES.SET_VALUE_SEARCH_FROM_HOME_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.SET_VALUE_SEARCH_FROM_HOME_SUCCESS:
            return {
                ...state,
                searchFromHomePage: payload,
                loading: false,
            };
        case TYPES.SET_VALUE_SEARCH_FROM_HOME_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.SET_FILTER_BY_TAG_FROM_HOME:
            return {
                ...state,
                filterByTagFromSide: payload,
            };
        case TYPES.GET_FEATURED_ARTISTS_SUCCESS:
            return {
                ...state,
                featuredArtist: payload.data,
                initFeaturedArtistState: true,
            };
        case TYPES.GET_FEATURED_ARTISTS_REQUETS:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_FEATURED_ARTISTS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
                initFeaturedArtistState: true,
            };
        case TYPES.FROM_FEATURED_ARTIST_SUCCESS:
            return {
                ...state,
                fromFeaturedArtist: payload.bool,
            };
        case TYPES.GET_BANNER_PLACEHOLDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_BANNER_PLACEHOLDER_SUCCESS:
            return {
                ...state,
                bannerPlaceholder: payload.data,
                loading: false,
                initBannerPlaceholderState: true,
            };
        case TYPES.GET_BANNER_PLACEHOLDER_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.messagere,
                },
                loading: false,
                initBannerPlaceholderState: true,
            };
        case PROFILE_TYPES.UNFOLLOW_USER: {
            return {
                ...state,
                users: state.users.map((user) => {
                    if (user.username === payload.username && user.follow) {
                        return {
                            ...user,
                            followers_count: user.followers_count - 1,
                            follow: false,
                        };
                    }

                    return user;
                }),
            };
        }
        case PROFILE_TYPES.FOLLOW_USER: {
            return {
                ...state,
                users: state.users.map((user) => {
                    if (user.username === payload.username && !user.follow) {
                        return {
                            ...user,
                            followers_count: user.followers_count + 1,
                            follow: true,
                        };
                    }

                    return user;
                }),
            };
        }
        case TYPES.MARKETPLACE_ASSET_BUY_NOW_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets.all_assets.map((asset) =>
                        asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                    ),
                    featured_work: state.marketplaceAssets.featured_work.map((asset) =>
                        asset.guid === payload.asset_guid ? { ...asset, base_node: null } : asset,
                    ),
                },
            };
        case TYPES.MARKETPLACE_PLACE_A_BID_SUCCESS: {
            const changeAsset = (assets) =>
                assets.map((asset) =>
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
                );
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: changeAsset(state?.marketplaceAssets?.all_assets),
                    featured_work: changeAsset(state?.marketplaceAssets?.featured_work),
                },
            };
        }
        case TYPES.MAKE_OFFER_FROM_MARKETPLACE_SUCCESS:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets.all_assets.map((asset) =>
                        asset.guid === payload.asset_guid
                            ? {
                                  ...asset,
                                  offers: asset?.offers
                                      ? [
                                            ...asset?.offers?.filter(
                                                (offer) => offer?.guid !== payload?.old_offer_guid,
                                            ),
                                            payload?.new_offer,
                                        ]
                                      : [payload?.new_offer],
                              }
                            : asset,
                    ),
                    featured_work: state.marketplaceAssets.featured_work.map((asset) =>
                        asset.guid === payload.asset_guid
                            ? {
                                  ...asset,
                                  offers: asset?.offers
                                      ? [
                                            ...asset?.offers?.filter(
                                                (offer) => offer?.guid !== payload?.old_offer_guid,
                                            ),
                                            payload?.new_offer,
                                        ]
                                      : [payload?.new_offer],
                              }
                            : asset,
                    ),
                },
            };
        case TYPES.CALL_ASSETS_ACTION_REQUEST:
            return {
                ...state,
                callingAssetsAction: true,
            };
        case TYPES.CALL_ASSETS_ACTION_FAIL:
            return {
                ...state,
                callingAssetsAction: false,
                failMessage: { error: true, message: payload.message },
            };
        case TYPES.REMOVE_ASSET_MARKETPLACE:
            return {
                ...state,
                marketplaceAssets: {
                    ...state.marketplaceAssets,
                    all_assets: state.marketplaceAssets.all_assets.filter(
                        (asset) => asset?.guid !== payload.guid,
                    ),
                    featured_work: state.marketplaceAssets.featured_work.filter(
                        (asset) => asset?.guid !== payload.guid,
                    ),
                },
            };
        default:
            return state;
    }
};

export default marketplaceReducer;
