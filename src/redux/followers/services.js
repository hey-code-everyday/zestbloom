import axios from 'axios';
import { API_CONFIG } from 'configs';

const getFollowers = (currentRequest) =>
    axios.get(`${API_CONFIG.getUser}?type=followers`, { cancelToken: currentRequest?.token });
const loadMoreFollowers = (loadMoreURL) => axios.get(loadMoreURL);

const getFollowingUsers = (currentRequest) =>
    axios.get(`${API_CONFIG.getUser}?type=following`, { cancelToken: currentRequest?.token });
const loadMoreFollowingUsers = (loadMoreURL) => axios.get(loadMoreURL);

const data = {
    getFollowers,
    loadMoreFollowers,
    getFollowingUsers,
    loadMoreFollowingUsers,
};

export default data;
