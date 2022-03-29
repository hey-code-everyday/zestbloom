import axios from 'axios';
import { API_CONFIG } from 'configs';

// axios.interceptors.request.use(
//     function (config) {
//         const accessToken = localStorage.getItem('access');
//         if (accessToken) {
//             config.headers['Authorization'] = `Bearer ${accessToken}`;
//             config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//         }
//         // Do something before request is sent
//         return config;
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     },
// );

const changeBanner = (data) => {
    const formData = new FormData();
    formData.append('banner', data.banner);
    return axios.patch(
        `${API_CONFIG.updateProfile}${encodeURIComponent(data.username)}/`,
        formData,
    );
};

const followUser = (username) =>
    axios.post(`${API_CONFIG.follow}${encodeURIComponent(username)}/follow/`);

const unFollowUser = (username) =>
    axios.delete(`${API_CONFIG.follow}${encodeURIComponent(username)}/follow/`);

const setWalletAccounts = (accounts) =>
    axios.post(API_CONFIG.setWalletAccounts, JSON.stringify(accounts));

const setNonLoggedMyAlgoAccount = (account) =>
    axios.post(`${API_CONFIG.setWalletAccountNonLogged}${account}/auth/`);

const verifyWallets = (data) => axios.patch(API_CONFIG.verifyWallets, JSON.stringify(data));

const getPdfFile = (staticUrl) => axios.get(`${API_CONFIG.getPdfFile}${staticUrl}/`);

const data = {
    changeBanner,
    followUser,
    unFollowUser,
    setWalletAccounts,
    getPdfFile,
    verifyWallets,
    setNonLoggedMyAlgoAccount,
};

export default data;
