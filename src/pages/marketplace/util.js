import moment from 'moment';

const getTimeRange = (duration) => {
    const now = moment().utc();
    let created_after = '';
    let created_before = '';
    let query = '';
    switch (duration) {
        case 'yesterday':
            created_after = now.subtract(24, 'hour').toISOString();
            query = `created_after=${created_after}`;
            return query;
        case 'last7days':
            created_after = now.subtract(7, 'days').toISOString();
            query = `created_after=${created_after}`;
            return query;
        case 'last30days':
            created_after = now.subtract(30, 'days').toISOString();
            query = `created_after=${created_after}`;
            return query;
        case 'thismonth':
            let this_month = now.format('YYYY-MM');
            created_after = moment(this_month).toISOString();
            created_before = now.toISOString();
            query = `created_after=${created_after}&created_before=${created_before}`;
            return query;
        case 'lastmonth':
            let last_month = now.subtract(1, 'month').format('YYYY-MM');
            created_after = moment(last_month).toISOString();
            created_before = moment(moment.utc().format('YYYY-MM').concat('-01')).toISOString();
            query = `created_after=${created_after}&created_before=${created_before}`;
            return query;
        case 'thisyear':
            let this_year = now.format('YYYY');
            created_after = moment(this_year).toISOString();
            created_before = now.toISOString();
            query = `created_after=${created_after}&created_before=${created_before}`;
            return query;
        case 'lastyear':
            let last_year = now.subtract(1, 'year').format('YYYY');
            created_after = moment(last_year).toISOString();
            created_before = moment(moment.utc().format('YYYY').concat('-01-01')).toISOString();
            query = `created_after=${created_after}&created_before=${created_before}`;
            return query;
        default:
            return '';
    }
};

export const getFilteredPeopleElements = (
    sortPeople,
    filterPeopleByTag,
    searchValue,
    sortPeopleByRole,
    filterPeople,
) => {
    const filterElements = ['page_size=12'];
    if (sortPeople) {
        filterElements.push(`sort_by=${sortPeople}`);
    }
    if (filterPeopleByTag.length > 0) {
        filterElements.push(`tags=${filterPeopleByTag.join(',')}`);
    }
    if (searchValue) {
        filterElements.push(`search=${encodeURIComponent(searchValue)}`);
    }
    if (sortPeopleByRole) {
        filterElements.push(`role=${sortPeopleByRole}`);
    }
    if (filterPeople) {
        filterElements.push(`collection=${filterPeople}`);
    }
    const filterPath = filterElements.length !== 0 ? `?${filterElements.join('&')}` : '';
    return filterPath;
};

export const getFilteredAssetElements = (
    filterObj,
    sortAssets,
    filterAssetsByTag,
    searchAssets,
) => {
    const filterElements = ['page_size=12'];
    if (filterObj.duration) {
        const duration = getTimeRange(filterObj.duration);
        filterElements.push(duration);
    }
    if (filterObj.category && filterObj.category.length !== 0) {
        filterElements.push(`category=${filterObj.category.join(',')}`);
    }
    if (filterObj.status && filterObj.status.length !== 0) {
        filterElements.push(`status=${filterObj.status.join(',')}`);
    }
    if (filterObj.type && filterObj.type.length !== 0) {
        filterElements.push(`type=${filterObj.type.join(',')}`);
    }
    if (filterObj.price && filterObj.price.length !== 0) {
        filterElements.push(`price=${filterObj.price.join(',')}`);
    }
    if (sortAssets) {
        filterElements.push(`sort_by=${sortAssets}`);
    }
    if (filterAssetsByTag?.length > 0 && filterAssetsByTag.length < 6) {
        filterElements.push(`media_types=${filterAssetsByTag.join(',')}`);
    }
    if (searchAssets) {
        filterElements.push(`search=${encodeURIComponent(searchAssets)}`);
    }
    const filterPath = filterElements.length !== 0 ? `?${filterElements.join('&')}` : '';
    return filterPath;
};
