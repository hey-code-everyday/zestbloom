import {
    getBannerPlaceholder,
    getAssetsTags,
    getAssetsStaticTags,
    getFeaturedArtists,
} from 'redux/marketplace/actions';
import { getTopBidAssets } from 'redux/topBidAssets/actions';
import { changeUiMode } from 'redux/profile/actions';

async function init(store) {
    store.dispatch(getBannerPlaceholder());
    store.dispatch(getTopBidAssets());
    store.dispatch(getFeaturedArtists());
    store.dispatch(getAssetsTags());
    store.dispatch(getAssetsTags());
    store.dispatch(getAssetsStaticTags());

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    store.dispatch(changeUiMode(isDarkMode));
}

export async function initApp(store) {
    await init(store);
}
