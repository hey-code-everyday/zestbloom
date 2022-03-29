import React, { useState } from 'react';
import { Button, Menu } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';

const DropdownSortAsset = ({ setSortAssets, sortAssets }) => {
    const handleChange = (event) => {
        setSortAssets(event.target.value);
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
                    <RadioGroup value={sortAssets} onChange={handleChange}>
                        <FormControlLabel
                            value="popular"
                            control={<Radio />}
                            label="Popular"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value="price_l_h"
                            control={<Radio />}
                            label="Price: Low to high"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value="price_h_l"
                            control={<Radio />}
                            label="Price: High to low"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value="recently_listed"
                            control={<Radio />}
                            label="Recently Listed"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value="recently_sold"
                            control={<Radio />}
                            label="Recently Sold"
                            className="radio-item"
                        />
                        <FormControlLabel
                            value="recently_liked"
                            control={<Radio />}
                            label="Recently Liked"
                            className="radio-item"
                        />
                    </RadioGroup>
                </FormControl>
            </Menu>
        </>
    );
};

DropdownSortAsset.propTypes = {
    setSortAssets: PropTypes.func,
    sortAssets: PropTypes.string,
};

export default DropdownSortAsset;
