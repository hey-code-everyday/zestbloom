import * as TYPES from './types.js';
import AlgorandServise from './services';

export const getIPFSHash = (data) => (dispatch) => {
    return AlgorandServise.getIPFSHash(data)
        .then((response) => {
            if (response.status === 201) {
                const ipfsHashForFile = response.data.file.IpfsHash;
                const ipfsHashFormetaData = response.data.metadata.IpfsHash;
                const metaHash = response?.data['metadata-hash'];
                const specsData = response?.data['specs-data'];
                const specsVersion = response?.data['specs-version'];
                return {
                    status: response.status,
                    ipfsHashForFile,
                    ipfsHashFormetaData,
                    metaHash,
                    specsData,
                    specsVersion,
                };
            }
        })
        .catch((err) => {
            return {
                status: err?.response?.status,
                messages: err?.response?.data,
            };
        });
};

export const getTealForContract = (nodeGuid) => (dispatch) => {
    dispatch({ type: TYPES.GET_TEAL_FOR_CONTRACT_REQUEST });
    return AlgorandServise.getTealForContract(nodeGuid)
        .then((response) => {
            if (response.status === 200) {
                dispatch({
                    type: TYPES.GET_TEAL_FOR_CONTRACT_SUCCESS,
                    payload: { data: response.data },
                });
                return response;
            }
            dispatch({ type: TYPES.GET_TEAL_FOR_CONTRACT_FAIL, payload: { error: '' } });
            return response;
        })
        .catch((err) => {
            dispatch({ type: TYPES.GET_TEAL_FOR_CONTRACT_FAIL, payload: { error: '' } });
            return err.response;
        });
};

export const deleteEscrowContract = (guid, blob) => (dispatch) => {
    return AlgorandServise.deleteEscrowContract(guid, blob)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            return err.response;
        });
};

export const getTealForSale = (guid) => (dispatch) => {
    dispatch({ type: TYPES.GET_TEAL_FOR_SALE_CONTRACT_REQUEST });
    return AlgorandServise.getTealForSale(guid)
        .then((response) => {
            if (response.status === 200) {
                dispatch({
                    type: TYPES.GET_TEAL_FOR_SALE_CONTRACT_SUCCESS,
                    payload: { data: response.data },
                });
                return response.data;
            }
            dispatch({ type: TYPES.GET_TEAL_FOR_SALE_CONTRACT_FAIL, payload: { error: '' } });
            return null;
        })
        .catch((err) => {
            dispatch({ type: TYPES.GET_TEAL_FOR_SALE_CONTRACT_FAIL, payload: { error: '' } });
            return null;
        });
};

export const getManagerAddress = () => (dispatch) => {
    dispatch({ type: TYPES.GET_MANAGER_ADDRESS_REQUEST });
    return AlgorandServise.getManagerAddress()
        .then((response) => {
            if (response.status === 200) {
                return dispatch({
                    type: TYPES.GET_MANAGER_ADDRESS_SUCCESS,
                    payload: { address: response.data.public },
                });
            }
            return dispatch({ type: TYPES.GET_MANAGER_ADDRESS_FAIL, payload: { error: '' } });
        })
        .catch((err) => {
            console.log(err);
            return dispatch({ type: TYPES.GET_MANAGER_ADDRESS_FAIL, payload: { error: '' } });
        });
};

export const getAlgorandAccountInfo = (account) => (dispatch) => {
    return AlgorandServise.getAccountInfo(account)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
            return null;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

export const setContract = (guid, blob) => (dispatch) => {
    return AlgorandServise.setContract(guid, blob)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
            return null;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

export const activateOfferByEscrowContract = (guid, blob) => (dispatch) => {
    return AlgorandServise.activateOfferByEscrowContract(guid, blob)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
            return null;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};
export const getOfferByEsscrowContract = (values) => (dispatch) => {
    return AlgorandServise.getOfferByEsscrowContract(values)
        .then((response) => {
            if (response.status === 201) {
                return { status: response?.status, data: response?.data };
            }
            return null;
        })
        .catch((err) => {
            if (err?.response?.data) {
                return { status: err?.response?.status, data: err?.response?.data };
            }
            return null;
        });
};

export const broadcastOffer = (values) => (dispatch) => {
    return AlgorandServise.broadcastOffer(values)
        .then((response) => {
            if (response.status === 201) {
                return { status: response?.status, data: response?.data };
            }
            return null;
        })
        .catch((err) => {
            if (err?.response?.data) {
                return { status: err?.response?.status, data: err?.response?.data };
            }
            return null;
        });
};

export const deleteOfferByEscrowContract = (guid) => (dispatch) => {
    return AlgorandServise.deleteOfferByEscrowContract(guid)
        .then((response) => {
            if (response.status === 201) {
                return response.data;
            }
            return null;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};
