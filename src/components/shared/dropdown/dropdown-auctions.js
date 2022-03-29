import React, { useState } from 'react';
import { Button, Menu, Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DropdownAuctions = () => {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
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
                Auctions
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
                <Box display="flex" className="filter-checkboxes">
                    {/*Auctions*/}
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Auctions
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChange}
                                        name="checkedB"
                                        color="primary"
                                        value={checked}
                                    />
                                }
                                label="Active Auctions"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChange}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="My Past Auctions"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChange}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="My Pending Auctions"
                            />
                        </FormGroup>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default DropdownAuctions;
