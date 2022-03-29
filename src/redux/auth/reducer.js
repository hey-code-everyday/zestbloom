import * as TYPES from './types.js';

const initialState = {
    user: {
        wallets: [],
    },
    getUserLoading: false,
    isLoggedIn: localStorage.getItem('access') ? true : false,
    forgotPasswordSent: false,
    needToLogin: false,
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.SIGNUP_SUCCESS:
            return {
                ...state,
                ...payload,
                isLoggedIn: false,
            };
        case TYPES.SIGNUP_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case TYPES.VERIFY_SIGNUP_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case TYPES.VERIFY_SIGNUP_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case TYPES.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                access: payload.access,
                refresh: payload.refresh,
                user: payload.user,
            };
        case TYPES.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: {},
            };
        case TYPES.GET_ME_REQUEST:
            return {
                ...state,
                getUserLoading: true,
            };
        case TYPES.GET_ME_SUCCESS:
            return {
                ...state,
                user: payload.user,
                getUserLoading: false,
            };
        case TYPES.GET_ME_FAIL:
            return {
                ...state,
                getUserLoading: false,
            };
        case TYPES.CHANGE_USER_AVATAR_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: { ...state.user, avatar: payload.data },
            };
        case TYPES.LOGIN_REFRESH_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                access: payload.access,
                refresh: payload.refresh,
            };
        case TYPES.LOGIN_REFRESH_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                access: null,
                refresh: null,
            };
        case TYPES.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordSent: true,
            };
        case TYPES.FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordSent: false,
            };
        case TYPES.VERIFY_FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordCode: payload.code,
            };
        case TYPES.VERIFY_FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordCode: null,
            };
        case TYPES.VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                emailCode: payload.code,
            };
        case TYPES.VERIFY_EMAIL_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                emailCode: null,
            };
        case TYPES.VERIFIED_FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordCode: null,
            };
        case TYPES.VERIFIED_FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                forgotPasswordCode: null,
            };
        case TYPES.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                access: null,
                refresh: null,
                user: {},
            };
        case TYPES.NEED_TO_LOGIN:
            return {
                ...state,
                needToLogin: payload,
            };
        case TYPES.CHANGE_IS_BECOME_A_CREATOR_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.CHANGE_IS_BECOME_A_CREATOR_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    is_become_creator: payload,
                },
                loading: false,
            };
        case TYPES.CHANGE_IS_BECOME_A_CREATOR_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.CHANGE_TAGS:
            return {
                ...state,
                user: {
                    ...state.user,
                    selected_tags: payload.selected
                        ? [
                              ...state.user.selected_tags.filter((x) => x.type !== payload.type),
                              payload,
                          ]
                        : state.user.selected_tags.filter((x) => x.slug === payload.slug),
                },
            };
        case TYPES.ADD_FOLLOWING_COUNT_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    following_count: state.user?.following_count + 1,
                },
            };
        case TYPES.REDUCE_FOLLOWING_COUNT_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    following_count: state.user?.following_count - 1,
                },
            };
        case TYPES.ADD_WALLETS: {
            let newWalets = [];
            if (payload?.wallets?.length) {
                newWalets = payload?.wallets?.filter((x) => !state.user?.wallets?.includes(x));
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    wallets: [...state.user?.wallets, ...newWalets],
                },
            };
        }
        default:
            return state;
    }
};

export default authReducer;
