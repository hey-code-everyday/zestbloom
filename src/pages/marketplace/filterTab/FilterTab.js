import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

const FilterTab = ({
    selectedAssetTags,
    assetTags,
    viewMode,
    openFilterBtnLabel,
    isOpenFilter,
    handleOpenFilter,
    handleSelectAssetTag,
    handleViewMode,
}) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <button
                className="whiteBtnHoverGreen"
                onClick={() => handleOpenFilter(!isOpenFilter)}
            >{`>>> ${openFilterBtnLabel}`}</button>

            <Box
                display="grid"
                alignItems="center"
                justifyContent="center"
                gridGap={5}
                gridTemplateColumns="repeat(7, 1fr)"
            >
                <button className="whiteBtnHoverGreen">Virtual Reality</button>
                <button className="whiteBtnHoverGreen">Art</button>
                <button className="whiteBtnHoverGreen">Photography</button>
                <button className="whiteBtnHoverGreen">Music</button>
            </Box>

            <button className="whiteBtnHoverGreen" onClick={() => handleOpenFilter()}>
                Grid
            </button>
        </Box>
    );
};

FilterTab.propTypes = {
    selectedAssetTags: PropTypes.array.isRequired,
    assetTags: PropTypes.array.isRequired,
    viewMode: PropTypes.string.isRequired,
    openFilterBtnLabel: PropTypes.string.isRequired,
    isOpenFilter: PropTypes.bool.isRequired,
    handleOpenFilter: PropTypes.func.isRequired,
    handleSelectAssetTag: PropTypes.func.isRequired,
    handleViewMode: PropTypes.func.isRequired,
};

export default FilterTab;
