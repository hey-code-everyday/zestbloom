import { CONTRACTS_ERROR_MESSAGES } from 'configs';
import * as TYPES from './types';
import ContractsServise from './services';

export const getAuctions = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_AUCTIONS_REQUEST });
    return ContractsServise.getAuctions(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_AUCTIONS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data?.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_AUCTIONS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_AUCTIONS_FAIL],
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_AUCTIONS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_AUCTIONS_FAIL],
                },
            });
        });
};
export const loadMore = (loadMoreURL, category) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_CONTRACTS_REQUEST });
    return ContractsServise.loadMore(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_CONTRACTS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                        category,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_CONTRACTS_FAIL,
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_CONTRACTS_FAIL,
            });
        });
};

export const getBids = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_BIDS_REQUEST });
    return ContractsServise.getBids(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_BIDS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data?.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_BIDS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_BIDS_FAIL],
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_BIDS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_BIDS_FAIL],
                },
            });
        });
};

export const getListings = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_LISTINGS_REQUEST });
    return ContractsServise.getListings(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_LISTINGS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data?.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_LISTINGS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_LISTINGS_FAIL],
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_LISTINGS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_LISTINGS_FAIL],
                },
            });
        });
};

export const getOffers = (currentRequest) => (dispatch) => {
    dispatch({ type: TYPES.GET_OFFERS_REQUEST });
    return ContractsServise.getOffers(currentRequest)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_OFFERS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data?.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_OFFERS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_OFFERS_FAIL],
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_OFFERS_FAIL,
                payload: {
                    message: CONTRACTS_ERROR_MESSAGES[TYPES.GET_OFFERS_FAIL],
                },
            });
        });
};

export const removeOffer = (nodeId, offerId, assetAmount) => ({
    type: TYPES.REMOVE_OFFER,
    payload: { nodeId, offerId, assetAmount },
});
export const removeListing = (listingId) => ({
    type: TYPES.REMOVE_LISTING,
    payload: { listingId },
});

export const removeBid = ({ asset_guid, offer_guid, bid_guid }) => ({
    type: TYPES.REMOVE_BID,
    payload: { asset_guid, offer_guid, bid_guid },
});

export const removeAuction = (node_guid, auction_guid) => ({
    type: TYPES.REMOVE_AUCTION,
    payload: { auction_guid, node_guid },
});
