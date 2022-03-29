import * as TYPES from './types.js';

const initialState = {
    data: [],
    loadMoreUrl: '',
    loading: false,
    loadMoreLoading: false,
    error: null,
};

const salesReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case TYPES.GET_SALES_HISTORY_REQUEST:
            return {
                ...state,
                error: null,
                loadMoreUrl: '',
                loading: true,
            };

        case TYPES.GET_SALES_HISTORY_SUCCESS: {
            return {
                ...state,
                data: payload.data,
                loadMoreUrl: payload.next,
                loading: false,
                error: null,
            };
        }

        case TYPES.GET_SALES_HISTORY_FAIL: {
            return {
                ...state,
                data: [],
                loading: false,
                loadMoreUrl: '',
                error: payload.error,
            };
        }

        case TYPES.LOAD_MORE_SALES_HISTORY_REQUEST: {
            return {
                ...state,
                loadMoreLoading: true,
                error: null,
            };
        }

        case TYPES.LOAD_MORE_SALES_HISTORY_SUCCESS: {
            return {
                ...state,
                data: payload.data,
                loadMoreUrl: payload.next,
                loadMoreLoading: false,
                error: null,
            };
        }

        case TYPES.LOAD_MORE_SALES_HISTORY_FAIL: {
            return {
                ...state,
                loadMoreUrl: '',
                loadMoreLoading: false,
                error: payload.error,
            };
        }

        default:
            return state;
    }
};

export default salesReducer;
