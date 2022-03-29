import * as TYPES from './types.js';
import MarketplaceService from './services';

export const removeAsset = (guid) => ({
    type: TYPES.REMOVE_ASSET_MARKETPLACE,
    payload: { guid },
});

export const setValueSearchFromHome = (payload) => ({
    type: TYPES.SET_VALUE_SEARCH_FROM_HOME_SUCCESS,
    payload,
});

export const setFilterByTagFromSide = (payload) => ({
    type: TYPES.SET_FILTER_BY_TAG_FROM_HOME,
    payload,
});

export const searchPeopleFromFooter = (viewType, sort) => ({
    type: TYPES.SEARCH_PEOPLE_FROM_FOOTER_SUCCESS,
    payload: { viewType, sort },
});

export const moveMarketplaceFromFeatured = (bool) => ({
    type: TYPES.FROM_FEATURED_ARTIST_SUCCES,
    payload: { bool },
});

export const placeABidAction = ({ asset_guid, auction_guid, bid }) => ({
    type: TYPES.MARKETPLACE_PLACE_A_BID_SUCCESS,
    payload: {
        asset_guid,
        auction_guid,
        bid,
    },
});

export const buyNowSuccess = (asset_guid) => ({
    type: TYPES.MARKETPLACE_ASSET_BUY_NOW_SECCESS,
    payload: {
        asset_guid,
    },
});

export const afterMakeAnOffer = ({ asset_guid, old_offer_guid, new_offer }) => ({
    type: TYPES.MAKE_OFFER_FROM_MARKETPLACE_SUCCESS,
    payload: { asset_guid, old_offer_guid, new_offer },
});

export const getUsers = (filter, currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_USERS_REQUEST });
    return MarketplaceService.getMarketplaceUsers(filter, currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_USERS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_USERS_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_USERS_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        });
};
export const getMinCardPeople = (filter, currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_MIN_CARD_PEOPLE_REQUEST });
    return MarketplaceService.getUsers('?sort_by=random' + filter, currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_MIN_CARD_PEOPLE_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_MIN_CARD_PEOPLE_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_MIN_CARD_PEOPLE_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        });
};
export const getFeaturedArtists = (currentRequest) => (dispatch) => {
    const filter = '?collection=featured-artist&page_size=30';
    dispatch({ type: TYPES.GET_FEATURED_ARTISTS_REQUETS });
    return MarketplaceService.getUsers(filter, currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_FEATURED_ARTISTS_SUCCESS,
                    payload: {
                        data: response.data.results,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_FEATURED_ARTISTS_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_FEATURED_ARTISTS_FAIL,
                payload: {
                    message: 'Error while receiving users',
                },
            });
        });
};

export const getBannerPlaceholder = () => (dispatch) => {
    dispatch({ type: TYPES.GET_BANNER_PLACEHOLDER_REQUEST });
    return MarketplaceService.getBanners()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_BANNER_PLACEHOLDER_SUCCESS,
                    payload: {
                        data: response.data,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_BANNER_PLACEHOLDER_FAIL,
                payload: {
                    message: 'Error while receiving banners',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_BANNER_PLACEHOLDER_FAIL,
                payload: {
                    message: 'Error while receiving banners',
                },
            });
        });
};

export const loadMoreMarketplaceUsers = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_USERS_REQUEST });
    return MarketplaceService.loadMoreUsers(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_USERS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_USERS_FAIL,
                payload: {
                    message: 'Error while receiving load more users',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_USERS_FAIL,
                payload: {
                    message: 'Error while receiving load more users',
                },
            });
        });
};
export const getAssetsForMarketPlace = (filter, category, currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_MARKETPLACE_ASSETS_REQUEST });
    return MarketplaceService.getAssetsForMarketPlace(filter, currentRequest)
        .then((response) => {
            if (response?.status === 200) {
                return dispatch({
                    type: TYPES.GET_MARKETPLACE_ASSETS_SUCCESS,
                    payload: {
                        category,
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        });
};

export const getRandomAssetsForMarketPlace = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_MARKETPLACE_ASSETS_REQUEST });
    return MarketplaceService.getRandomAssetsForMarketPlace(currentRequest)
        .then((response) => {
            if (response?.status === 200) {
                return dispatch({
                    type: TYPES.GET_MARKETPLACE_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        });
};

export const loadMoreMarketplaceItems = (loadMoreURL, category) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_MARKETPLACE_ASSETS_REQUEST });
    return MarketplaceService.loadMoreMarketplaceItems(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_MARKETPLACE_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                        category,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving more assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_MARKETPLACE_ASSETS_FAIL,
                payload: {
                    message: 'Error while receiving more assets',
                },
            });
        });
};

export const upvoteAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UPVOTING_ASSET_REQUEST });
    return MarketplaceService.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UPVOTING_ASSET_FAIL,
                payload: {
                    message: 'Error during upvote asset',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UPVOTING_ASSET_FAIL,
                payload: {
                    message: 'Error during upvote asset',
                },
            });
        });
};

export const unUpvoteAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UNUPVOTING_ASSET_REQUEST });
    return MarketplaceService.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UPVOTING_ASSET_FAIL,
                payload: {
                    message: 'Error during unupvote asset',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UPVOTING_ASSET_FAIL,
                payload: {
                    message: 'Error during unupvote asset',
                },
            });
        });
};
export const toFavoritesAssets = (guid) => (dispatch) => {
    dispatch({ type: TYPES.TO_FAVORITES_REQUEST });
    return MarketplaceService.toFavoritesAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.TO_FAVORITES_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.TO_FAVORITES_FAIL,
                payload: {
                    message: 'Error while adding asset to favorite',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.TO_FAVORITES_FAIL,
                payload: {
                    message: 'Error while adding asset to favorite',
                },
            });
        });
};

export const removeFromFavoritesAssets = (guid) => (dispatch) => {
    dispatch({ type: TYPES.REMOVE_FROM_FAVORITES_REQUEST });
    return MarketplaceService.removeFromFavorites(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.REMOVE_FROM_FAVORITES_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_FAIL,
                payload: {
                    message: 'Error while rremoving from favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_FAIL,
                payload: {
                    message: 'Error while rremoving from favorites',
                },
            });
        });
};

export const getAssetsTags = () => (dispatch) => {
    dispatch({ type: TYPES.GET_ASSETS_TAGS_REQUEST });
    return MarketplaceService.getAssetsTags()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_ASSETS_TAGS_SUCCESS,
                    payload: response.data,
                });
            }
            return dispatch({
                type: TYPES.GET_ASSETS_TAGS_FAIL,
                payload: {
                    message: 'Error while getting asset tages',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_ASSETS_TAGS_FAIL,
                payload: {
                    message: 'Error while getting asset tages',
                },
            });
        });
};
export const getAssetsStaticTags = () => (dispatch) => {
    dispatch({ type: TYPES.GET_ASSETS_STATIC_TAGS_REQUEST });
    return MarketplaceService.getAssetsStaticTags()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_ASSETS_STATIC_TAGS_SUCCESS,
                    payload: response.data,
                });
            }
            return dispatch({
                type: TYPES.GET_ASSETS_STATIC_TAGS_FAIL,
                payload: {
                    message: 'Error while getting asset static tages',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_ASSETS_STATIC_TAGS_FAIL,
                payload: {
                    message: 'Error while getting asset static tages',
                },
            });
        });
};

export const addAssetsTags = (name) => (dispatch) => {
    dispatch({ type: TYPES.ADD_ASSETS_TAGS_REQUEST });
    return MarketplaceService.addAssetsTags(name)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.ADD_ASSETS_TAGS_SUCCESS,
                    payload: response.data,
                });
            }
            return dispatch({
                type: TYPES.ADD_ASSETS_TAGS_FAIL,
                payload: {
                    message: 'Error while adding assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.ADD_ASSETS_TAGS_FAIL,
                payload: {
                    message: 'Error while adding assets',
                },
            });
        });
};

export const getPeopleTags = () => (dispatch) => {
    dispatch({ type: TYPES.GET_PEOPLE_TAGS_REQUEST });
    return MarketplaceService.getPeopleTags()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_PEOPLE_TAGS_SUCCESS,
                    payload: response.data,
                });
            }
            return dispatch({
                type: TYPES.GET_PEOPLE_TAGS_FAIL,
                payload: {
                    message: 'Error while getting people tags',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_PEOPLE_TAGS_FAIL,
                payload: {
                    message: 'Error while getting people tags',
                },
            });
        });
};

export const changeMarketplaceAssetVisibility = (nodeGuid, values, assetGuid) => (dispatch) => {
    dispatch({ type: TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_REQUEST });
    return MarketplaceService.updateAsset(nodeGuid, values)
        .then((response) => {
            if (response.status === 200) {
                const updatedAsset = response?.data;
                return dispatch({
                    type: TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_SUCCESS,
                    payload: { assetGuid, nodeGuid, updatedAsset },
                });
            }
            return dispatch({
                type: TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_FAIL,
                payload: { error: '' },
            });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({
                type: TYPES.CHANGE_VISIBILITY_MARKETPLACE_ASSET_FAIL,
                payload: { error: '' },
            });
        });
};

export const getAssetsForMarketPlaceByTag = (filter, tag) => (dispatch) => {
    dispatch({ type: TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_REQUEST });
    return MarketplaceService.getAssetsForMarketPlace(filter)
        .then((response) => {
            if (response?.status === 200) {
                return dispatch({
                    type: TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_SUCCESS,
                    payload: {
                        tag,
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_MARKETPLACE_ASSETS_BY_TAG_FAIL,
                payload: {
                    message: 'Error while receiving assets',
                },
            });
        });
};

export const updateAssetVisibilities = (payload) => (dispatch) => {
    dispatch({ type: TYPES.CALL_ASSETS_ACTION_REQUEST });
    return MarketplaceService.updateVisibilityOfAssets(payload)
        .then((response) => {
            if (response?.status !== 200) {
                return response.data;
            }
            return dispatch({
                type: TYPES.CALL_ASSETS_ACTION_FAIL,
                payload: {
                    message: 'Error while updating visibilities of assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.CALL_ASSETS_ACTION_FAIL,
                payload: {
                    message: 'Error while updating visibilities of assets',
                },
            });
        });
};
