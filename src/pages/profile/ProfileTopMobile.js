import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Sidebar from './Sidebar';
import { Avatar, Box, Button, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Tag } from '../../components/shared';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    list: {
        width: 300,
    },
    fullList: {
        width: 'auto',
    },
});

const ProfileTopMobile = (props) => {
    const { username, user } = props;
    const history = useHistory();
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
    });
    const toggleDrawer = (event, anchor, open) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
        >
            <div className="profile-mobile-menu">
                <button
                    className="mobile-menu-close"
                    onClick={(e) => toggleDrawer(e, anchor, false)}
                >
                    <CloseIcon />
                </button>
                <Sidebar username={username} user={user} />
            </div>
        </div>
    );

    return (
        <div className="profile-top-mobile">
            <React.Fragment>
                <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <button
                        className="hover-opacity text-left"
                        onClick={(e) => toggleDrawer(e, 'left', true)}
                    >
                        <Box mb={1}>
                            <Avatar alt="Avatar" src={user?.avatar} className="lg" />
                        </Box>

                        <Box className="profile-top-mobile-tags">
                            {user?.selected_tags?.find((tag) => tag.type === 'static') && (
                                <Tag
                                    text={
                                        user?.selected_tags?.find((tag) => tag.type === 'static')
                                            ?.name
                                    }
                                    className="secondary sm relative"
                                />
                            )}
                            {user?.selected_tags?.find((tag) => tag.type === 'custom') && (
                                <Tag
                                    text={
                                        user?.selected_tags?.find((tag) => tag.type === 'custom')
                                            ?.name
                                    }
                                    className="secondary sm relative"
                                />
                            )}
                        </Box>

                        <Box
                            mt={1.5}
                            mb={0.5}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography
                                className="user-fullname"
                                variant="h4"
                                style={{
                                    fontSize: '1.25rem',
                                    lineHeight: '1.5rem',
                                    marginRight: 8,
                                }}
                            >
                                {user?.first_name} {user?.last_name}
                            </Typography>
                            <i
                                className="icon-information-outline"
                                style={{ fontSize: 16, color: '#485afd' }}
                            />
                        </Box>

                        {/* <Box
                            fontSize={16}
                            lineHeight="20px"
                            fontWeight="bold"
                            fontFamily="h1.fontFamily"
                            className="link primary ellipsis"
                            component={Link}
                            to="/"
                        >
                            {user?.username}
                        </Box> */}
                    </button>
                    {history.location.pathname === '/profile' ||
                        (history.location.pathname === '/profile/' && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                component={Link}
                                to="/auction"
                            >
                                Auction
                            </Button>
                        ))}
                </Box>
                <Drawer
                    anchor="left"
                    open={state['left']}
                    onClose={(e) => toggleDrawer(e, 'left', false)}
                    onOpen={(e) => toggleDrawer(e, 'left', true)}
                >
                    {list('left')}
                </Drawer>
            </React.Fragment>
        </div>
    );
};

ProfileTopMobile.propTypes = {
    username: PropTypes.string,
    user: PropTypes.object,
};

export default ProfileTopMobile;
