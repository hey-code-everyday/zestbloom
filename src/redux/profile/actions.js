import * as TYPES from './types.js';
import ProfileService from './services';
import AuthService from '../auth/services';
import { getUser, addFollowing, reduceFollowing, addWallet } from '../auth/actions';
import { v4 as uuid } from 'uuid';
import { setTokens } from 'redux/auth/actions';

export const empty_user = () => ({ type: TYPES.EMPTY_USER });
export const setWallets = (accounts) => ({
    type: TYPES.SET_MY_ALGO_ACCOUNT_SUCCESS,
    payload: accounts,
});

export const setNotification = (notification) => {
    const guid = uuid();
    return {
        type: TYPES.SET_NOTIFICATION_SUCCESS,
        payload: { notification: { ...notification, guid } },
    };
};

export const deleteNotification = (guid) => ({
    type: TYPES.DELETE_NOTIFICATION_SUCCESS,
    payload: { guid },
});

export const toClearWallet = () => ({ type: TYPES.SET_MY_ALGO_ACCOUNT_SUCCESS, payload: [] });

export const setMyAlgoAccount = (accounts) => (dispatch) => {
    if (accounts.length > 10) {
        dispatch(
            setNotification({
                status: 'error',
                message: 'Please connect no more than 10 accounts',
            }),
        );
        return [];
    }
    return ProfileService.setWalletAccounts(accounts)
        .then((response) => {
            if (response.status === 201) {
                dispatch(setWallets(accounts));
                dispatch(addWallet(accounts?.map((x) => x.address)));
                localStorage.setItem('wallets', JSON.stringify(accounts));
                return response?.data;
            }
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};

export const setNonLoggedMyAlgoAccount = (accounts) => (dispatch) => {
    const oneWalletAddress = accounts[0]?.address;
    if (accounts.length > 10) {
        dispatch(
            setNotification({
                status: 'error',
                message: 'Please connect no more than 10 accounts',
            }),
        );
        return [];
    }
    return ProfileService.setNonLoggedMyAlgoAccount(oneWalletAddress)
        .then((response) => {
            if (response.status === 200) {
                if (response.data.access && response.data.refresh) {
                    localStorage.setItem('access', response.data.access);
                    localStorage.setItem('refresh', response.data.refresh);
                }
                dispatch(setWallets(accounts));
                dispatch(setTokens(response?.data));
                localStorage.setItem('wallets', JSON.stringify(accounts));
                return response?.data;
            }
            return [];
        })
        .catch((err) => {
            if (err?.response?.data) {
                dispatch(
                    setNotification({ status: 'error', message: err?.response?.data?.message }),
                );
            }
            return [];
        });
};

export const verifyWallets = (data) => (dispatch) => {
    return ProfileService.verifyWallets(data)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

export const dissconnectMyAlgo = (address) => ({
    type: TYPES.DISSCONNECT_MY_ALGO,
    payload: { address },
});
export const dissconnectAllWallets = () => ({
    type: TYPES.DISSCONNECT_MY_ALGO_ALL,
});

export const changeBanner = (data) => (dispatch) => {
    return ProfileService.changeBanner(data).then(
        (response) => {
            if (response) {
                dispatch(getUser(data.username));
                return dispatch({
                    type: TYPES.CHANGE_BANNER_SUCCESS,
                });
            }
            return Promise.reject();
        },
        (error) => {
            dispatch({
                type: TYPES.CHANGE_BANNER_FAIL,
            });
            return Promise.reject();
        },
    );
};

export const getProfileUser = (username) => (dispatch) => {
    dispatch({
        type: TYPES.PUBLIC_USER_REQUEST,
    });
    return AuthService.getUser(username)
        .then((response) => {
            if (response) {
                dispatch({
                    type: TYPES.PUBLIC_USER_SUCCESS,
                    payload: response.data,
                });
                return response.data;
            }
            dispatch({
                type: TYPES.PUBLIC_USER_FAIL,
            });
            return Promise.reject();
        })
        .catch((error) => {
            dispatch({
                type: TYPES.PUBLIC_USER_FAIL,
            });
            console.log(error);
        });
};

export const followUser = (username) => (dispatch) => {
    return ProfileService.followUser(username)
        .then((response) => {
            if (response.status === 201) {
                dispatch({
                    type: TYPES.FOLLOW_USER,
                    payload: { username },
                });
                return dispatch(addFollowing());
            }
            return Promise.reject();
        })
        .catch((e) => console.error(e));
};

export const unFollowUser = (username) => (dispatch) => {
    return ProfileService.unFollowUser(username)
        .then((response) => {
            if (response.status === 204) {
                dispatch({
                    type: TYPES.UNFOLLOW_USER,
                    payload: { username },
                });
                return dispatch(reduceFollowing());
            }
            return Promise.reject();
        })
        .catch((e) => console.error(e));
};

export const getPdfFile = (staticUrl) => (dispatch) => {
    dispatch({ type: TYPES.GET_PDF_FILE_REQUEST });
    return ProfileService.getPdfFile(staticUrl)
        .then((response) => {
            if (response.status === 200) {
                dispatch({
                    type: TYPES.GET_PDF_FILE_SUCCESS,
                    payload: response?.data?.file,
                });
                return { status: 200, data: response?.data };
            }
            dispatch({ type: TYPES.GET_PDF_FILE_FAIL });
            return { status: 400 };
        })
        .catch((e) => {
            dispatch({ type: TYPES.GET_PDF_FILE_FAIL });
            return { status: 400 };
        });
};

export const changeProfileTabesType = (payload) => ({
    type: TYPES.CHOOSE_PROFILE_TABES_TYPE,
    payload,
});

export const selectWallet = (address) => ({
    type: TYPES.SELECTED_WALLET_SUCCESS,
    payload: { address },
});

export const changeUiMode = (isDarkMode) => (dispatch) => {
    localStorage.setItem('darkMode', isDarkMode);
    dispatch({
        type: TYPES.CHANGE_UI_MODE,
        payload: isDarkMode,
    });
};
