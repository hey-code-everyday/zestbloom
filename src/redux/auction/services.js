import axios from 'axios';
import { AUCTION_CONFIG } from 'configs';

const create_app = (data) => axios.post(AUCTION_CONFIG.create_app, data);
const setup_app = ({ auction, blob }) => axios.post(AUCTION_CONFIG.setup_app(auction), { blob });
const complete_app = ({ auction, blob }) =>
    axios.post(AUCTION_CONFIG.complete_app(auction), { blob });
const close_app_blob = (auction) => axios.get(AUCTION_CONFIG.close_app(auction));

const close_app = ({ auction, blob }) => axios.patch(AUCTION_CONFIG.close_app(auction), { blob });

const placeABid = (auction_guid, data) =>
    axios.post(`${AUCTION_CONFIG.placeABid}${auction_guid}/bids/`, data);
const appCall = (auction_guid, data, guid) =>
    axios.patch(`${AUCTION_CONFIG.placeABid}${auction_guid}/bids/${guid}/`, data);

const loadMoreAuctionAssets = (loadMoreURL) => axios.get(loadMoreURL);

const getAuctionAssets = () => axios.get(AUCTION_CONFIG.getAuctionAssets);
const data = {
    create_app,
    setup_app,
    close_app_blob,
    close_app,
    complete_app,
    getAuctionAssets,
    placeABid,
    appCall,
    loadMoreAuctionAssets,
};

export default data;
