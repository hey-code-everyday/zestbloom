import axios from 'axios';
import { API_CONFIG } from 'configs';

const signup = (data) => axios.post(API_CONFIG.signup, data);

const verifySignup = (code) =>
    axios.get(API_CONFIG.verifySignup, {
        params: {
            code: code,
        },
    });

const login = (email, password) => axios.post(API_CONFIG.login, { email, password });

const loginRefresh = (refreshToken) =>
    axios.post(API_CONFIG.loginRefresh, { refresh: refreshToken });

const logout = (refreshToken) => axios.post(API_CONFIG.logout, { refresh: refreshToken });

const getUser = (username) => axios.get(`${API_CONFIG.getUser}${encodeURIComponent(username)}/`);

export const forgotPassword = (email) => axios.post(API_CONFIG.forgotPassword, { email: email });

export const verifyForgotPassword = (code) =>
    axios.get(API_CONFIG.verifyForgotPassword, { params: { code: code } });

export const verifiedForgotPassword = (code, password) =>
    axios.post(API_CONFIG.verifiedForgotPassword, { code, password });

export const verifyEmail = (code) => axios.get(API_CONFIG.verifyEmail, { params: { code: code } });

const becomeCreator = (artworks_url) => {
    return axios.post(API_CONFIG.becomeCreator, {
        artworks_url,
    });
};

const data = {
    signup,
    verifySignup,
    login,
    loginRefresh,
    forgotPassword,
    verifyForgotPassword,
    verifyEmail,
    verifiedForgotPassword,
    logout,
    getUser,
    becomeCreator,
};

export default data;
