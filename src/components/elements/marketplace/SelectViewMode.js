import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import GridViewIcon from '../../icons/GridViewIcon';
import TileViewIcon from '../../icons/TileViewIcon';
import ListViewIcon from '../../icons/ListViewIcon';

const SelectViewMode = ({ viewMode, setViewMode, hasListView }) => {
    return (
        <div className="view-mode-container">
            <IconButton
                size="small"
                style={{ margin: '0 4px' }}
                onClick={() => setViewMode('tile')}
            >
                <TileViewIcon active={viewMode === 'tile'} />
            </IconButton>
            <IconButton
                size="small"
                style={{ margin: '0 4px' }}
                onClick={() => setViewMode('grid')}
            >
                <GridViewIcon active={viewMode === 'grid'} />
            </IconButton>
            {hasListView && (
                <IconButton
                    size="small"
                    style={{ margin: '0 4px' }}
                    onClick={() => setViewMode('list')}
                >
                    <ListViewIcon active={viewMode === 'list'} />
                </IconButton>
            )}
        </div>
    );
};
SelectViewMode.propTypes = {
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
    hasListView: PropTypes.bool,
};
export default SelectViewMode;
