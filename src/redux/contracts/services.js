import axios from 'axios';
import { CONTRACTS_CONFIG } from 'configs';

const getAuctions = (currentRequest) =>
    axios.get(CONTRACTS_CONFIG.getAuctions, { cancelToken: currentRequest?.token });
const getBids = (currentRequest) =>
    axios.get(CONTRACTS_CONFIG.getBids, { cancelToken: currentRequest?.token });
const getListings = (currentRequest) =>
    axios.get(CONTRACTS_CONFIG.getListings, { cancelToken: currentRequest?.token });
const getOffers = (currentRequest) =>
    axios.get(CONTRACTS_CONFIG.getOffers, { cancelToken: currentRequest?.token });

const loadMore = (url) => axios.get(url);
const data = {
    getAuctions,
    getBids,
    getListings,
    getOffers,
    loadMore,
};

export default data;
