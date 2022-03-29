import axios from 'axios';
import { ASSETS_CONFIG } from 'configs';

const addAssets = (data) => axios.post(ASSETS_CONFIG.addAsset, data);
const deleteAsset = (guid, data) => axios.delete(`${ASSETS_CONFIG.deleteAsset}${guid}/`, { data });

const getContracts = (guid) => axios.get(`${ASSETS_CONFIG.getContracts}${guid}/`);

const data = {
    addAssets,
    deleteAsset,
    getContracts,
};

export default data;
