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

const DropdownSaleType = ({ contractType, setContractType }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event, value) => {
        setOpen(false);
    };

    const chooseType = (value) => {
        setContractType(value);
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

    const getTitle = (saleType) => {
        switch (saleType) {
            case 'list-price-escrow':
                return 'List Price (Escrow)';
            case 'list-for-offer':
                return 'List for Offer (Blind Auction)';
            case 'auction-escrow':
                return 'Auction (Escrow)';
            case 'list-price-clawback':
                return 'List Price (Clawback)';
            case 'auction-clawback':
                return 'Auction (Clawback)';
            default:
                return 'List Price (Escrow)';
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
                {getTitle(contractType)}
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
                                    <MenuItem onClick={() => chooseType('list-price-escrow')}>
                                        List Price (Escrow)
                                    </MenuItem>
                                    <MenuItem onClick={() => chooseType('list-for-offer')}>
                                        List for Offer (Escrow)
                                    </MenuItem>
                                    <MenuItem onClick={() => chooseType('auction-escrow')}>
                                        Auction (Escrow)
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => chooseType('list-price-clawback')}
                                        disabled
                                    >
                                        List Price (Clawback)
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => chooseType('auction-clawback')}
                                        disabled
                                    >
                                        Auction (Clawback)
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

DropdownSaleType.propTypes = {
    contractType: PropTypes.string,
    setContractType: PropTypes.func,
};

export default DropdownSaleType;
