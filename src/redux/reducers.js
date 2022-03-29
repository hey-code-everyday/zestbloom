import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import profileSettingsReducer from './profile-settings/reducer';
import profileReducer from './profile/reducer';
import assetsReducer from './asset/reducer';
import createdAssetsReducer from './createdAsset/reducer';
import marketplaceReducer from './marketplace/reducer';
import favoriteAssetsReducer from './favoriteAssets/reducer';
import bestVotedAssetsReducer from './bestVotedAssets/reducer';
import collectedAssetsReducer from './collectedAssets/reducer';
import singleAssetReducer from './singleAsset/reducer';
import algorandReducer from './algorand/reducer';
import followersReducer from './followers/reducer';
import notificationsReducer from './notifications/reducer';
import salesReducer from './sales/reducer';
import contractsReducer from './contracts/reducer';
import auctionReducer from './auction/reducer';
import topBidAssetsReducer from './topBidAssets/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    profileSettings: profileSettingsReducer,
    assets: assetsReducer,
    marketplace: marketplaceReducer,
    createdAssets: createdAssetsReducer,
    favoriteAssets: favoriteAssetsReducer,
    bestVotedAssets: bestVotedAssetsReducer,
    collectedAssets: collectedAssetsReducer,
    singleAsset: singleAssetReducer,
    algorand: algorandReducer,
    followers: followersReducer,
    notifications: notificationsReducer,
    sales: salesReducer,
    contracts: contractsReducer,
    auction: auctionReducer,
    topBidAssets: topBidAssetsReducer,
});

export default rootReducer;
