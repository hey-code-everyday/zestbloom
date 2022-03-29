import * as TYPES from './types.js';
import AssetsServise from './services';

export const deleteOfferFromAsset = (guid) => ({
    type: TYPES.CANCEL_OFFER_SUCCESS,
    payload: { guid },
});

export const buyNowSuccess = (asset_guid) => ({
    type: TYPES.MORE_TG_ASSET_BUY_NOW_SECCESS,
    payload: {
        asset_guid,
    },
});

export const setReloadAsset = () => ({ type: TYPES.RELOAD_ASSET_SUCCESS });

export const placeABidAction = ({ asset_guid, auction_guid, bid }) => ({
    type: TYPES.MORE_TG_ASSET_PLACE_A_BID_SUCCESS,
    payload: {
        asset_guid,
        auction_guid,
        bid,
    },
});

export const removeAsset = (guid) => ({
    type: TYPES.REMOVE_ASSET_WITH_SAME_TAGS,
    payload: { guid },
});

export const afterMakeAnOffer = ({ asset_guid, old_offer_guid, new_offer }) => ({
    type: TYPES.MAKE_OFFER_FROM_SINGLE_PG_SAME_TAGS_SUCCESS,
    payload: { asset_guid, old_offer_guid, new_offer },
});

export const getCurrentAsset = (guid, search) => (dispatch) => {
    dispatch({ type: TYPES.GET_ONE_ASSET_REQUEST });
    return AssetsServise.getCurrentAssets(guid)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_ONE_ASSET_SUCCESS,
                    payload: { data: response.data },
                });
            }
            dispatch({ type: TYPES.GET_ONE_ASSET_FAIL });
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: TYPES.GET_ONE_ASSET_FAIL });
        });
};

export const getMyCurrentAsset = (guid, search) => (dispatch) => {
    dispatch({ type: TYPES.GET_ONE_ASSET_REQUEST });
    return AssetsServise.getMyCurrentAsset(guid)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_ONE_ASSET_SUCCESS,
                    payload: { data: response.data },
                });
            }
            dispatch({ type: TYPES.GET_ONE_ASSET_FAIL });
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: TYPES.GET_ONE_ASSET_FAIL });
        });
};

export const upVoteCurrentAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UPVOTING_ONE_ASSET_REQUEST });
    return AssetsServise.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_ONE_ASSET_SUCCESS,
                });
            }
            return dispatch({
                type: TYPES.UPVOTING_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while upvoting favorte assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UPVOTING_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while upvoting favorte assets',
                },
            });
        });
};
export const unUpVoteCurrentAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UNUPVOTING_ONE_ASSET_REQUEST });
    return AssetsServise.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_ONE_ASSET_SUCCESS,
                });
            }
            return dispatch({
                type: TYPES.UNUPVOTING_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while unupvoting favorte assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UNUPVOTING_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while unupvoting favorte assets',
                },
            });
        });
};

export const toFavoriteCurrentAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.ADD_TO_FAVORITES_ONE_ASSET_REQUEST });
    return AssetsServise.addToFavorites(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.ADD_TO_FAVORITES_ONE_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.ADD_TO_FAVORITES_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while add asset to favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.ADD_TO_FAVORITES_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while add asset to favorites',
                },
            });
        });
};

export const removeFromFavoritesCurrentAsset = (guid) => (dispatch) => {
    dispatch({ type: TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_REQUEST });
    return AssetsServise.removeFromFavorites(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ONE_ASSET_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        });
};
export const getAssetsWithSameTag = (tag) => (dispatch) => {
    dispatch({ type: TYPES.GET_ASSETS_WITH_SAME_TAG_REQUEST });
    return AssetsServise.getAssetsWithSameTag(tag)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_ASSETS_WITH_SAME_TAG_SUCCESS,
                    payload: { data: response.data.results },
                });
            }
            return dispatch({
                type: TYPES.GET_ASSETS_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while getting asset with tag',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_ASSETS_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while getting asset with tag',
                },
            });
        });
};

export const upvoteAssetWithSameTag = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UPVOTING_ASSET_WITH_SAME_TAG_REQUEST });
    return AssetsServise.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.UPVOTING_ASSET_WITH_SAME_TAG_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UPVOTING_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while upvoting asset',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UPVOTING_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while upvoting asset',
                },
            });
        });
};
export const unUpvoteAssetWithSameTag = (guid) => (dispatch) => {
    dispatch({ type: TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_REQUEST });
    return AssetsServise.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while unupvoting asset',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.UNUPVOTING_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while unupvoting asset',
                },
            });
        });
};

export const toFavoriteAssetWithSameTag = (guid) => (dispatch) => {
    dispatch({ type: TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_REQUEST });
    return AssetsServise.addToFavorites(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while add asset to favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.ADD_TO_FAVORITES_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while add asset to favorites',
                },
            });
        });
};

export const removeFromFavoritesAssetWithSameTag = (guid) => (dispatch) => {
    dispatch({ type: TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_REQUEST });
    return AssetsServise.removeFromFavorites(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch({
                    type: TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_SUCCESS,
                    payload: { guid },
                });
            }
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.REMOVE_FROM_FAVORITES_ASSET_WITH_SAME_TAG_FAIL,
                payload: {
                    message: 'Error while removing assets from favorites',
                },
            });
        });
};

export const emptyCurrentAsset = () => ({ type: TYPES.EMPTY_ONE_ASSET });

export const changeAssetVisibility = (guid, values) => (dispatch) => {
    dispatch({ type: TYPES.CHANGE_ASSET_VISIBILITY_REQUEST });
    return AssetsServise.changeVisibility(guid, values)
        .then((response) => {
            if (response.status === 200) {
                const nodeVisibility = response?.data?.nodes?.find(
                    (x) => x.guid === guid,
                )?.visibility;
                return dispatch({
                    type: TYPES.CHANGE_ASSET_VISIBILITY_SUCCESS,
                    payload: { visibility: nodeVisibility, nodeGuid: guid },
                });
            }
            return dispatch({ type: TYPES.CHANGE_ASSET_VISIBILITY_FAIL, payload: { error: '' } });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({ type: TYPES.CHANGE_ASSET_VISIBILITY_FAIL, payload: { error: '' } });
        });
};

export const updateAsset = (guid, values) => (dispatch) => {
    dispatch({ type: TYPES.UPDATE_ASSET_REQUEST });
    return AssetsServise.updateAsset(guid, values)
        .then((response) => {
            if (response.status === 200) {
                dispatch({ type: TYPES.UPDATE_ASSET_SUCCESS });
                return response;
            }
            dispatch({ type: TYPES.UPDATE_ASSET_FAIL, payload: { error: '' } });
            return response;
        })
        .catch((err) => {
            console.log(err);
            return dispatch({ type: TYPES.UPDATE_ASSET_FAIL, payload: { error: '' } });
        });
};

export const getReportTemplates = () => (dispatch) => {
    dispatch({ type: TYPES.GET_REPORT_TEMPLATES_REQUEST });
    return AssetsServise.getReportTemplates()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_REPORT_TEMPLATES_SUCCESS,
                    payload: { templates: response.data },
                });
            }
            return dispatch({ type: TYPES.GET_REPORT_TEMPLATES_FAIL, payload: { error: '' } });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({ type: TYPES.GET_REPORT_TEMPLATES_FAIL, payload: { error: '' } });
        });
};

export const sendIssueReports = (reports) => (dispatch) => {
    dispatch({ type: TYPES.SEND_REPORTS_REQUEST });
    return AssetsServise.sendIssueReports(reports)
        .then((response) => {
            if (response.status === 201) {
                dispatch({
                    type: TYPES.SEND_REPORTS_SUCCESS,
                });
            } else {
                return dispatch({ type: TYPES.SEND_REPORTS_FAIL, payload: { error: '' } });
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: TYPES.SEND_REPORTS_FAIL, payload: { error: '' } });
            return err?.response;
        });
};

export const deleteContract = (guid) => ({
    type: TYPES.DELETE_CONTRACT_SUCCESS,
    payload: { guid },
});

export const getActivities = (guid) => (dispatch) => {
    dispatch({
        type: TYPES.GET_SINGLE_ASSET_ACTIVITIES_REQUEST,
    });
    return AssetsServise.getActivities(guid)
        .then((response) => {
            if (response.status === 200) {
                dispatch({
                    type: TYPES.GET_SINGLE_ASSET_ACTIVITIES_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            } else {
                return dispatch({
                    type: TYPES.GET_SINGLE_ASSET_ACTIVITIES_FAIL,
                    payload: { error: '' },
                });
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: TYPES.GET_SINGLE_ASSET_ACTIVITIES_FAIL, payload: { error: '' } });
            return err?.response;
        });
};

export const loadMoreActivities = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_SINGLE_ASSET_ACTIVITIES_REQUEST });
    return AssetsServise.loadMoreActivities(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_SINGLE_ASSET_ACTIVITIES_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_SINGLE_ASSET_ACTIVITIES_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_SINGLE_ASSET_ACTIVITIES_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        });
};

export const ubdateAssetWithTaskId = (taskId) => (dispatch) => {
    let timeoutId;
    return AssetsServise.getAssetInfoTask(taskId)
        .then((response) => {
            if (response.status === 200) {
                if (response?.data?.task_status !== 'SUCCESS') {
                    timeoutId = setTimeout(() => {
                        return dispatch(ubdateAssetWithTaskId(response?.data?.task_id));
                    }, 5000);
                    return dispatch({
                        type: TYPES.SET_TIMEOUT_ID,
                        payload: timeoutId,
                    });
                }

                const isUpdate = response?.data?.results?.updated;
                if (isUpdate) dispatch(setReloadAsset());
            }
        })
        .catch((err) => {
            console.log(err);
            if (timeoutId) clearTimeout(timeoutId);
        });
};
