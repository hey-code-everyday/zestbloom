import * as TYPES from './types.js';
import AssetsServise from './services';

export const setTobBids = (payload) => ({ type: TYPES.FROM_TOP_BIDS, payload });

export const getTopBidAssets = () => (dispatch) => {
    dispatch({ type: TYPES.GET_TOP_BIDS_REQUEST });
    return AssetsServise.getTopBids()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_TOP_BIDS_SUCCESS,
                    payload: {
                        data: response.data.results,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_TOP_BIDS_FAIL,
                payload: {
                    message: 'Error while getting best voted assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_TOP_BIDS_FAIL,
                payload: {
                    message: 'Error while getting best voted assets',
                },
            });
        });
};
