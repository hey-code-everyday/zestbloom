import axios from 'axios';
import * as TYPES from './types.js';
import AuthService from './services';

export const needToLoginAction = (payload) => ({ type: TYPES.NEED_TO_LOGIN, payload });
export const changeTags = (payload) => ({ type: TYPES.CHANGE_TAGS, payload });

export const setTokens = (data) => ({
    type: TYPES.LOGIN_SUCCESS,
    payload: data,
});

export const addFollowing = () => ({ type: TYPES.ADD_FOLLOWING_COUNT_SUCCESS });

export const reduceFollowing = () => ({ type: TYPES.REDUCE_FOLLOWING_COUNT_SUCCESS });

export const addWallet = (wallets) => ({ type: TYPES.ADD_WALLETS, payload: { wallets } });

export const signup = (data) => (dispatch) => {
    return AuthService.signup(data).then(
        (response) => {
            return dispatch({
                type: TYPES.SIGNUP_SUCCESS,
                payload: { signUpFormValues: data },
            });
        },
        (error) => {
            dispatch({
                type: TYPES.SIGNUP_FAIL,
            });
            return Promise.reject(error);
        },
    );
};

export const verifySignup = (code) => (dispatch) =>
    AuthService.verifySignup(code).then(
        (response) => {
            return dispatch({
                type: TYPES.VERIFY_SIGNUP_SUCCESS,
            });
        },
        (error) => {
            dispatch({
                type: TYPES.VERIFY_SIGNUP_FAIL,
            });
            return Promise.reject();
        },
    );

export const login = (email, password) => (dispatch) => {
    return AuthService.login(email, password)
        .then(
            (response) => {
                const data = response?.data;
                return data;
            },
            (error) => {
                dispatch({
                    type: TYPES.LOGIN_FAIL,
                });
                return Promise.reject(error);
            },
        )
        .then(
            (data) => {
                if (data.access && data.refresh) {
                    localStorage.setItem('access', data.access);
                    localStorage.setItem('refresh', data.refresh);
                }
                dispatch({
                    type: TYPES.LOGIN_SUCCESS,
                    payload: data,
                });
                dispatch({
                    type: TYPES.LOGIN_REFRESH_SUCCESS,
                    payload: data,
                });
            },
            (error) => {
                dispatch({
                    type: TYPES.LOGIN_FAIL,
                });

                return Promise.reject(error);
            },
        );
};

export const loginRefresh = (refreshToken) => (dispatch) => {
    return AuthService.loginRefresh(refreshToken).then(
        (response) => {
            if (response) {
                if (response.data.access && response.data.refresh) {
                    localStorage.setItem('access', response.data.access);
                    localStorage.setItem('refresh', response.data.refresh);
                }
                dispatch({
                    type: TYPES.LOGIN_REFRESH_SUCCESS,
                    payload: response.data,
                });
                return response.data;
            }
        },

        (error) => {
            dispatch({
                type: TYPES.LOGIN_REFRESH_FAIL,
            });

            return Promise.reject();
        },
    );
};
export const forgotPassword = (email) => (dispatch) => {
    return AuthService.forgotPassword(email).then(
        (response) => {
            dispatch({
                type: TYPES.FORGOT_PASSWORD_SUCCESS,
            });
        },
        (error) => {
            dispatch({
                type: TYPES.FORGOT_PASSWORD_FAIL,
            });
            return Promise.reject();
        },
    );
};
export const verifyForgotPassword = (code) => (dispatch) =>
    AuthService.verifyForgotPassword(code).then(
        (response) => {
            if (response) {
                return dispatch({
                    type: TYPES.VERIFY_FORGOT_PASSWORD_SUCCESS,
                    payload: {
                        code: code,
                    },
                });
            }
            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: TYPES.VERIFY_FORGOT_PASSWORD_FAIL,
            });
            return Promise.reject();
        },
    );

export const verifyEmail = (code) => (dispatch) =>
    AuthService.verifyEmail(code).then(
        (response) => {
            if (response) {
                return dispatch({
                    type: TYPES.VERIFY_EMAIL_SUCCESS,
                    payload: {
                        code: code,
                    },
                });
            }
            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: TYPES.VERIFY_EMAIL_FAIL,
            });
            return Promise.reject();
        },
    );

export const verifiedForgotPassword = (code, password) => (dispatch) => {
    return AuthService.verifiedForgotPassword(code, password).then(
        (response) => {
            if (response) {
                return dispatch({
                    type: TYPES.VERIFIED_FORGOT_PASSWORD_SUCCESS,
                });
            }
            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: TYPES.VERIFIED_FORGOT_PASSWORD_FAIL,
            });
            return Promise.reject();
        },
    );
};
export const logout = (refreshToken) => (dispatch) => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('wallets');
    delete axios.defaults.headers.common['Authorization'];
    return AuthService.logout(refreshToken).then(
        (response) => {
            if (response) {
                return dispatch({
                    type: TYPES.LOGOUT,
                });
            }
            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: TYPES.LOGOUT,
            });
            return Promise.reject();
        },
    );
};
export const logoutFromLocalStorage = () => (dispatch) => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('wallets');

    delete axios.defaults.headers.common['Authorization'];
    dispatch({
        type: TYPES.LOGOUT,
    });
};

export const getUser = (username) => (dispatch) => {
    dispatch({
        type: TYPES.GET_ME_REQUEST,
    });
    return AuthService.getUser(username)
        .then((response) => {
            if (response && response.status === 200) {
                dispatch({
                    type: TYPES.GET_ME_SUCCESS,
                    payload: { user: response.data },
                });
                return response;
            }
            dispatch({
                type: TYPES.GET_ME_FAIL,
            });
        })
        .catch((error) => {
            console.log(error);
            dispatch({
                type: TYPES.GET_ME_FAIL,
            });
        });
};

export const changeUserAvatar = (data) => ({
    type: TYPES.CHANGE_USER_AVATAR_SUCCESS,
    payload: { data },
});

export const becomeCreator = (artworks_url) => (dispatch) => {
    dispatch({ type: TYPES.CHANGE_IS_BECOME_A_CREATOR_REQUEST });
    return AuthService.becomeCreator(artworks_url)
        .then((response) => {
            if (response.status === 201) {
                dispatch({
                    type: TYPES.CHANGE_IS_BECOME_A_CREATOR_SUCCESS,
                    payload: true,
                });
                return response;
            }
            dispatch({ type: TYPES.CHANGE_IS_BECOME_A_CREATOR_FAIL });
            return response;
        })
        .catch((e) => {
            dispatch({ type: TYPES.CHANGE_IS_BECOME_A_CREATOR_FAIL });
            return null;
        });
};
