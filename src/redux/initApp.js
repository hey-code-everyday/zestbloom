import { getBannerPlaceholder, getFeaturedArtists } from 'redux/marketplace/actions';
import { getTopBidAssets } from 'redux/topBidAssets/actions';
import { changeUiMode } from 'redux/profile/actions';

async function init(store) {
    store.dispatch(getBannerPlaceholder());
    store.dispatch(getTopBidAssets());
    store.dispatch(getFeaturedArtists());

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    store.dispatch(changeUiMode(isDarkMode));
}

export async function initApp(store) {
    await init(store);
}
