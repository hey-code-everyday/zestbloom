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

const updateProfile = (data) =>
    axios.patch(`${API_CONFIG.updateProfile}${encodeURIComponent(data.username)}/`, data);

const changeImage = (data) => {
    const formData = new FormData();
    formData.append('avatar', data.avatar);
    return axios.patch(
        `${API_CONFIG.updateProfile}${encodeURIComponent(data.username)}/`,
        formData,
    );
};

const addCustomTag = (customTag) =>
    axios.post(API_CONFIG.addCustomTag, {
        name: customTag,
    });

const selectTag = (data, slug, currentRequest) =>
    axios.patch(`${API_CONFIG.addCustomTag}${slug}/`, data, { cancelToken: currentRequest?.token });

const getTags = () => axios.get(API_CONFIG.getTags);

const changeEmail = (email) =>
    axios.post(API_CONFIG.changeEmail, {
        email: email,
    });

const changePassword = (oldPassword, newPassword) =>
    axios.post(API_CONFIG.changePassword, {
        old_password: oldPassword,
        new_password: newPassword,
    });

const data = {
    updateProfile,
    changeEmail,
    changePassword,
    changeImage,
    addCustomTag,
    selectTag,
    getTags,
};

export default data;
