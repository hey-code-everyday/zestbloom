import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

import ViewIconCard from 'assets/img/view-icon-card.svg';
import ViewIconList from 'assets/img/view-icon-list.svg';

export const SHOW_TYPE = {
    grid: 'grid',
    list: 'list',
};

const ShowStyle = ({ selected, onChange }) => {
    return (
        <>
            <Box
                border={1}
                borderRadius={10}
                borderColor="text.black20"
                bgcolor={selected === SHOW_TYPE.grid ? '#e5e5e5' : 'white'}
                height={48}
                width={48}
                className="card-top-action"
                display="flex"
                alignItems="center"
                justifyContent="center"
                ml={1}
            >
                <button onClick={() => onChange(SHOW_TYPE.grid)}>
                    <img src={ViewIconCard} alt="view-card" />
                </button>
            </Box>

            <Box
                border={1}
                borderRadius={10}
                borderColor="text.black20"
                bgcolor={selected === SHOW_TYPE.list ? '#e5e5e5' : 'white'}
                height={48}
                width={48}
                className="card-top-action"
                display="flex"
                alignItems="center"
                justifyContent="center"
                ml={1}
                p={0}
            >
                <button onClick={() => onChange(SHOW_TYPE.list)}>
                    <img src={ViewIconList} alt="view-list" />
                </button>
            </Box>
        </>
    );
};

ShowStyle.propTypes = {
    selected: PropTypes.oneOf([SHOW_TYPE.grid, SHOW_TYPE.list]),
    onChange: PropTypes.func.isRequired,
};

export default ShowStyle;
