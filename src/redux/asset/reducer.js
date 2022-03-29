import * as TYPES from './types.js';

const initialState = {
    loading: false,
    finishUploading: false,
    failMessage: {
        error: false,
        message: '',
    },
};

const assetsReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case TYPES.START_UPLOAD:
            return {
                ...state,
                loading: true,
            };
        case TYPES.FINISH_UPLOAD:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export default assetsReducer;
