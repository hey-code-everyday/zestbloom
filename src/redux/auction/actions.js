import * as TYPES from './types.js';
import AuctionService from './services';

const getFullError = (errorData) => {
    let fullError = '';
    if (typeof errorData === 'object') {
        for (let key in errorData) {
            fullError += `${key} - ${errorData[key]} `;
        }
    } else {
        fullError = errorData;
    }
    return fullError;
};

export const create_app = (data) => (dispatch) => {
    return AuctionService.create_app(data)
        .then((response) => {
            if (response?.status === 201) {
                return response?.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const setup_app = (data) => (dispatch) => {
    return AuctionService.setup_app(data)
        .then((response) => {
            if (response?.status === 201) {
                const fund_app_txn = response?.data?.fund_app_txn;
                const setup_app_txn = response?.data?.setup_app_txn;
                const fund_nft_txn = response?.data?.fund_nft_txn;

                return [fund_app_txn, setup_app_txn, fund_nft_txn];
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const complete_app = (data) => (dispatch) => {
    return AuctionService.complete_app(data)
        .then((response) => {
            if (response?.status === 201) {
                return response?.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const close_app_blob = (data) => (dispatch) => {
    return AuctionService.close_app_blob(data)
        .then((response) => {
            if (response?.status === 200) {
                return response?.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const close_app = (data) => (dispatch) => {
    return AuctionService.close_app(data)
        .then((response) => {
            if (response?.status === 200) {
                dispatch({ type: TYPES.CLOSE_AUCTION_SUCCESS, payload: response.data });
                return response?.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const getAuctionAssets = () => (dispatch) => {
    dispatch({ type: TYPES.GET_AUCTION_ASSETS_REQUEST });
    return AuctionService.getAuctionAssets()
        .then((response) => {
            if (response?.status === 200) {
                return dispatch({
                    type: TYPES.GET_AUCTION_ASSETS_SUCCESS,
                    payload: {
                        data: response?.data?.results,
                        next: response?.data?.next,
                    },
                });
            }
            dispatch({ type: TYPES.GET_AUCTION_ASSETS_FAIL });
        })
        .catch((err) => {
            dispatch({ type: TYPES.GET_AUCTION_ASSETS_FAIL });
            console.log(err);
        });
};

export const loadMoreAuctionAssets = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_AUCTION_ASSETS_REQUEST });
    return AuctionService.loadMoreAuctionAssets(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_AUCTION_ASSETS_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_AUCTION_ASSETS_FAIL,
            });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({
                type: TYPES.LOAD_MORE_AUCTION_ASSETS_FAIL,
            });
        });
};

export const placeABidAction = (auction_guid, data) => (dispatch) => {
    return AuctionService.placeABid(auction_guid, data)
        .then((response) => {
            if (response?.status === 201) {
                return response.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};

export const appCall = (auction_guid, data, guid, asset_guid, updateAsset) => (dispatch) => {
    return AuctionService.appCall(auction_guid, data, guid)
        .then((response) => {
            if (response?.status === 200) {
                if (updateAsset) {
                    const payload = {
                        asset_guid,
                        auction_guid,
                        bid: response.data,
                    };
                    dispatch(updateAsset(payload));
                }
                return response.data;
            }
            return null;
        })
        .catch((error) => {
            const fullError = getFullError(error?.response?.data);

            throw new Error(fullError);
        });
};
