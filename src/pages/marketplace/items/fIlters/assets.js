import React from 'react';

import { FILTER_CONFIG } from 'configs';
import CheckboxItem from './items/checkboxItem';
import SortItem from './items/listItem';
import PropTypes from 'prop-types';

const AssetFilter = ({
    setFilterObj,
    filterObj,
    setSortAssets,
    sortAssets,
    filterAssetsByTag,
    setFilterAssetsByTag,
}) => {
    const duration = FILTER_CONFIG.duration;
    const sort_by = FILTER_CONFIG.sort_by;
    const status = FILTER_CONFIG.status;
    const category = FILTER_CONFIG.category;
    const type = FILTER_CONFIG.type;
    const price = FILTER_CONFIG.price_sidebar;
    const assetTag_types = FILTER_CONFIG.assetTag_types;

    const pushOrDeleteValue = (key, value) => {
        if (value instanceof Array || key === 'duration') {
            setFilterObj((prev) => ({
                ...prev,
                [key]: value,
            }));
            return;
        }
        setFilterObj((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((x) => x !== value)
                : [...prev[key], value],
        }));
    };

    const setTag = (method, value) => {
        return method((prev) =>
            prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
        );
    };

    const checkboxItems = [
        {
            title: 'Asset Quantity',
            filtered_type: 'type',
            filtered_items: type,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Sale Type',
            filtered_type: 'status',
            filtered_items: status,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Category',
            filtered_type: 'category',
            filtered_items: category,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Price',
            filtered_type: 'price',
            filtered_items: price,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Asset Tags',
            filtered_type: 'assetTag_types',
            filtered_items: assetTag_types,
            filterAssetsByTag,
            setTag,
            setFilterAssetsByTag,
            tags: true,
        },
    ];

    const sortItems = [
        {
            title: 'Mint Date',
            filtered_type: 'duration',
            filtered_items: duration,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Sort By',
            filtered_type: 'sort_by',
            filtered_items: sort_by,
            sortAssets,
            setSortAssets,
        },
    ];
    return (
        <div>
            {checkboxItems.map((item) => (
                <CheckboxItem
                    key={item?.filtered_type}
                    title={item?.title}
                    filtered_type={item?.filtered_type}
                    filtered_items={item?.filtered_items}
                    filterObj={item?.filterObj}
                    pushOrDeleteValue={item?.pushOrDeleteValue}
                    filterByTag={item?.filterAssetsByTag}
                    setTag={item?.setTag}
                    setFilterByTag={item?.setFilterAssetsByTag}
                    tags={item?.tags}
                />
            ))}
            {sortItems.map((item) => (
                <SortItem
                    key={item?.filtered_type}
                    title={item?.title}
                    filtered_type={item?.filtered_type}
                    filtered_items={item?.filtered_items}
                    filterObj={item?.filterObj}
                    pushOrDeleteValue={item?.pushOrDeleteValue}
                    sort={item?.sortAssets}
                    setSort={item?.setSortAssets}
                />
            ))}
        </div>
    );
};

AssetFilter.propTypes = {
    setFilterObj: PropTypes.func,
    filterObj: PropTypes.object,
    setSortAssets: PropTypes.func,
    sortAssets: PropTypes.string,
    filterAssetsByTag: PropTypes.array,
    setFilterAssetsByTag: PropTypes.func,
};

export default AssetFilter;
