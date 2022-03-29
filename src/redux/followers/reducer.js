import * as TYPES from './types.js';

const initialState = {
    followers: [],
    loadMoreFollowersURL: '',
    followingUsers: [],
    loadMoreFollowingUsersURL: '',
    loading: false,
    failMessage: {
        error: false,
        message: '',
    },
    getFollowersLoading: true,
    getFollowingLoading: true,
};

const followersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_FOLLOWERS_REQUEST:
            return {
                ...state,
                getFollowersLoading: true,
            };
        case TYPES.GET_FOLLOWERS_SUCCESS:
            return {
                ...state,
                followers: payload.data,
                loadMoreFollowersURL: payload.next,
                getFollowersLoading: false,
            };
        case TYPES.GET_FOLLOWERS_FAIL:
            return {
                ...state,
                getFollowersLoading: false,
            };
        case TYPES.LOAD_MORE_FOLLOWERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.LOAD_MORE_FOLLOWERS_SUCCESS:
            return {
                ...state,
                followers: [...state.followers, ...payload.data],
                loadMoreFollowersURL: payload.next,
                loading: false,
            };
        case TYPES.LOAD_MORE_FOLLOWERS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.GET_FOLLOWING_USERS_REQUEST:
            return {
                ...state,
                getFollowingLoading: true,
            };
        case TYPES.GET_FOLLOWING_USERS_SUCCESS:
            return {
                ...state,
                followingUsers: payload.data,
                loadMoreFollowingUsersURL: payload.next,
                getFollowingLoading: false,
            };
        case TYPES.GET_FOLLOWING_USERS_FAIL:
            return {
                ...state,
                getFollowingLoading: false,
            };
        case TYPES.LOAD_MORE_FOLLOWING_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.LOAD_MORE_FOLLOWING_USERS_SUCCESS:
            return {
                ...state,
                followingUsers: [...state.followingUsers, ...payload.data],
                loadMoreFollowingUsersURL: payload.next,
                loading: false,
            };
        case TYPES.LOAD_MORE_FOLLOWING_USERS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        default:
            return state;
    }
};

export default followersReducer;
