import * as TYPES from './types.js';
import SalesService from './services';

export const getSalesHistory = (username, sort, filter) => (dispatch) => {
    dispatch({
        type: TYPES.GET_SALES_HISTORY_REQUEST,
    });

    return SalesService.getSalesHistory(username, sort, filter)
        .then((response) => {
            if (response?.data) {
                const { results, next } = response?.data;
                dispatch({
                    type: TYPES.GET_SALES_HISTORY_SUCCESS,
                    payload: { data: results ?? [], next },
                });
                return response.data;
            }
            dispatch({
                type: TYPES.GET_SALES_HISTORY_FAIL,
                payload: {
                    error: 'Error while fetching sales history.',
                },
            });
        })
        .catch((error) => {
            console.log(error);
            dispatch({
                type: TYPES.GET_SALES_HISTORY_FAIL,
                payload: {
                    error: 'Error while fetching sales history.',
                },
            });
        });
};

export const loadMoreItems = (loadMoreURL) => (dispatch) => {
    dispatch({ type: TYPES.LOAD_MORE_SALES_HISTORY_REQUEST });
    return SalesService.loadMoreSalesHistory(loadMoreURL)
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.LOAD_MORE_SALES_HISTORY_SUCCESS,
                    payload: {
                        data: response.data.results,
                        next: response.data.next,
                    },
                });
            }
            return dispatch({
                type: TYPES.LOAD_MORE_SALES_HISTORY_FAIL,
                payload: {
                    message: 'Error while receiving more sales history items',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.LOAD_MORE_SALES_HISTORY_FAIL,
                payload: {
                    message: 'Error while receiving more sales history items',
                },
            });
        });
};
