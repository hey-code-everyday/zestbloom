import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Menu, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const FlexibleDropdownSort = ({ setSort, sortOptions, sortingOption }) => {
    const [cardMenuEl, setCardMenuEl] = useState(null);

    const handleChange = (event) => {
        setSort(event.target.value);
    };

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
                    <RadioGroup value={sortingOption} onChange={handleChange}>
                        {sortOptions.map((sortOption) => [
                            <Typography
                                variant="body1"
                                className="text-capitalize sort-category"
                                key={`category-${sortOption.category}`}
                            >
                                {sortOption.category}
                            </Typography>,
                            sortOption.options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                    className="radio-item"
                                />
                            )),
                        ])}
                    </RadioGroup>
                </FormControl>
            </Menu>
        </>
    );
};

FlexibleDropdownSort.propTypes = {
    setSort: PropTypes.func.isRequired,
    sortOptions: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                }),
            ),
        }),
    ).isRequired,
    sortingOption: PropTypes.string.isRequired,
};

export default FlexibleDropdownSort;
