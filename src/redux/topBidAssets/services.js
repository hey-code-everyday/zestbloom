import axios from 'axios';
import { AUCTION_CONFIG } from 'configs';

const getTopBids = () => axios.get(AUCTION_CONFIG.getTopBidAssets);

const data = {
    getTopBids,
};

export default data;
