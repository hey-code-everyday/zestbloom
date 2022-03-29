import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppBar, Toolbar, Container, Box, Avatar, Typography, IconButton } from '@material-ui/core';
import { Close, Menu, WbSunny, Brightness2 } from '@material-ui/icons';

import {
    setMyAlgoAccount,
    setWallets,
    setNonLoggedMyAlgoAccount,
    toClearWallet,
    changeUiMode,
} from 'redux/profile/actions';
import { needToLoginAction, logout } from 'redux/auth/actions';
import { clearNotifications } from 'redux/notifications/actions';
import { Logo, StartCollectingSearch, Notification } from 'components/shared';
import ProfileMenu from './ProfileMenu';
import {
    SignUp,
    VerifyYourEmail,
    Login,
    ForgotPassword,
    VerifyForgotPasswordEmail,
} from 'components/elements';
import algorandLogo from 'assets/img/algorand-logo.svg';
import { AboutAnchorContext } from '../MainRoute';
import { MARKETPLACE } from '../../../configs/routes';
import ChangeWallet from 'components/elements/modal/changeWallet';
import LottieContainer from 'components/shared/LottieContainer';
import UserNotifications from '../user-notifications';
import { connectToMyAlgo, nonLoggedConnect } from 'transactions/algorand/connectWallet';
import { useOutsideClick } from 'hooks/useOutsideClick';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { CREATOR } from 'configs';

import IconUser from 'assets/img/icon-user.svg';
import IconBook from 'assets/img/icon-book.svg';
import IconHammer from 'assets/img/icon-hammer.svg';
import IconSettings from 'assets/img/icon-settings.svg';
import IconStore from 'assets/img/icon-store.svg';
import IconNotifications from 'assets/img/notifications.svg';
import IconNotificationsActive from 'assets/img/notifications_active.svg';
import IconLogout from 'assets/img/logout.svg';

const Header = ({ hasSearch }) => {
    const history = useHistory();
    const path = history.location.pathname;
    /*User Notifications State*/
    const [userNotifications, setNotifications] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [signupDialog, setSignupDialog] = useState(false);
    const [verifyDialog, setVerifyDialog] = useState(false);
    const [loginDialog, setLoginDialog] = useState(false);
    // const [notificationMessage, setNotificationMessage] = useState(initialErrorMessage);
    const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);
    const [emailFromForgotPassword, setEmailFromForgotPassword] = useState(false);
    const [verifyForgotPasswordDialog, setVerifyForgotPasswordDialog] = useState(false);
    const [profileMenuEl, setProfileMenuEl] = useState(null);
    const [connectLoading, setConnectLoading] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const { user, isLoggedIn, needToLogin } = useSelector((state) => state.auth);
    const { selectedWallet, notifications } = useSelector((state) => state.profile);
    const { allNotifications, unReadedNotifyCount } = useSelector((state) => state.notifications);
    const { isDarkMode } = useSelector((state) => state.profile);

    const anchorRef = useContext(AboutAnchorContext);
    const dispatch = useDispatch();
    const [changeWallet, setChangeWallet] = useState(false);
    const { isMobile } = useWindowDimensions();

    const notifyRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const unreadedNotifications = useMemo(() => {
        const unreaded = allNotifications?.find((x) => x.is_unread);
        return !!unreaded; // TODO unread
    }, [allNotifications]);

    const notificationsToShow = useMemo(() => {
        return isMobile ? (notifications ?? []).slice(0, 1) : notifications;
    }, [isMobile, notifications]);

    const openUserNotifications = async (withDelay = false) => {
        if (withDelay) await onClickMenu();
        setNotifications(!userNotifications);
    };

    const closeUserNotifications = () => {
        setNotifications(false);
    };

    const onScroll = useCallback(() => {
        setScrolled(window.pageYOffset > 20);

        if (hasSearch) {
            const searchOffset = document
                .getElementById('banner-search')
                ?.getBoundingClientRect().top;
            setShowSearch(searchOffset < 30);
        }
    }, [hasSearch]);

    // TODO comment every single use effect

    // EFFECT attach scroll listener

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', onScroll);
        }
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    useEffect(() => {
        const conectedWallets = JSON.parse(localStorage.getItem('wallets'));
        if (conectedWallets) {
            dispatch(setWallets(conectedWallets));
        }
    }, [dispatch]);

    useEffect(() => {
        const inSingleAsset = path.split('/').includes('asset');
        const isMarketPlace = path.split('/').includes('marketplace');
        if (inSingleAsset || isMarketPlace) {
            setShowSearch(true);
        }
    }, [path]);

    useEffect(() => {
        if (needToLogin) {
            setLoginDialog(true);
            dispatch(needToLoginAction(false));
        }
    }, [needToLogin, dispatch]);

    useEffect(() => {
        const notificationIcon = notifyRef?.current;
        if (notificationIcon) notificationIcon.title = unReadedNotifyCount;
    }, [notifyRef, unReadedNotifyCount]);

    const onOpenChangeWallet = () => {
        setChangeWallet(true);
    };
    const onCloseChangeWallet = () => {
        setChangeWallet(false);
    };

    const onScrollToAbout = () =>
        window.scrollTo({ top: anchorRef.current.offsetTop, behavior: 'smooth' });

    const setWalletsToUser = async (getAccounts, loggedIn = true) => {
        return loggedIn
            ? dispatch(setMyAlgoAccount(getAccounts))
            : dispatch(setNonLoggedMyAlgoAccount(getAccounts));
    };

    const openProfileMenu = (e) => {
        setProfileMenuEl(e.currentTarget);
    };

    const closeProfileMenu = () => {
        setProfileMenuEl(null);
    };

    const onOpenSignupDialog = () => {
        onCloseLoginDialog();
        setSignupDialog(true);
    };

    const onCloseSignupDialog = () => {
        setSignupDialog(false);
    };

    const onOpenVerifyDialog = () => {
        setVerifyDialog(true);
    };

    const onCloseVerifyDialog = () => {
        setVerifyDialog(false);
    };

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refresh');
        dispatch(logout(refreshToken)).then((response) => {
            dispatch(clearNotifications());
            setNotifications(false);
            history.push('/');
            dispatch(toClearWallet());
        });
    };

    const onOpenLoginDialog = async (withDelay = false) => {
        if (withDelay) await onClickMenu();
        if (isLoggedIn) {
            handleLogout();
            return;
        }

        onCloseSignupDialog();
        setLoginDialog(true);
    };

    const onCloseLoginDialog = () => {
        setLoginDialog(false);
    };

    const onOpenForgotPasswordDialog = () => {
        onCloseLoginDialog();
        setForgotPasswordDialog(true);
    };

    const onCloseForgotPasswordDialog = () => {
        setForgotPasswordDialog(false);
    };

    const onOpenVerifyForgotPasswordDialog = () => {
        setVerifyForgotPasswordDialog(true);
    };

    const onCloseVerifyForgotPasswordDialog = () => {
        setVerifyForgotPasswordDialog(false);
    };

    const onClickMenu = (cb) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                closeUserNotifications();
                setMobileMenuVisible(!mobileMenuVisible);
                resolve(true);
            }, 500);
        });
    };

    const hideMenu = () => {
        setMobileMenuVisible(false);
    };

    const onClickProfile = async () => {
        if (user?.username) {
            await onClickMenu();
            history.push(`/profile/${user.username}`);
        }
    };

    const onClickMarketplace = async () => {
        await onClickMenu();
        history.push('/marketplace');
    };

    const onClickAuction = async () => {
        await onClickMenu();
        history.push('/marketplace?status=auction');
    };
    const canCreate = user?.role === CREATOR && window.location.pathname !== '/upload-asset';

    const onConnectWallet = async () => {
        await onClickMenu();
        isLoggedIn
            ? connectToMyAlgo(setWalletsToUser, setConnectLoading)
            : nonLoggedConnect(setWalletsToUser);
    };

    useOutsideClick(mobileMenuRef, hideMenu);

    const switchLightMode = () => dispatch(changeUiMode(!isDarkMode));

    return (
        <>
            {/*  modals start */}
            <SignUp
                signupDialog={signupDialog}
                onCloseSignupDialog={onCloseSignupDialog}
                onOpenLoginDialog={onOpenLoginDialog}
                onOpenVerifyDialog={onOpenVerifyDialog}
            />
            <VerifyYourEmail
                verifyDialog={verifyDialog}
                onCloseVerifyDialog={onCloseVerifyDialog}
            />
            {loginDialog && (
                <Login
                    loginDialog={loginDialog}
                    onCloseLoginDialog={onCloseLoginDialog}
                    onOpenSignupDialog={onOpenSignupDialog}
                    onOpenForgotPasswordDialog={onOpenForgotPasswordDialog}
                />
            )}
            <VerifyForgotPasswordEmail
                verifyForgotPasswordDialog={verifyForgotPasswordDialog}
                onCloseVerifyForgotPasswordDialog={onCloseVerifyForgotPasswordDialog}
                emailFromForgotPassword={emailFromForgotPassword}
            />
            <ForgotPassword
                forgotPasswordDialog={forgotPasswordDialog}
                onCloseForgotPasswordDialog={onCloseForgotPasswordDialog}
                onOpenLoginDialog={onOpenLoginDialog}
                onOpenVerifyForgotPasswordDialog={onOpenVerifyForgotPasswordDialog}
                setEmailFromForgotPassword={setEmailFromForgotPassword}
            />
            {selectedWallet && (
                <ChangeWallet
                    changeWallet={changeWallet}
                    onCloseChangeWallet={onCloseChangeWallet}
                />
            )}
            {/*User Notifications*/}
            {isLoggedIn && (
                <UserNotifications
                    notifications={userNotifications}
                    setNotifications={setNotifications}
                    onClose={closeUserNotifications}
                />
            )}
            <Box className="notification-container">
                {notificationsToShow?.map((notification, i) => (
                    <Notification
                        key={notification?.guid}
                        type={notification?.status}
                        title={notification?.status}
                        message={notification?.message}
                        guid={notification?.guid}
                    />
                ))}
            </Box>
            {/* modals end */}

            {isMobile ? (
                <>
                    <Box className="header">
                        <Link to="" className="logo full-width">
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Logo type="logoIcon" width="24" />
                                <Typography className="header-zb-title" variant="h3">
                                    ZESTBLOOM
                                </Typography>
                            </Box>
                        </Link>
                    </Box>

                    <Box className="menu-container" ref={mobileMenuRef}>
                        <Box onClick={onClickMenu} display="flex" px={1.5} py={3}>
                            {mobileMenuVisible ? (
                                <Close className="menu-icon" fontSize="large" />
                            ) : (
                                <Menu className="menu-icon" fontSize="large" />
                            )}
                        </Box>
                        {mobileMenuVisible && (
                            <Box className="mobile-menu-active">
                                <Box
                                    className="mobile-menu-item"
                                    onClick={() => onOpenLoginDialog(true)}
                                >
                                    {isLoggedIn ? (
                                        <>
                                            <img src={IconLogout} alt="Logout" />
                                            <span>Log Out</span>
                                        </>
                                    ) : (
                                        <>
                                            <img src={IconUser} alt="Sign in" />
                                            <span>Sign In</span>
                                        </>
                                    )}
                                </Box>
                                <Box className="mobile-menu-item" onClick={onConnectWallet}>
                                    {connectLoading ? (
                                        <div className="menu-btn menu-btn-algo">
                                            <LottieContainer
                                                containerStyles={{
                                                    height: '46px',
                                                    width: '100%',
                                                    marginTop: 12,
                                                }}
                                                lottieStyles={{ width: '50px' }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <img src={IconBook} alt="Connect Wallet" />
                                            <span>{`${
                                                selectedWallet ? 'Change' : 'Connect'
                                            } Wallet`}</span>
                                        </>
                                    )}
                                </Box>
                                <Box
                                    className={`mobile-menu-item ${isLoggedIn ? '' : 'disabled'}`}
                                    onClick={onClickProfile}
                                >
                                    <img src={IconSettings} alt="Profile" />
                                    <span>Profile</span>
                                </Box>
                                <Box className="mobile-menu-item" onClick={onClickMarketplace}>
                                    <img src={IconStore} alt="Marketplace" />
                                    <span>Marketplace</span>
                                </Box>
                                <Box
                                    className={`mobile-menu-item ${isLoggedIn ? '' : 'disabled'}`}
                                    onClick={() => openUserNotifications(true)}
                                >
                                    {
                                        <img
                                            src={
                                                unreadedNotifications && unReadedNotifyCount
                                                    ? IconNotificationsActive
                                                    : IconNotifications
                                            }
                                            alt="Notifications"
                                        />
                                    }
                                    <span>Notifications</span>
                                </Box>
                                <Box className="mobile-menu-item" onClick={onClickAuction}>
                                    <img src={IconHammer} alt="Auction" />
                                    <span>Auction</span>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </>
            ) : (
                <AppBar
                    position={'fixed'}
                    className={`header animation-top-down ${
                        scrolled ? 'header-scrolled shadow' : 'bg-none'
                    } ${path !== '/' ? 'top-0' : ''}`}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            {/*For window width > 980*/}
                            <Box
                                display={{ xs: 'none', md: 'flex' }}
                                alignItems="center"
                                flexGrow="1"
                            >
                                {!showSearch ? (
                                    <Link to="/" className="logo">
                                        <Logo type="logo" width="203" />
                                    </Link>
                                ) : (
                                    <Box display="flex" alignItems="center">
                                        <Link to="" className="logo">
                                            <Logo type="logoIcon" width="53" />
                                        </Link>
                                        <StartCollectingSearch />
                                    </Box>
                                )}
                            </Box>
                            {/*For window width (600-980) */}
                            <Box
                                display={{ xs: 'none', sm: 'flex', md: 'none' }}
                                alignItems="center"
                                flexGrow="1"
                            >
                                <Link to="/" className="logo">
                                    <Logo type="logo" width="160" />
                                </Link>
                            </Box>

                            <ul className="menu">
                                {path === '/' ? (
                                    <li className="menu-link menu-link-about font-primary">
                                        <button onClick={onScrollToAbout}>About Us</button>
                                    </li>
                                ) : (
                                    ''
                                )}
                                {canCreate && (
                                    <li className="menu-link font-primary">
                                        <Link to="/upload-asset">
                                            <button>Create</button>
                                        </Link>
                                    </li>
                                )}

                                <li className="menu-link font-primary">
                                    <Link to="/marketplace">
                                        <button>Marketplace</button>
                                    </Link>
                                </li>
                                <>
                                    {!selectedWallet && !connectLoading && (
                                        <li className="menu-btn menu-btn-wallet">
                                            <button onClick={onConnectWallet} className="btn-green">
                                                Connect Wallet
                                            </button>
                                        </li>
                                    )}
                                    {isLoggedIn && (
                                        <>
                                            <li
                                                className="menu-link font-primary"
                                                onClick={openProfileMenu}
                                            >
                                                <Avatar alt={user?.first_name} src={user?.avatar} />
                                            </li>
                                            <ProfileMenu
                                                anchorEl={profileMenuEl}
                                                closeMenu={closeProfileMenu}
                                                setNotifications={setNotifications}
                                            />
                                            <li className="menu-notif">
                                                <button
                                                    className={`notif-btn hover-opacity ${
                                                        unreadedNotifications && unReadedNotifyCount
                                                            ? 'unread'
                                                            : ''
                                                    }`}
                                                    ref={notifyRef}
                                                    onClick={openUserNotifications}
                                                >
                                                    <i
                                                        className="icon-notifications-outline"
                                                        style={{ fontSize: 24 }}
                                                    />
                                                </button>
                                            </li>
                                        </>
                                    )}
                                    {selectedWallet && !connectLoading && (
                                        <li
                                            className="menu-btn menu-btn-algo"
                                            onClick={onOpenChangeWallet}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={algorandLogo} alt="Algorand" />
                                        </li>
                                    )}
                                    {connectLoading && (
                                        <li
                                            style={{ width: '100px' }}
                                            className="menu-btn menu-btn-algo"
                                        >
                                            <LottieContainer
                                                containerStyles={{
                                                    height: '46px',
                                                    width: '100%',
                                                }}
                                                lottieStyles={{ width: '50px' }}
                                            />
                                        </li>
                                    )}
                                </>
                                {!isLoggedIn && (
                                    <li className="menu-btn">
                                        <button onClick={onOpenLoginDialog} className="btn-green">
                                            Sign In
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <IconButton onClick={switchLightMode}>
                                        {isDarkMode ? (
                                            <Brightness2 className="icon-btn-yellow" />
                                        ) : (
                                            <WbSunny className="icon-btn-green" />
                                        )}
                                    </IconButton>
                                </li>
                            </ul>
                        </Toolbar>
                    </Container>
                </AppBar>
            )}
        </>
    );
};

Header.propTypes = {
    hasSearch: PropTypes.bool,
};
export default Header;
