import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getFavoriteAssets = (currentRequest) =>
    axios.get(`${ASSETS_CONFIG.getFavoriteAssets}`, { cancelToken: currentRequest?.token });

const loadMoreFavoritesItems = (loadMoreURL) => axios.get(loadMoreURL);
const upvoteAsset = (guid) => axios.post(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);
const unUpvoteAsset = (guid) => axios.delete(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);

const removeFromFavorites = (guid) =>
    axios.delete(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);

const updateAsset = (guid, values) =>
    axios.patch(`${ASSETS_CONFIG.updateAsset}${guid}/visibility/`, values);

const data = {
    upvoteAsset,
    unUpvoteAsset,
    getFavoriteAssets,
    loadMoreFavoritesItems,
    removeFromFavorites,
    updateAsset,
};

export default data;
