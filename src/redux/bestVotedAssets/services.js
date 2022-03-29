import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getBestVoted = () => axios.get(ASSETS_CONFIG.getBestVoted);
const upvoteAsset = (guid) => axios.post(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);
const unUpvoteAsset = (guid) => axios.delete(`${ASSETS_CONFIG.upvoteAsset}${guid}/vote/`);

const data = {
    getBestVoted,
    upvoteAsset,
    unUpvoteAsset,
};

export default data;
