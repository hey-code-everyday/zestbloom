import React, { useState } from 'react';
import { Button, Menu, Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { USER_FILTER } from 'configs';

const DropdownFilterPeople = ({ filterPeople, setFilterPeople }) => {
    const [cardMenuEl, setCardMenuEl] = useState(null);

    const openCardMenu = (e) => {
        setCardMenuEl(e.currentTarget);
    };

    const closeCardMenu = () => {
        setCardMenuEl(null);
    };
    const handelChangeFeaturedArtists = (event) => {
        setFilterPeople((prev) => (prev ? '' : event.target.name));
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
                    {/*Status*/}
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Artists
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handelChangeFeaturedArtists}
                                        name={USER_FILTER.featured_artist}
                                        color="primary"
                                        checked={!!filterPeople}
                                    />
                                }
                                label="Featured artists"
                            />
                        </FormGroup>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

DropdownFilterPeople.propTypes = {
    filterPeople: PropTypes.string,
    setFilterPeople: PropTypes.func,
};

export default DropdownFilterPeople;
