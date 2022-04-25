import React, { useState, useEffect, useCallback, useContext, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AppBar, Toolbar, Container, Box, Avatar, IconButton } from '@material-ui/core';
import { Close, Menu, WbSunny, Brightness2 } from '@material-ui/icons';

import {
    setMyAlgoAccount,
    setWallets,
    verifyWallets,
    setNonLoggedMyAlgoAccount,
    toClearWallet,
    setNotification,
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
    BecomeCreator,
    RequestSent,
} from 'components/elements';
import algorandLogo from 'assets/img/algorand-logo.svg';
import { AboutAnchorContext } from '../MainRoute';
import ChangeWallet from 'components/elements/modal/changeWallet';
import LottieContainer from 'components/shared/LottieContainer';
import UserNotifications from '../user-notifications';
import { connectToMyAlgo, nonLoggedConnect } from 'transactions/algorand/connectWallet';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { CREATOR, ANONYMOUS } from 'configs';

const Header = ({ hasSearch }) => {
    const history = useHistory();
    const path = history.location.pathname;
    const [becomeCreatorDialog, setBecomeCreatorDialog] = useState(false);
    const [requestSentDialog, setRequestSentDialog] = useState(false);
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

    const unreadedNotifications = useMemo(() => {
        const unreaded = allNotifications?.find((x) => x.is_unread);
        return !!unreaded; // TODO unread
    }, [allNotifications]);

    const notificationsToShow = useMemo(() => {
        return isMobile ? (notifications ?? []).slice(0, 1) : notifications;
    }, [isMobile, notifications]);

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
        const connectedWallets = JSON.parse(localStorage.getItem('wallets'));
        if (connectedWallets) {
            dispatch(setWallets(connectedWallets));
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

    const onScrollToAbout = () =>
        window.scrollTo({ top: anchorRef.current.offsetTop, behavior: 'smooth' });

    const setWalletsToUser = async (getAccounts, loggedIn = true) => {
        return loggedIn
            ? dispatch(setMyAlgoAccount(getAccounts))
            : dispatch(setNonLoggedMyAlgoAccount(getAccounts));
    };

    const onOpenSignupDialog = () => {
        setLoginDialog(false);
        setSignupDialog(true);
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

    const onOpenLoginDialog = () => {
        closeSideBars();
        if (isLoggedIn) {
            handleLogout();
            return;
        }
        setSignupDialog(false);
        setLoginDialog(true);
    };

    const onOpenForgotPasswordDialog = () => {
        setLoginDialog(false);
        setForgotPasswordDialog(true);
    };

    const closeSideBars = () => {
        setNotifications(false);
        setMobileMenuVisible(false);
    };

    const onClickProfile = async () => {
        closeSideBars();
        if (user?.username) {
            history.push(`/profile/${user.username}`);
        }
    };

    const onClickMarketplace = async () => {
        closeSideBars();
        history.push('/marketplace');
    };

    const onClickAuction = async () => {
        closeSideBars();
        history.push('/marketplace?status=auction');
    };
    const canCreate = user?.role === CREATOR && window.location.pathname !== '/upload-asset';

    const toVerifyWallets = (wallets) => {
        return dispatch(verifyWallets(wallets));
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const onConnectWallet = async () => {
        closeSideBars();
        isLoggedIn
            ? connectToMyAlgo(
                  setWalletsToUser,
                  setConnectLoading,
                  [],
                  toVerifyWallets,
                  giveNotification,
              )
            : nonLoggedConnect(setWalletsToUser);
    };

    const switchLightMode = () => dispatch(changeUiMode(!isDarkMode));

    return (
        <>
            {/*  modals start */}
            <BecomeCreator
                creatorDialog={becomeCreatorDialog}
                onCloseCreatorDialog={() => setBecomeCreatorDialog(false)}
                onOpenRequestSentDialog={() => {
                    setBecomeCreatorDialog(false);
                    setRequestSentDialog(true);
                }}
            />
            <RequestSent
                requestSentDialog={requestSentDialog}
                onCloseRequestSentDialog={() => setRequestSentDialog(false)}
            />
            <SignUp
                signupDialog={signupDialog}
                onCloseSignupDialog={() => setSignupDialog(false)}
                onOpenLoginDialog={onOpenLoginDialog}
                onOpenVerifyDialog={() => setVerifyDialog(true)}
            />
            <VerifyYourEmail
                verifyDialog={verifyDialog}
                onCloseVerifyDialog={() => setVerifyDialog(false)}
            />
            {loginDialog && (
                <Login
                    loginDialog={loginDialog}
                    onCloseLoginDialog={() => setLoginDialog(false)}
                    onOpenSignupDialog={onOpenSignupDialog}
                    onOpenForgotPasswordDialog={onOpenForgotPasswordDialog}
                />
            )}
            <VerifyForgotPasswordEmail
                verifyForgotPasswordDialog={verifyForgotPasswordDialog}
                onCloseVerifyForgotPasswordDialog={() => setVerifyForgotPasswordDialog(false)}
                emailFromForgotPassword={emailFromForgotPassword}
            />
            <ForgotPassword
                forgotPasswordDialog={forgotPasswordDialog}
                onCloseForgotPasswordDialog={() => setForgotPasswordDialog(false)}
                onOpenLoginDialog={onOpenLoginDialog}
                onOpenVerifyForgotPasswordDialog={() => setVerifyForgotPasswordDialog(true)}
                setEmailFromForgotPassword={setEmailFromForgotPassword}
            />
            {selectedWallet && (
                <ChangeWallet
                    changeWallet={changeWallet}
                    onCloseChangeWallet={() => setChangeWallet(false)}
                />
            )}
            {/*User Notifications*/}
            {isLoggedIn && (
                <UserNotifications
                    notifications={userNotifications}
                    setNotifications={setNotifications}
                    onClose={() => setNotifications(false)}
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
                            display="flex"
                            alignItems="center"
                            flexGrow="1"
                            className="desktop-only"
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
                        <Box alignItems="center" flexGrow="1" className="mobile-only">
                            <Link to="/" className="logo">
                                <Logo type="logo" width="160" />
                            </Link>
                        </Box>

                        <ul className="menu desktop-only">
                            {path === '/' ? (
                                <li className="menu-link menu-link-about font-primary">
                                    <button onClick={onScrollToAbout}>About Us</button>
                                </li>
                            ) : (
                                ''
                            )}
                            {canCreate && (
                                <li className="menu-btn">
                                    <Link to="/upload-asset">
                                        <button className="btn-green">Create</button>
                                    </Link>
                                </li>
                            )}
                            {user?.role && user?.role !== CREATOR && user?.role !== ANONYMOUS ? (
                                <li className="menu-btn">
                                    <button
                                        className="btn-green"
                                        onClick={() => setBecomeCreatorDialog(true)}
                                    >
                                        Become a Creator
                                    </button>
                                </li>
                            ) : null}

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
                                            onClick={(e) => setProfileMenuEl(e.currentTarget)}
                                        >
                                            <Avatar alt={user?.first_name} src={user?.avatar} />
                                        </li>
                                        <ProfileMenu
                                            anchorEl={profileMenuEl}
                                            closeMenu={() => setProfileMenuEl(null)}
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
                                                onClick={() => setNotifications(false)}
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
                                        onClick={() => setChangeWallet(true)}
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
                        <Box className="menu-container mobile-only">
                            <Box display="flex" alignItems="center">
                                <IconButton onClick={switchLightMode}>
                                    {isDarkMode ? (
                                        <Brightness2 className="icon-btn-yellow" />
                                    ) : (
                                        <WbSunny className="icon-btn-green" />
                                    )}
                                </IconButton>
                                {mobileMenuVisible ? (
                                    <Close
                                        onClick={() => setMobileMenuVisible(false)}
                                        className="menu-icon"
                                        fontSize="large"
                                    />
                                ) : (
                                    <Menu
                                        onClick={() => setMobileMenuVisible(true)}
                                        className="menu-icon"
                                        fontSize="large"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box
                className={`mobile-only mobile-header-menu-container ${
                    mobileMenuVisible ? 'mobile-menu-show' : 'mobile-menu-hide'
                }`}
            >
                <Box className="mobile-menu-item" onClick={() => onOpenLoginDialog(true)}>
                    {isLoggedIn ? <span>Log Out</span> : <span>Sign In</span>}
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
                            <span>{`${selectedWallet ? 'Change' : 'Connect'} Wallet`}</span>
                        </>
                    )}
                </Box>
                <Box
                    className={`mobile-menu-item ${isLoggedIn ? '' : 'disabled'}`}
                    onClick={onClickProfile}
                >
                    <span>Profile</span>
                </Box>
                <Box className="mobile-menu-item" onClick={onClickMarketplace}>
                    <span>Marketplace</span>
                </Box>
                <Box
                    className={`mobile-menu-item ${isLoggedIn ? '' : 'disabled'}`}
                    onClick={() => setNotifications(false)}
                >
                    <span>Notifications</span>
                </Box>
                <Box className="mobile-menu-item" onClick={onClickAuction}>
                    <span>Auction</span>
                </Box>
            </Box>
        </>
    );
};

Header.propTypes = {
    hasSearch: PropTypes.bool,
};

export default Header;
