import axios from 'axios';
import { MARKETPLACE_CONFIG } from 'configs';

const getAssetsForMarketPlace = (filter, currentRequest) => {
    return axios.get(`${MARKETPLACE_CONFIG.getAssets}${filter}`, {
        cancelToken: currentRequest?.token,
    });
};

const getRandomAssetsForMarketPlace = (currentRequest) => {
    return axios.get(`${MARKETPLACE_CONFIG.getRandomAssets}`, {
        cancelToken: currentRequest?.token,
    });
};

const loadMoreMarketplaceItems = (loadMoreURL) => axios.get(loadMoreURL);

const getUsers = (filter, currentRequest) =>
    axios.get(`${MARKETPLACE_CONFIG.getUsers}${filter}`, {
        cancelToken: currentRequest?.token,
    });
const getMarketplaceUsers = (filter, currentRequest) =>
    axios.get(`${MARKETPLACE_CONFIG.getMarketplaceUsers}${filter}`, {
        cancelToken: currentRequest?.token,
    });

const getBanners = () => axios.get(`${MARKETPLACE_CONFIG.getBanners}`);

const loadMoreUsers = (loadMoreURL) => axios.get(loadMoreURL);

const upvoteAsset = (guid) => axios.post(`${MARKETPLACE_CONFIG.getAssets}${guid}/vote/`);
const unUpvoteAsset = (guid) => axios.delete(`${MARKETPLACE_CONFIG.getAssets}${guid}/vote/`);

const toFavoritesAsset = (guid) => axios.post(`${MARKETPLACE_CONFIG.getAssets}${guid}/favorite/`);
const removeFromFavorites = (guid) =>
    axios.delete(`${MARKETPLACE_CONFIG.getAssets}${guid}/favorite/`);

const getAssetsTags = () => axios.get(`${MARKETPLACE_CONFIG.getAssetsTags}`);
const getAssetsStaticTags = () => axios.get(`${MARKETPLACE_CONFIG.getAssetsTags}?category=static`);
const addAssetsTags = (name) => axios.post(`${MARKETPLACE_CONFIG.addAssetsTags}`, { name });
const getPeopleTags = () => axios.get(`${MARKETPLACE_CONFIG.getPeopleTags}`);
const updateAsset = (guid, values) =>
    axios.patch(`${MARKETPLACE_CONFIG.updateAsset}${guid}/visibility/`, values);

const updateVisibilityOfAssets = (payload) =>
    axios.put(`${MARKETPLACE_CONFIG.updateAssetsProperty}visibilities/`, payload);

const data = {
    getUsers,
    loadMoreUsers,
    getAssetsForMarketPlace,
    getRandomAssetsForMarketPlace,
    loadMoreMarketplaceItems,
    upvoteAsset,
    unUpvoteAsset,
    toFavoritesAsset,
    removeFromFavorites,
    getAssetsTags,
    getPeopleTags,
    addAssetsTags,
    getAssetsStaticTags,
    updateAsset,
    getBanners,
    getMarketplaceUsers,
    updateVisibilityOfAssets,
};

export default data;
