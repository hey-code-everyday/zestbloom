import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import { Logo } from '../../shared';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import algorandLogo from '../../../assets/img/algorand-logo.svg';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    list: {
        width: 300,
    },
    fullList: {
        width: 'auto',
    },
});

const MobileMenu = ({ connectToMyAlgo, onOpenChangeWallet }) => {
    const classes = useStyles();
    const history = useHistory();
    const { selectedWallet } = useSelector((state) => state.profile);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [state, setState] = React.useState({
        top: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ [anchor]: open });
    };

    const onSubmitMarketplace = () => {
        history.push('/marketplace');
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        >
            <div className="mobile-menu-content">
                <button className="mobile-menu-close" onClick={toggleDrawer(anchor, false)}>
                    <CloseIcon />
                </button>
                <Link to="/" className="mobile-logo">
                    <Logo type="logo" width="203" />
                </Link>
                <ul className="mobile-menu">
                    <li className="menu-btn">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onSubmitMarketplace}
                            size="large"
                        >
                            Marketplace
                        </Button>
                    </li>
                    {isLoggedIn &&
                        (!selectedWallet ? (
                            <li className="menu-btn menu-btn-wallet">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={connectToMyAlgo}
                                >
                                    Connect Wallet
                                </Button>
                            </li>
                        ) : (
                            <li className="menu-btn menu-btn-algo">
                                <img
                                    src={algorandLogo}
                                    onClick={onOpenChangeWallet}
                                    style={{ cursor: 'pointer' }}
                                    alt="Algorand"
                                />
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div>
            <React.Fragment>
                <button className="hover-opacity" onClick={toggleDrawer('left', true)}>
                    <MenuIcon style={{ fontSize: 30 }} />
                </button>
                <Drawer
                    anchor="left"
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                    onOpen={toggleDrawer('left', true)}
                >
                    {list('left')}
                </Drawer>
            </React.Fragment>
        </div>
    );
};

MobileMenu.propTypes = {
    connectToMyAlgo: PropTypes.func,
    onOpenChangeWallet: PropTypes.func,
};

export default MobileMenu;
