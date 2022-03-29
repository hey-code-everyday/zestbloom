const apiUrl = window.__RUNTIME_CONFIG__.REACT_APP_API_URL;

export const MARKETPLACE_CONFIG = {
    getUsers: `${apiUrl}/api/account/profiles/`,
    getMarketplaceUsers: `${apiUrl}/api/marketplace/people/`,
    getAssets: `${apiUrl}/api/marketplace/items/`,
    getRandomAssets: `${apiUrl}/api/marketplace/items/`,
    updateAsset: `${apiUrl}/api/marketplace/nodes/`,
    updateAssetsProperty: `${apiUrl}/api/marketplace/`,
    getAssetsTags: `${apiUrl}/api/marketplace/media-types/`,
    addAssetsTags: `${apiUrl}/api/marketplace/media-types/`,
    getPeopleTags: `${apiUrl}/api/account/tags/?type=static `,
    getBanners: `${apiUrl}/api/marketplace/cover-images/`,
};

const popular = 'popular';
const recently_listed = 'recently_listed';
const mostFollowed = 'most_followed';
const featuredAtrist = 'featured-artist';

const zestbloom_minted = 'zestbloom_minted';
const featured_work = 'featured_work';
const buy_now = 'buy_now';
const for_offer = 'for_offer';
const auction = 'auction';
const single = 'single';
const series = 'series';

const all_assets = 'all_assets';

const price = {
    price_1_10: '1-10',
    price_10_50: '10-50',
    price_50_100: '50-100',
    price_100_200: '100-200',
    price_200_: '200-',
};

const duration = [
    { display: 'Yesterday', value: 'yesterday' },
    { display: 'Last 7 days', value: 'last7days' },
    { display: 'Last 30 days', value: 'last30days' },
    { display: 'Last year', value: 'lastyear' },
    { display: 'All time', value: '' },
];
const sort_by = [
    { display: 'Recently Listed', value: 'recently_listed' },
    { display: 'Price: Low to High', value: 'price_l_h' },
    { display: 'Price: High to Low', value: 'price_h_l' },
    { display: 'Popular', value: 'popular' },
    { display: 'Ending soon', value: 'ending_soon' },
];
const status = [
    { display: 'Buy now', value: 'buy_now' },
    { display: 'Auction', value: 'auction' },
    { display: 'For offer', value: 'for_offer' },
];
const type = [
    { display: 'Single Item', value: 'single' },
    { display: 'Bundle', value: 'series' },
];
const price_sidebar = [
    { display: '$1 - $10', value: '1-10' },
    { display: '$10 - $50', value: '10-50' },
    { display: '$50 - $100', value: '50-100' },
    { display: '$100 - $200', value: '100-200' },
    { display: '$200+', value: '200-' },
];
const users = [
    { display: 'A to Z', value: 'a-z' },
    { display: 'Most Voted', value: 'most_voted' },
    { display: 'Most Followed', value: 'most_followed' },
    { display: 'New Creators', value: 'new_creators' },
];
const assetTag_types = [
    { display: 'Virtual Reality', value: 'virtual-reality' },
    { display: 'Audio', value: 'audio' },
    { display: 'Graphic', value: 'graphic' },
    { display: 'Animation', value: 'animation' },
    { display: 'Video', value: 'video' },
    { display: 'Literature', value: 'literature' },
    { display: 'Photography', value: 'photography' },
    { display: 'Custom', value: 'custom' },
];
const userTag_types = [
    { display: 'VR Artist', value: 'vr-artist' },
    { display: 'Musician', value: 'musician' },
    { display: 'Illustrator', value: 'illustrator' },
    { display: 'Narrator', value: 'narrator' },
    { display: 'Filmmaker', value: 'filmmaker' },
    { display: 'Photographer', value: 'photographer' },
    { display: 'Writer', value: 'writer' },
    { display: 'Custom', value: 'custom' },
];
const people = [
    { display: 'All People', value: '' },
    { display: 'Creator', value: 'creator' },
    { display: 'Collector', value: 'collector' },
];

const category = [
    { display: 'ZestBloom Minted', value: zestbloom_minted },
    { display: 'Featured Work', value: featured_work },
];

const assetFilter = {
    category: [zestbloom_minted],
    allCategory: [zestbloom_minted, featured_work],
    status: [],
    type: [],
    price: [],
    duration: '',
};

export const FILTER_CONFIG = {
    assetFilter,
    all_assets,
    popular,
    recently_listed,
    mostFollowed,
    featuredAtrist,
    price,
    zestbloom_minted,
    featured_work,
    category,
    buy_now,
    for_offer,
    auction,
    single,
    series,
    duration,
    price_sidebar,
    sort_by,
    status,
    type,
    users,
    assetTag_types,
    userTag_types,
    people,
};
