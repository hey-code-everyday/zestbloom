import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Menu, MenuItem, Divider, Avatar, Box } from '@material-ui/core';
import { SettingsOutlined } from '@material-ui/icons';
import { logout } from 'redux/auth/actions';
import { toClearWallet } from 'redux/profile/actions';
import { clearNotifications } from 'redux/notifications/actions';
import { ANONYMOUS } from 'configs';
import PropTypes from 'prop-types';

const ProfileMenu = ({ anchorEl, closeMenu, setNotifications }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const history = useHistory();

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refresh');
        dispatch(logout(refreshToken)).then((response) => {
            dispatch(clearNotifications());
            setNotifications(false);
            history.push('/');
            dispatch(toClearWallet());
        });
        closeMenu();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            className="profile-dropdown"
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
            <MenuItem style={{ backgroundColor: 'transparent' }}>
                <Box fontSize={16} display="flex" alignItems="center" width="100%">
                    <Avatar alt={user?.first_name} src={user?.avatar} className="md" />
                    <Box ml={2} width="calc(100% - 60px)">
                        <Box fontWeight="bold">
                            {user?.first_name} {user?.last_name}
                        </Box>
                        <Box
                            fontWeight="bold"
                            fontFamily="h1.fontFamily"
                            color="primary.main"
                            className="ellipsis"
                        >
                            @{user?.username}
                        </Box>
                    </Box>
                </Box>
            </MenuItem>
            <Divider />
            <MenuItem disableGutters>
                <Link to={`/profile/${user?.username}`} onClick={closeMenu}>
                    <i className="icon-user" style={{ fontSize: 24 }} />
                    <span>My Profile</span>
                </Link>
            </MenuItem>
            {user?.role !== ANONYMOUS && (
                <MenuItem disableGutters>
                    <Link to="/profile/settings" onClick={closeMenu}>
                        <SettingsOutlined style={{ fontSize: 24 }} />
                        <span>Profile Settings</span>
                    </Link>
                </MenuItem>
            )}
            <Divider />
            <MenuItem disableGutters onClick={handleLogout} className="logout">
                <i className="icon-logout" style={{ fontSize: 24 }} />
                <span>Log Out</span>
            </MenuItem>
        </Menu>
    );
};
ProfileMenu.propTypes = {
    anchorEl: PropTypes.object,
    closeMenu: PropTypes.func,
    setNotifications: PropTypes.func,
};

export default ProfileMenu;
