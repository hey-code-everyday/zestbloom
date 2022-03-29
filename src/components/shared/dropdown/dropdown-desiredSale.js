import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        position: 'relative',
        zIndex: 9,
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

const DropdownDesiredSale = ({ defaultFrozen, setDefaultFrozen }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const chooseValue = (value) => {
        setDefaultFrozen(value);
        handleClose();
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const getTitle = (defaultFrozen) => {
        switch (defaultFrozen) {
            case true:
                return 'Safe';
            case false:
                return 'Simple';
            default:
                return 'Simple';
        }
    };
    return (
        <div className={classes.root}>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className="asset-dropdown"
            >
                {getTitle(defaultFrozen)}
                <ExpandMoreIcon />
            </Button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                className="asset-dropdown-body"
            >
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="menu-list-grow"
                                    onKeyDown={handleListKeyDown}
                                >
                                    <MenuItem onClick={(e) => chooseValue(false)}>Simple</MenuItem>
                                    <MenuItem onClick={(e) => chooseValue(true)} disabled>
                                        Safe
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
};

DropdownDesiredSale.propTypes = {
    defaultFrozen: PropTypes.bool,
    setDefaultFrozen: PropTypes.func,
};

export default DropdownDesiredSale;
