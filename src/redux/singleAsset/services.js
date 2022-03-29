import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getCurrentAssetsCollector = (guid) =>
    axios.get(`${ASSETS_CONFIG.getCurrentAssetsCollector}${guid}/`);
const getCurrentAssets = (guid) => axios.get(`${ASSETS_CONFIG.getAssets}${guid}/`);
const getMyCurrentAsset = (guid) => axios.get(`${ASSETS_CONFIG.getAssets}${guid}/me`);

const upvoteAsset = (guid) => axios.post(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);
const unUpvoteAsset = (guid) => axios.delete(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);

const addToFavorites = (guid) => axios.post(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);
const removeFromFavorites = (guid) =>
    axios.delete(`${ASSETS_CONFIG.favoriteAssets}${guid}/favorite/`);

const getAssetsWithSameTag = (tag) =>
    axios.get(`${ASSETS_CONFIG.getAssets}?page_size=4&sort_by=popular&media_types=${tag}`);
const updateAsset = (guid, values) => axios.patch(`${ASSETS_CONFIG.updateAsset}${guid}/`, values);
const changeVisibility = (guid, values) =>
    axios.patch(`${ASSETS_CONFIG.updateAsset}${guid}/visibility/`, values);

const getReportTemplates = () => axios.get(ASSETS_CONFIG.getReportTemplates);
const sendIssueReports = (reports) => {
    return axios.post(ASSETS_CONFIG.sendIssueReports, reports);
};
const getActivities = (guid) => {
    return axios.get(`${ASSETS_CONFIG.getActivities}${guid}/`);
};
const loadMoreActivities = (loadMoreURL) => axios.get(loadMoreURL);

const getAssetInfoTask = (taskId) => axios.get(`${ASSETS_CONFIG.getAssetInfoTask}${taskId}/`);

const data = {
    upvoteAsset,
    unUpvoteAsset,
    removeFromFavorites,
    addToFavorites,
    getAssetsWithSameTag,
    updateAsset,
    getReportTemplates,
    sendIssueReports,
    getCurrentAssetsCollector,
    getCurrentAssets,
    getMyCurrentAsset,
    changeVisibility,
    getActivities,
    loadMoreActivities,
    getAssetInfoTask,
};

export default data;
