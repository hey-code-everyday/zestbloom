import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

import AssetTagFilter from 'components/elements/marketplace/AssetTagFilter';
import SelectViewMode from 'components/elements/marketplace/SelectViewMode';

const FilterTab = ({
    openFilterBtnLabel,
    isOpenFilter,
    handleOpenFilter,
    viewMode,
    handleViewMode,
    hasListView,
    dashboardPage,
}) => {
    return (
        <Box
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            display="flex"
            style={{ width: '100%' }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <button
                    className="whiteBtnHoverGreen"
                    onClick={() => handleOpenFilter(!isOpenFilter)}
                >{`>>> ${openFilterBtnLabel}`}</button>
            </Box>
            <Box
                display={{ sm: 'none', xs: 'none', lg: 'flex' }}
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
            >
                <AssetTagFilter dashboardPage={dashboardPage} />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                <SelectViewMode
                    viewMode={viewMode}
                    setViewMode={handleViewMode}
                    hasListView={hasListView}
                />
            </Box>
        </Box>
    );
};

FilterTab.propTypes = {
    viewMode: PropTypes.string.isRequired,
    openFilterBtnLabel: PropTypes.string.isRequired,
    isOpenFilter: PropTypes.bool.isRequired,
    handleOpenFilter: PropTypes.func.isRequired,
    handleViewMode: PropTypes.func.isRequired,
    hasListView: PropTypes.bool,
    dashboardPage: PropTypes.bool,
};

export default FilterTab;
