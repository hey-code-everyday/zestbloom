import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import {
    FormControlLabel,
    Checkbox,
    Button,
    Paper,
    Popper,
    Grow,
    ClickAwayListener,
    MenuList,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const SelectAll = ({ handleSelectAll, selectedCount, allCount, children }) => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    return (
        <div className="profile-action">
            <FormControlLabel
                control={
                    <Checkbox
                        onChange={(e) => handleSelectAll(e)}
                        name="All"
                        color="primary"
                        checked={allCount > 0 && selectedCount === allCount}
                        disabled={allCount === 0}
                    />
                }
                label="Select All"
                style={{ fontWeight: 'bold' }}
            />
            {selectedCount > 0 && (
                <>
                    <Button
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={() => setOpen(!open)}
                        className="dropdown-btn"
                    >
                        Actions
                        <ExpandMoreIcon />
                    </Button>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        className="dropdown-body"
                    >
                        {({ TransitionProps }) => (
                            <Grow {...TransitionProps}>
                                <Paper onClick={() => setOpen(false)}>
                                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                                        <MenuList autoFocusItem={open} id="menu-list-grow">
                                            {children}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </>
            )}
        </div>
    );
};

SelectAll.propTypes = {
    handleSelectAll: PropTypes.func.isRequired,
    selectedCount: PropTypes.number.isRequired,
    allCount: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element.isRequired),
};

export default SelectAll;
