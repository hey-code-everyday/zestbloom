import * as TYPES from './types.js';

const initialState = {
    topBidAssets: [],
    fromTopBids: false,
    loading: false,
    failMessage: {
        error: false,
        message: '',
    },
    initTopBidStore: false,
};

const topBidAssetsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_TOP_BIDS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_TOP_BIDS_SUCCESS:
            return {
                ...state,
                topBidAssets: payload.data,
                loading: false,
                initTopBidStore: true,
            };
        case TYPES.GET_TOP_BIDS_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
                initTopBidStore: true,
            };
        case TYPES.FROM_TOP_BIDS:
            return {
                ...state,
                fromTopBids: payload,
            };
        default:
            return state;
    }
};

export default topBidAssetsReducer;
