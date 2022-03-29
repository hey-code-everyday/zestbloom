const apiUrl = window.__RUNTIME_CONFIG__.REACT_APP_API_URL;
const algorandIndexerUrl = window.__RUNTIME_CONFIG__.REACT_APP_ALGORAND_INDEXER_SERVER;

export const ASSETS_CONFIG = {
    getAssets: `${apiUrl}/api/marketplace/items/`,
    getCurrentAssetsCollector: `${apiUrl}/api/marketplace/collected/`,
    getCreatedAsset: `${apiUrl}/api/marketplace/created/`,
    getCreatedAssetForTable: `${apiUrl}/api/marketplace/created/table/`,
    getCollectedAssets: `${apiUrl}/api/marketplace/collected/`,
    getCollectedAssetsForTable: `${apiUrl}/api/marketplace/collected/table/`,
    getBestVoted: `${apiUrl}/api/marketplace/items/?sort_by=popular&page_size=15`,
    upvoteAsset: `${apiUrl}/api/marketplace/items/`,
    favoriteAssets: `${apiUrl}/api/marketplace/items/`,
    addAsset: `${apiUrl}/api/marketplace/assets/`,
    deleteAsset: `${apiUrl}/api/marketplace/assets/`,
    getFavoriteAssets: `${apiUrl}/api/marketplace/favorites/`,
    escrowContract: `${apiUrl}/api/contract/escrow-sale/`,
    deleteEscrowContract: `${apiUrl}/api/contract/escrow-sale/`,
    offerByEscrow: `${apiUrl}/api/contract/escrow-offer/`,
    broadcastOffer: `${apiUrl}/api/contract/escrow-broadcast-offer/`,
    getManagerAddress: `${apiUrl}/api/manager-address/`,
    getIPFSHash: `${apiUrl}/api/pinata/asset-upload/`,
    updateAsset: `${apiUrl}/api/marketplace/nodes/`,
    getReportTemplates: `${apiUrl}/api/report/template/issue/`,
    sendIssueReports: `${apiUrl}/api/report/issue/`,
    collectAsset: `${apiUrl}/api/marketplace/collect/`,
    collectAssetOfferByEscrow: `${apiUrl}/api/marketplace/sell-by-offer/`,
    getActivities: `${apiUrl}/api/activity/entity/`,
    getContracts: `${apiUrl}/api/contract/by/`,
    getAllNotifications: `${apiUrl}/api/activity/items/`,
    readAllNotifications: `${apiUrl}/api/activity/mark-all-as-read/`,
    getAssetInfoTask: `${apiUrl}/api/tasks/`,
    getAccountInfo: `${algorandIndexerUrl}/accounts/`,
};

export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/gif',
    'audio/mpeg',
    'audio/wav',
    'audio/vnd.wave',
    'audio/wave',
    'audio/x-wav',
    'video/mp4',
    'video/quicktime',
    'text/plain',
    'application/pdf',
];

export const ALLOWED_FILE_EXTENSIONS = [
    '.jpg',
    ' .png',
    ' .svg',
    ' .gif',
    ' .mp4',
    ' .mov',
    ' .mp3',
    ' .wav',
    ' .txt',
    ' .pdf',
];

export const UPLOAD_ASSET_STEP_TITLES = [
    'Asset Type',
    'Set Information',
    'Upload Asset',
    'Configure Sale',
    'Create Auction',
];
