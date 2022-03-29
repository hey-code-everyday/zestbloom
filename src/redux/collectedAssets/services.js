import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getCollectedAssets = (username, filters, sort, searchKey, currentRequest) => {
    let url = `${ASSETS_CONFIG.getCollectedAssets}?collector=${encodeURIComponent(
        username,
    )}&page_size=20`;
    Object.keys(filters).forEach((key) => {
        if (filters[key]?.length > 0) {
            url += `&${key}=${filters[key].join(',')}`;
        }
    });
    if (sort) {
        url += `&sort_by=${sort}`;
    }
    if (searchKey) {
        url += `&search=${searchKey}`;
    }
    return axios.get(url, { cancelToken: currentRequest?.token });
};

const getCollectedAssetsForTable = (username, filters, sort, searchKey, currentRequest) => {
    let url = `${ASSETS_CONFIG.getCollectedAssetsForTable}?collector=${encodeURIComponent(
        username,
    )}&page_size=20`;
    Object.keys(filters).forEach((key) => {
        if (filters[key]?.length > 0) {
            url += `&${key}=${filters[key].join(',')}`;
        }
    });
    if (sort) {
        url += `&sort_by=${sort}`;
    }
    if (searchKey) {
        url += `&search=${searchKey}`;
    }
    return axios.get(url, { cancelToken: currentRequest?.token });
};

const loadMoreCollectedItems = (loadMoreURL) => axios.get(loadMoreURL);
const collectAsset = (guid, data) => axios.post(`${ASSETS_CONFIG.collectAsset}${guid}/`, data);

const upvoteCollectedAsset = (guid) => axios.post(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);
const unUpvoteCollectedAsset = (guid) => axios.delete(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);

const toFavoritesCollectedAsset = (guid) =>
    axios.post(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);
const removeFromFavoritesCollected = (guid) =>
    axios.delete(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);
const updateAsset = (guid, values) =>
    axios.patch(`${ASSETS_CONFIG.updateAsset}${guid}/visibility/`, values);

const collectAssetOfferByEscrow = (guid, data) =>
    axios.post(`${ASSETS_CONFIG.collectAssetOfferByEscrow}${guid}/`, data);

const data = {
    collectAsset,
    getCollectedAssets,
    getCollectedAssetsForTable,
    loadMoreCollectedItems,
    upvoteCollectedAsset,
    unUpvoteCollectedAsset,
    toFavoritesCollectedAsset,
    removeFromFavoritesCollected,
    updateAsset,
    collectAssetOfferByEscrow,
};

export default data;
