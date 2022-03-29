import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getCreatedAssets = (username, filters, sort, searchKey, currentRequest) => {
    let url = `${ASSETS_CONFIG.getCreatedAsset}?creator=${encodeURIComponent(
        username,
    )}&page_size=20`;
    if (searchKey) {
        url += `&search=${searchKey}`;
    }

    Object.keys(filters).forEach((key) => {
        if (filters[key]?.length > 0) {
            url += `&${key}=${filters[key].join(',')}`;
        }
    });
    if (sort) {
        url += `&sort_by=${sort}`;
    }
    return axios.get(url, {
        cancelToken: currentRequest?.token,
    });
};

const getCreatedAssetsForTable = (username, filters, sort, searchKey, currentRequest) => {
    let url = `${ASSETS_CONFIG.getCreatedAssetForTable}?creator=${encodeURIComponent(
        username,
    )}&page_size=20`;
    if (searchKey) {
        url += `&search=${searchKey}`;
    }

    Object.keys(filters).forEach((key) => {
        if (filters[key]?.length > 0) {
            url += `&${key}=${filters[key].join(',')}`;
        }
    });
    if (sort) {
        url += `&sort_by=${sort}`;
    }
    return axios.get(url, {
        cancelToken: currentRequest?.token,
    });
};

const loadMoreCreatedItems = (loadMoreURL) => axios.get(loadMoreURL);
const updateAsset = (guid, values) =>
    axios.patch(`${ASSETS_CONFIG.updateAsset}${guid}/visibility/`, values);
const upvoteAsset = (guid) => axios.post(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);
const unUpvoteAsset = (guid) => axios.delete(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);

const addToFavorites = (guid) => axios.post(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);
const removeFromFavorites = (guid) =>
    axios.delete(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);

const data = {
    getCreatedAssets,
    getCreatedAssetsForTable,
    loadMoreCreatedItems,
    unUpvoteAsset,
    upvoteAsset,
    removeFromFavorites,
    addToFavorites,
    updateAsset,
};

export default data;
