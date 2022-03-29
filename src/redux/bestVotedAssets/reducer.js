import * as TYPES from './types.js';

const initialState = {
    bestVotedAssets: [],
    fromBestVoted: false,
    loading: false,
    failMessage: {
        error: false,
        message: '',
    },
};

const bestVotedAssetsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_BEST_VOTED_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_BEST_VOTED_SUCCESS:
            return {
                ...state,
                bestVotedAssets: payload.data,
                loading: false,
            };
        case TYPES.GET_BEST_VOTED_FAIL:
            return {
                ...state,
                failMessage: {
                    error: true,
                    message: payload.message,
                },
                loading: false,
            };
        case TYPES.FROM_BEST_VOTED:
            return {
                ...state,
                fromBestVoted: payload,
            };
        default:
            return state;
    }
};

export default bestVotedAssetsReducer;
