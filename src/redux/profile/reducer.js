import * as TYPES from './types.js';

const initialState = {
    user: {},
    getUserLoading: false,
    isLoggedIn: localStorage.getItem('access') ? true : false,
    forgotPasswordSent: false,
    tags: [],
    myAlgoAccounts: [],
    selectedWallet: null,
    profileTabesType: {
        type: 'default',
        tabNumber: 0,
    },
    notifications: [],
    isDarkMode: !!localStorage.getItem('darkMode') === 'true',
};

const profileReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.CHANGE_UI_MODE:
            return {
                ...state,
                isDarkMode: payload,
            };
        case TYPES.SET_MY_ALGO_ACCOUNT_SUCCESS:
            return {
                ...state,
                myAlgoAccounts: payload,
                selectedWallet: payload[0],
            };
        case TYPES.DISSCONNECT_MY_ALGO: {
            const withoutDissconectedWallet = state.myAlgoAccounts.filter(
                (account) => account.address !== payload.address,
            );
            return {
                ...state,
                myAlgoAccounts: withoutDissconectedWallet,
                selectedWallet:
                    payload.address === state.selectedWallet.address
                        ? withoutDissconectedWallet[0] || null
                        : state.selectedWallet,
            };
        }
        case TYPES.DISSCONNECT_MY_ALGO_ALL: {
            return {
                ...state,
                myAlgoAccounts: [],
                selectedWallet: null,
            };
        }
        case TYPES.SELECTED_WALLET_SUCCESS:
            return {
                ...state,
                selectedWallet: state.myAlgoAccounts.find(
                    (wallet) => wallet.address === payload.address,
                ),
            };
        case TYPES.CHANGE_BANNER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.CHANGE_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case TYPES.CHANGE_BANNER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.PUBLIC_USER_REQUEST:
            return {
                ...state,
                getUserLoading: true,
            };
        case TYPES.PUBLIC_USER_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload,
                getUserLoading: false,
            };
        case TYPES.PUBLIC_USER_FAIL:
            return {
                ...state,
                getUserLoading: false,
            };
        case TYPES.FOLLOW_USER: {
            if (state.user.username === payload.username) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        follow: true,
                        followers_count: state.user.followers_count + 1,
                    },
                };
            }
            return state;
        }
        case TYPES.UNFOLLOW_USER: {
            if (state.user.username === payload.username) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        follow: false,
                        followers_count: state.user.followers_count - 1,
                    },
                };
            }

            return state;
        }
        case TYPES.GET_FOLLOWING:
            return {
                ...state,
                following: payload,
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
        case TYPES.EMPTY_USER: {
            return {
                ...state,
                user: {},
            };
        }
        case TYPES.CHOOSE_PROFILE_TABES_TYPE:
            return {
                ...state,
                profileTabesType: {
                    type: payload?.type,
                    tabNumber: payload?.tabNumber,
                },
            };
        case TYPES.SET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notifications: [...state.notifications, payload.notification],
            };
        case TYPES.DELETE_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notifications: state.notifications.filter((x) => x.guid !== payload.guid),
            };
        default:
            return state;
    }
};

export default profileReducer;
