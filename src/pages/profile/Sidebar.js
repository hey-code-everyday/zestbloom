import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Card, Typography, Avatar, Button, List, ListItem, Divider } from '@material-ui/core';
import { SettingsOutlined, WarningRounded } from '@material-ui/icons';
import { Tag } from 'components/shared';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unFollowUser } from '../../redux/profile/actions';
import SocialIcons from './SocialIcons';
import { changeImage } from 'redux/profile-settings/actions';
import { changeUserAvatar } from 'redux/auth/actions';
import { ANONYMOUS } from 'configs';
import PropTypes from 'prop-types';

const Sidebar = ({ username, user }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);
    const [staticTag, setStaticTag] = useState(null);
    const [customTag, setCustomTag] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const { user: authUser } = useSelector((state) => state.auth);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const isAuthUser = authUser?.username === username;
    useEffect(() => {
        const stTag = user?.selected_tags?.find((tag) => tag.type === 'static');
        setStaticTag(stTag);
        const custTag = user?.selected_tags?.find((tag) => tag.type === 'custom');
        setCustomTag(custTag);
    }, [user]);

    const showFollowers = () => {
        if (isAuthUser) {
            history.push(`/profile/${user.username}/followers`);
        }
    };
    const showFollowing = () => {
        if (isAuthUser) {
            history.push(`/profile/${user.username}/following`);
        }
    };

    const showSales = () => {
        if (isAuthUser) {
            history.push(`/profile/${user.username}/sales`);
        }
    };

    const handleFollow = () => {
        setIsLoading(true);
        if (user?.follow) {
            dispatch(unFollowUser(username)).then(() => setIsLoading(false));
        } else {
            dispatch(followUser(username)).then(() => setIsLoading(false));
        }
    };

    const openInputFile = () => {
        if (canUpladPhoto) {
            document.getElementById('selectImage').click();
        }
    };
    const handlePictureSelected = (event) => {
        const params = {
            avatar: event.target.files[0],
            username: user?.username,
        };
        dispatch(changeImage(params))
            .then((response) => {
                setAvatar(response.avatar);
                dispatch(changeUserAvatar(response.avatar));
            })
            .catch(() => {});
    };

    const reloadPage = () => window.location.reload();

    const showSettings = isLoggedIn && isAuthUser && authUser?.role !== ANONYMOUS;
    const canUpladPhoto = showSettings;
    const showFollowBtn = isLoggedIn && !isAuthUser;

    useEffect(() => {
        document
            .querySelector('meta[name="description"]')
            .setAttribute('content', user?.first_name + ' ' + user?.last_name);
        document
            .querySelector('meta[name="description"]')
            .setAttribute('value', user?.first_name + ' ' + user?.last_name);
        document.querySelector('meta[name="url"]').setAttribute('content', window.location.href);
        document.querySelector('meta[name="url"]').setAttribute('value', window.location.href);
        document
            .querySelector('meta[name="image"]')
            .setAttribute('content', avatar ?? user?.avatar);
        document.querySelector('meta[name="image"]').setAttribute('value', avatar ?? user?.avatar);
        document
            .querySelector('meta[name="twitter:card"]')
            .setAttribute('content', 'summary_large_image');
        document
            .querySelector('meta[name="twitter:card"]')
            .setAttribute('value', 'summary_large_image');
        document
            .querySelector('meta[name="twitter:url"]')
            .setAttribute('content', window.location.href);
        document
            .querySelector('meta[name="twitter:url"]')
            .setAttribute('value', window.location.href);
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', username);
        document.querySelector('meta[name="twitter:title"]').setAttribute('value', username);
        document
            .querySelector('meta[name="twitter:description"]')
            .setAttribute('content', user?.first_name + ' ' + user?.last_name);
        document
            .querySelector('meta[name="twitter:description"]')
            .setAttribute('value', user?.first_name + ' ' + user?.last_name);

        document
            .querySelector('meta[name="twitter:image"]')
            .setAttribute('content', avatar ?? user?.avatar);
        document
            .querySelector('meta[name="twitter:image"]')
            .setAttribute('value', avatar ?? user?.avatar);
        // document.querySelector('meta[property="og:type"]').setAttribute('content', 'website');
        // document
        //     .querySelector('meta[property="og:url"]')
        //     .setAttribute('content', window.location.href);
        // document
        //     .querySelector('meta[name="og:description"]')
        //     .setAttribute('content', user?.first_name + ' ' + user?.last_name);
    }, [user, username, avatar]);

    return (
        <div className="profile-sidebar">
            <Card variant="outlined">
                <Box
                    pt={4.5}
                    pb={3.5}
                    px={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box
                        mb={3}
                        onClick={openInputFile}
                        className={canUpladPhoto ? 'avatar-container' : ''}
                    >
                        <Avatar
                            alt={user?.first_name}
                            src={avatar ?? user?.avatar}
                            className="xxl"
                        />
                        {canUpladPhoto && (
                            <Box
                                fontSize={20}
                                color="text.white"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                                className="avatar-upload-icon"
                            >
                                <i className="icon-file-upload" style={{ fontSize: 48 }} />
                            </Box>
                        )}
                    </Box>
                    {canUpladPhoto && (
                        <Box mt={2}>
                            <input
                                id="selectImage"
                                hidden
                                type="file"
                                onChange={handlePictureSelected.bind(this)}
                            />
                        </Box>
                    )}

                    <Box className="profile-sidebar-tags">
                        {staticTag && (
                            <Tag text={staticTag.name} className="secondary sm relative" />
                        )}
                        {customTag && (
                            <Tag text={customTag.name} className="secondary sm relative" />
                        )}
                    </Box>

                    <Box mt={2.5} mb={1}>
                        <Typography variant="h4">
                            {user?.first_name} {user?.last_name}
                        </Typography>
                    </Box>

                    <Box
                        fontSize={16}
                        lineHeight="20px"
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary ellipsis"
                        component={Link}
                        onClick={() => reloadPage()}
                        to={`/profile/${user?.username}`}
                    >
                        @{user?.username}
                    </Box>

                    {user?.bio ? (
                        <Box mt={2.5} mb={3.5} textAlign="center">
                            {user?.bio}
                        </Box>
                    ) : null}
                    <SocialIcons user={user} />
                    {/* {!username && !isAuthUser && (
                        <Button
                            variant="outlined"
                            color="secondary" // primary when active
                            fullWidth
                            className="justify-between"
                            component={Link}
                            to="/"
                            endIcon={<ChevronRight style={{ fontSize: 32, margin: '2px 0' }} />}
                        >
                            Activity
                        </Button>
                    )} */}
                </Box>
                <List className="sidebar-menu" disablePadding>
                    <ListItem>
                        <button onClick={showFollowers}>
                            <p>Followers:</p>
                            <span>{user?.followers_count}</span>
                        </button>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <button onClick={showFollowing}>
                            <p>Following:</p>
                            <span>{user?.following_count}</span>
                        </button>
                    </ListItem>
                    {user?.sale_amount_visibility && (
                        <ListItem>
                            <button onClick={showSales}>
                                <p>Sales:</p>
                                <span>{(user?.sale_amount ?? 0) / 1000000}</span>
                            </button>
                        </ListItem>
                    )}
                    <Divider />
                    {showFollowBtn && (
                        <Box mx={3.5} mt={5} mb={8}>
                            <Button
                                variant={user?.follow ? 'outlined' : 'contained'}
                                color={user?.follow ? 'secondary' : 'primary'}
                                className="sidebar-menu-follow"
                                size="large"
                                fullWidth
                                onClick={handleFollow}
                                disabled={isLoading}
                            >
                                {user?.follow ? 'Unfollow' : 'Follow'}
                            </Button>
                        </Box>
                    )}
                    {showSettings && (
                        <>
                            <ListItem>
                                <Link to="/profile/settings" className="settings-link">
                                    <p>
                                        <SettingsOutlined style={{ fontSize: 24 }} />
                                        <span>Settings</span>
                                    </p>
                                    {/* warning btn  */}
                                    {authUser?.settings_warning && (
                                        <Box color="error.light" className="settings-warning">
                                            <WarningRounded style={{ fontSize: 24 }} />
                                        </Box>
                                    )}
                                </Link>
                            </ListItem>
                            <Divider />
                        </>
                    )}
                </List>

                {/* {!username ? isAuthUser && <SocialIcons user={user} /> : null} */}
            </Card>
        </div>
    );
};

Sidebar.propTypes = {
    username: PropTypes.string,
    user: PropTypes.object,
};

export default Sidebar;
