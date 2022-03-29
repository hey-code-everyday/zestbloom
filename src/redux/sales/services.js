import axios from 'axios';
import { API_CONFIG } from 'configs';

const getSalesHistory = (username, sort_by = '', filter = {}) =>
    axios.get(`${API_CONFIG.sales}`, {
        params: {
            seller: username,
            sort_by,
            ...filter,
        },
    });

const loadMoreSalesHistory = (loadMoreURL) => axios.get(loadMoreURL);

const data = {
    getSalesHistory,
    loadMoreSalesHistory,
};

export default data;
