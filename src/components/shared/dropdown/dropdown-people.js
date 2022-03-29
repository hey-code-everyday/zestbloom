import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CREATOR, COLLECTOR } from 'configs';
import PropTypes from 'prop-types';

const DropdownPeople = ({ setSortPeopleByRole, sortPeopleByRole }) => {
    const [cardMenuEl, setCardMenuEl] = useState(null);

    const openCardMenu = (e) => {
        setCardMenuEl(e.currentTarget);
    };

    const closeCardMenu = () => {
        setCardMenuEl(null);
    };

    const title = () => {
        switch (sortPeopleByRole) {
            case '':
                return 'All People';
            case CREATOR:
                return 'Creator';
            case COLLECTOR:
                return 'Collector';
            default:
                return 'All People';
        }
    };

    return (
        <>
            <button className="dropdown-btn-people" onClick={openCardMenu}>
                {title()}
                <ExpandMoreIcon />
            </button>
            <Menu
                anchorEl={cardMenuEl}
                keepMounted
                open={Boolean(cardMenuEl)}
                onClose={closeCardMenu}
                className="people-dropdown"
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    className={`people-dropdown-item ${sortPeopleByRole === '' ? 'active' : ''}`}
                    onClick={() => setSortPeopleByRole('')}
                >
                    All People
                </MenuItem>
                <MenuItem
                    className={`people-dropdown-item ${
                        sortPeopleByRole === CREATOR ? 'active' : ''
                    }`}
                    onClick={() => setSortPeopleByRole(CREATOR)}
                >
                    Creator
                </MenuItem>
                <MenuItem
                    className={`people-dropdown-item ${
                        sortPeopleByRole === COLLECTOR ? 'active' : ''
                    }`}
                    onClick={() => setSortPeopleByRole(COLLECTOR)}
                >
                    Collector
                </MenuItem>
            </Menu>
        </>
    );
};

DropdownPeople.propTypes = {
    setSortPeopleByRole: PropTypes.func,
    sortPeopleByRole: PropTypes.string,
};
export default DropdownPeople;
