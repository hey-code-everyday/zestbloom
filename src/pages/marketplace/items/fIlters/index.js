import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Box } from '@material-ui/core';

import { FILTER_CONFIG } from 'configs';
import AssetTagFilter from 'components/elements/marketplace/AssetTagFilter';

const DrawerList = ({ setFilterObj, filterObj, dashboardPage }) => {
    const pushOrDeleteValue = (key, value) => {
        if (value === 'ALL') {
            const selectedFilter = checkboxItems.find((f) => f.filtered_type === key);
            setFilterObj((prev) => ({
                ...prev,
                [key]: selectedFilter ? selectedFilter.filtered_items.map((f) => f.value) : [],
            }));
        } else if (value instanceof Array || key === 'duration') {
            setFilterObj((prev) => ({
                ...prev,
                [key]: value,
            }));
        } else {
            setFilterObj((prev) => ({
                ...prev,
                [key]: prev[key].includes(value)
                    ? prev[key].filter((x) => x !== value)
                    : [...prev[key], value],
            }));
        }
    };

    const checkboxItems = [
        {
            title: 'Asset Quantity',
            filtered_type: 'type',
            filtered_items: FILTER_CONFIG.type,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Sale Type',
            filtered_type: 'status',
            filtered_items: FILTER_CONFIG.status,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Category',
            filtered_type: 'category',
            filtered_items: FILTER_CONFIG.category,
            filterObj,
            pushOrDeleteValue,
        },
        {
            title: 'Price',
            filtered_type: 'price',
            filtered_items: FILTER_CONFIG.price_sidebar,
            filterObj,
            pushOrDeleteValue,
        },
    ];

    const isActiveFilter = (filterKey, value) =>
        !!filterObj[filterKey] && filterObj[filterKey].includes(value);

    return (
        <Box px={1} py={2}>
            <Box my={1}>
                <Typography variant="h5">NFT types</Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                    flexWrap="wrap"
                    mt={1}
                >
                    <AssetTagFilter dashboardPage={dashboardPage} />
                </Box>
            </Box>

            {checkboxItems.map((filter, index) => (
                <Box my={1} key={index}>
                    <Typography variant="h5">{filter.title}</Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="start"
                        flexWrap="wrap"
                        mt={1}
                    >
                        <button
                            className={`whiteBtnHoverGreen ${
                                filterObj[filter.filtered_type].length ===
                                filter.filtered_items.length
                                    ? 'whiteBtnHoverGreen-selected'
                                    : ''
                            }`}
                            onClick={() => pushOrDeleteValue(filter.filtered_type, 'ALL')}
                        >
                            <span className="text">All</span>
                        </button>
                        {filter.filtered_items.map((item, i) => (
                            <button
                                className={`whiteBtnHoverGreen ${
                                    isActiveFilter(filter.filtered_type, item.value)
                                        ? 'whiteBtnHoverGreen-selected'
                                        : ''
                                } mx-1`}
                                onClick={() => pushOrDeleteValue(filter.filtered_type, item.value)}
                                key={`item-${filter.filtered_type}-${i}`}
                            >
                                {item.display}
                            </button>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

DrawerList.propTypes = {
    filterObj: PropTypes.object,
    setFilterObj: PropTypes.func,
    dashboardPage: PropTypes.bool,
};

export default DrawerList;
