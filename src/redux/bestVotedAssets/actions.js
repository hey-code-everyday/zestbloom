import * as TYPES from './types.js';
import AssetsServise from './services';

export const setValueBestVoted = (payload) => ({ type: TYPES.FROM_BEST_VOTED, payload });

export const getBestVoted = () => (dispatch) => {
    dispatch({ type: TYPES.GET_BEST_VOTED_REQUEST });
    return AssetsServise.getBestVoted()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_BEST_VOTED_SUCCESS,
                    payload: {
                        data: response.data.results,
                    },
                });
            }
            return dispatch({
                type: TYPES.GET_BEST_VOTED_FAIL,
                payload: {
                    message: 'Error while getting best voted assets',
                },
            });
        })
        .catch((err) => {
            return dispatch({
                type: TYPES.GET_BEST_VOTED_FAIL,
                payload: {
                    message: 'Error while getting best voted assets',
                },
            });
        });
};

export const upvoteAsset = (guid) => (dispatch) => {
    return AssetsServise.upvoteAsset(guid)
        .then((response) => {
            if (response.status === 201) {
                return dispatch(getBestVoted());
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const unUpvoteAsset = (guid) => (dispatch) => {
    return AssetsServise.unUpvoteAsset(guid)
        .then((response) => {
            if (response.status === 204) {
                return dispatch(getBestVoted());
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
