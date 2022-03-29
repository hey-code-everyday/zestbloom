import React, { useState } from 'react';
import { Button, Menu } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { USER_FILTER } from 'configs';
import PropTypes from 'prop-types';

const DropdownSortPeople = ({ sortPeople, setSortPeople }) => {
    const handleChange = (event) => {
        setSortPeople(event.target.value);
    };

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
                Sort
                <ExpandMoreIcon />
            </Button>
            <Menu
                anchorEl={cardMenuEl}
                keepMounted
                open={Boolean(cardMenuEl)}
                onClose={closeCardMenu}
                className="sort-dropdown"
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
                <FormControl component="fieldset">
                    <RadioGroup value={sortPeople} onChange={handleChange}>
                        <FormControlLabel
                            value={USER_FILTER.most_followed}
                            control={<Radio />}
                            label="Most followed"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value={USER_FILTER.a_z}
                            control={<Radio />}
                            label="A to Z"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value={USER_FILTER.most_voted}
                            control={<Radio />}
                            label="Most Voted"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value={USER_FILTER.new_creators}
                            control={<Radio />}
                            label="New Creators"
                            className="radio-item"
                        />
                    </RadioGroup>
                </FormControl>
            </Menu>
        </>
    );
};

DropdownSortPeople.propTypes = {
    sortPeople: PropTypes.string,
    setSortPeople: PropTypes.func,
};

export default DropdownSortPeople;
