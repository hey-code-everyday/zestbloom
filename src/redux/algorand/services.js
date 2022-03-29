import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const getIPFSHash = (data) => {
    return axios.post(ASSETS_CONFIG.getIPFSHash, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// const getTealForContract = (guid) => axios.get(`${ASSETS_CONFIG.getTealForContract}${guid}/`);
const getTealForContract = (nodeGuid) =>
    axios.post(ASSETS_CONFIG.escrowContract, { node: nodeGuid });
const getTealForSale = (guid) => axios.get(`${ASSETS_CONFIG.escrowContract}${guid}/`);
const deleteEscrowContract = (guid, blob) =>
    axios.delete(`${ASSETS_CONFIG.deleteEscrowContract}${guid}/`, { data: { blob } });

const getManagerAddress = () => axios.get(ASSETS_CONFIG.getManagerAddress);

const getAccountInfo = (account) => axios.get(`${ASSETS_CONFIG.getAccountInfo}${account}`);

const setContract = (guid, blob) =>
    axios.patch(`${ASSETS_CONFIG.escrowContract}${guid}/`, { blob });

const getOfferByEsscrowContract = (data) => axios.post(ASSETS_CONFIG.offerByEscrow, data);

const broadcastOffer = (data) => axios.post(ASSETS_CONFIG.broadcastOffer, data);

const activateOfferByEscrowContract = (guid, blob) =>
    axios.patch(`${ASSETS_CONFIG.offerByEscrow}${guid}/`, { blob });

const deleteOfferByEscrowContract = (guid) =>
    axios.delete(`${ASSETS_CONFIG.offerByEscrow}${guid}/`);

const data = {
    getIPFSHash,
    getTealForContract,
    getManagerAddress,
    getAccountInfo,
    getTealForSale,
    deleteEscrowContract,
    setContract,
    getOfferByEsscrowContract,
    broadcastOffer,
    activateOfferByEscrowContract,
    deleteOfferByEscrowContract,
};

export default data;
