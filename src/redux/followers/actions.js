import * as TYPES from './types.js';
import ProfileService from './services';

export const getFollowers = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_FOLLOWERS_REQUEST });
    return ProfileService.getFollowers(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_FOLLOWERS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_FOLLOWERS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_FOLLOWERS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        });
};

export const loadMoreFollowers = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_FOLLOWERS_REQUEST });
    return ProfileService.loadMoreFollowers(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_FOLLOWERS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_FOLLOWERS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_FOLLOWERS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        });
};

export const getFollowingUsers = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_FOLLOWING_USERS_REQUEST });
    return ProfileService.getFollowingUsers(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_FOLLOWING_USERS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_FOLLOWING_USERS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_FOLLOWING_USERS_FAIL,
                payload: {
                    message: 'Error while getting favorite assets',
                },
            });
        });
};

export const loadMoreFollowingUsers = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_FOLLOWERS_REQUEST });
    return ProfileService.loadMoreFollowingUsers(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_FOLLOWING_USERS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_FOLLOWING_USERS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_FOLLOWING_USERS_FAIL,
                payload: {
                    message: 'Error while load more assets',
                },
            });
        });
};
