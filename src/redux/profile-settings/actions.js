import * as TYPES from './types.js';
import AuthService from './services';

export const updateProfile = (data) => (dispatch) => {
    dispatch({
        type: TYPES.UPDATE_PROFILE_REQUEST,
    });
    return AuthService.updateProfile(data).then(
        (response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.UPDATE_PROFILE_SUCCESS,
                });
            }
            return Promise.reject();
        },
        (error) => {
            dispatch({
                type: TYPES.UPDATE_PROFILE_FAIL,
            });
            return Promise.reject();
        },
    );
};

export const changeEmail = (email) => (dispatch) =>
    AuthService.changeEmail(email).then(
        (response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.CHANGE_EMAIL_SUCCESS,
                });
            }
            return Promise.reject();
        },
        (error) => {
            dispatch({
                type: TYPES.CHANGE_EMAIL_FAIL,
            });
            return Promise.reject();
        },
    );

export const addCustomTag = (customTag) => (dispatch) =>
    AuthService.addCustomTag(customTag).then(
        (response) => {
            if (response.status === 201) {
                return dispatch({
                    type: TYPES.ADD_CUSTOM_TAG_SUCCESS,
                    payload: response.data,
                });
            }
            return Promise.reject();
        },
        (error) => {
            dispatch({
                type: TYPES.ADD_CUSTOM_TAG_FAIL,
            });
            return Promise.reject();
        },
    );

export const getTags = () => (dispatch) =>
    AuthService.getTags()
        .then(
            (response) => {
                if (response.status === 200) {
                    return dispatch({
                        type: TYPES.GET_TAGS_SUCCESS,
                        payload: response.data,
                    });
                }
                return Promise.reject();
            },
            (error) => {
                dispatch({
                    type: TYPES.GET_TAGS_FAIL,
                });
                return Promise.reject();
            },
        )
        .catch((err) => {
            console.log(err);
        });

export const setTags = (data) => (dispatch) => {
    dispatch({
        type: TYPES.SET_TAGS,
        payload: data,
    });
};

export const selectTag = (data, slug, currentRequest) => (dispatch) =>
    AuthService.selectTag(data, slug, currentRequest)
        .then(
            (response) => {
                if (response.status === 200) {
                    dispatch({
                        type: TYPES.SELECT_TAG_SUCCESS,
                        payload: response.data,
                    });
                    return response;
                }
                return Promise.reject();
            },
            (error) => {
                dispatch({
                    type: TYPES.SELECT_TAG_FAIL,
                });
                return Promise.reject();
            },
        )
        .catch((err) => console.log(err));

export const changeImage = (avatar) => (dispatch) =>
    AuthService.changeImage(avatar).then(
        (response) => {
            if (response.status === 200) {
                dispatch({
                    type: TYPES.CHANGE_IMAGE_SUCCESS,
                });
                return response.data;
            }
            return Promise.reject();
        },
        (error) => {
            dispatch({
                type: TYPES.CHANGE_IMAGE_FAIL,
            });
            return Promise.reject();
        },
    );

export const changePassword = (oldPassword, newPassword) => (dispatch) =>
    AuthService.changePassword(oldPassword, newPassword).then(
        (response) => {
            return dispatch({
                type: TYPES.CHANGE_PASSWORD_SUCCESS,
            });
        },
        (error) => {
            dispatch({
                type: TYPES.CHANGE_PASSWORD_FAIL,
            });
            return Promise.reject();
        },
    );
