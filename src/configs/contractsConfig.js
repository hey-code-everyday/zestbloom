import * as TYPES from 'redux/contracts/types';

const apiUrl = window.__RUNTIME_CONFIG__.REACT_APP_API_URL;

export const CONTRACTS_CONFIG = {
    getOffers: `${apiUrl}/api/contract/offers/`,
    getListings: `${apiUrl}/api/contract/listings/`,
    getBids: `${apiUrl}/api/contract/bids/`,
    getAuctions: `${apiUrl}/api/contract/auctions/`,
};

export const CONTRACTS_ERROR_MESSAGES = {
    [TYPES.GET_AUCTIONS_FAIL]: 'Error while getting auctions',
    [TYPES.GET_BIDS_FAIL]: 'Error while getting bids',
    [TYPES.GET_LISTINGS_FAIL]: 'Error while getting listings',
    [TYPES.GET_OFFERS_FAIL]: 'Error while getting offers',
};
