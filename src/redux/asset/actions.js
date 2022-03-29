import * as TYPES from './types.js';
import AssetsServise from './services';
import axios from 'axios';

export const startUpload = () => ({ type: TYPES.START_UPLOAD });
export const finishUpload = () => ({ type: TYPES.FINISH_UPLOAD });

export const addAssets = (data) => (dispatch) => {
    return AssetsServise.addAssets(data)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            if (err?.response?.data?.retry) {
                const originalRequest = err.config;
                return setTimeout(() => {
                    return axios(originalRequest)
                        .then((x) => {})
                        .catch((error) => {
                            console.log(error);
                        });
                }, 2000);
            }
            return err.response;
        });
};

export const deleteAsset = (guid, data) => (dispatch) => {
    return AssetsServise.deleteAsset(guid, data)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getAllContractsForAsset = (guid) => (dispatch) => {
    return AssetsServise.getContracts(guid)
        .then((response) => {
            if (response?.status === 200) {
                const saleByEscrow = response?.data?.results?.filter(
                    (x) => x.type === 'SaleByEscrow',
                );
                const offerByEscrow = response?.data?.results?.filter(
                    (x) => x.type === 'OfferByEscrow',
                );
                return {
                    saleByEscrow,
                    offerByEscrow,
                };
            }
            return {
                saleByEscrow: [],
                offerByEscrow: [],
            };
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};
