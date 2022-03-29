import * as TYPES from './types.js';

const initialState = {
    loading: false,
    finishUploading: false,
    zestBloomManagerAddress: '',
    failMessage: {
        error: false,
        message: '',
    },
};

const algorandReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_MANAGER_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_MANAGER_ADDRESS_SUCCESS:
            return {
                ...state,
                zestBloomManagerAddress: payload.address,
                loading: false,
            };

        case TYPES.GET_MANAGER_ADDRESS_FAIL:
            return {
                ...state,
                error: payload.error,
                loading: false,
            };
        default:
            return state;
    }
};

export default algorandReducer;
