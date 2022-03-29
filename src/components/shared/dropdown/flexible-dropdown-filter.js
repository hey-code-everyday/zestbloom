import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Menu, Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const allOptionValue = 'ALL';

const FlexibleDropdownFilter = ({ setFilters, selectedFilters, filters, showAllOption }) => {
    const [cardMenuEl, setCardMenuEl] = useState(null);

    const handleOptionClick = (category, filterOption, checked) => {
        const filterCopy = { ...selectedFilters };
        if (checked) {
            if (filterOption === allOptionValue) {
                filterCopy[category] = filters
                    .find((f) => f.category.value === category)
                    .options.map((o) => o.value);
            } else {
                filterCopy[category].push(filterOption);
            }
        } else {
            if (filterOption === allOptionValue) {
                filterCopy[category] = [];
            } else {
                filterCopy[category] = filterCopy[category].filter((f) => f !== filterOption);
            }
        }
        setFilters({ ...filterCopy });
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
                Filter
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
                <Box display="flex" alignItems="flex-start" className="filter-checkboxes">
                    {filters.map((filter) => (
                        <Box className="filter-checkboxes-column" key={filter.category.value}>
                            <Typography variant="body1" className="checklist-title text-capitalize">
                                {filter.category.label}
                            </Typography>
                            <FormGroup>
                                {showAllOption && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) =>
                                                    handleOptionClick(
                                                        filter.category.value,
                                                        allOptionValue,
                                                        e.target.checked,
                                                    )
                                                }
                                                name="All"
                                                color="primary"
                                                checked={
                                                    selectedFilters[filter.category.value]
                                                        .length === filter.options.length
                                                }
                                            />
                                        }
                                        label="All"
                                    />
                                )}
                                {filter.options.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Checkbox
                                                onChange={(e) =>
                                                    handleOptionClick(
                                                        filter.category.value,
                                                        option.value,
                                                        e.target.checked,
                                                    )
                                                }
                                                name={option.value}
                                                color="primary"
                                                checked={selectedFilters[
                                                    filter.category.value
                                                ].includes(option.value)}
                                            />
                                        }
                                        label={option.label}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    ))}
                </Box>
            </Menu>
        </>
    );
};

FlexibleDropdownFilter.defaultProps = {
    showAllOption: false,
};

FlexibleDropdownFilter.propTypes = {
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            }),
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                }),
            ),
        }),
    ),
    selectedFilters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    showAllOption: PropTypes.bool,
};

export default FlexibleDropdownFilter;
