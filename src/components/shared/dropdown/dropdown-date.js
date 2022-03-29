import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const DropdownDate = () => {
    const [cardMenuEl, setCardMenuEl] = useState(null);

    const openCardMenu = (e) => {
        setCardMenuEl(e.currentTarget);
    };

    const closeCardMenu = () => {
        setCardMenuEl(null);
    };

    return (
        <>
            <Button className="dropdown-btn" variant="outlined" onClick={openCardMenu}>
                Last 7 Days
                <ExpandMoreIcon />
            </Button>
            <Menu
                anchorEl={cardMenuEl}
                keepMounted
                open={Boolean(cardMenuEl)}
                onClose={closeCardMenu}
                className="date-dropdown"
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
                <MenuItem className="date-dropdown-item">Today</MenuItem>
                <MenuItem className="date-dropdown-item">Yesterday</MenuItem>
                <MenuItem className="date-dropdown-item active">Last 7 Days</MenuItem>
                <MenuItem className="date-dropdown-item">Last 30 Days</MenuItem>
                <MenuItem className="date-dropdown-item">This Month</MenuItem>
                <MenuItem className="date-dropdown-item">Last Month</MenuItem>
                <MenuItem className="date-dropdown-item">This Year</MenuItem>
                <MenuItem className="date-dropdown-item">Last Year</MenuItem>
            </Menu>
        </>
    );
};

export default DropdownDate;
