import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { CancelOutlined } from '@material-ui/icons';
import { loadMoreNotifications, setLoadingMoreValue } from 'redux/notifications/actions';
import Notificationitem from './types';
import { readAllNotifications } from 'redux/notifications/actions';
import LottieContainer from 'components/shared/LottieContainer';
import PropTypes from 'prop-types';

const UserNotifications = ({ notifications, setNotifications, onClose }) => {
    const dispatch = useDispatch();

    const { socket, allNotifications, loadMoreNotificationsLoading, notificationsCount } =
        useSelector((state) => state.notifications);
    const containerRef = useRef(null);

    const onScroll = useCallback(
        (e) => {
            const container = containerRef.current;
            const scrollHeight = container.scrollHeight;
            const scrolledHeight = container.clientHeight + container.scrollTop;
            const isBottom = scrollHeight === scrolledHeight;
            if (
                isBottom &&
                !loadMoreNotificationsLoading &&
                notificationsCount > allNotifications?.length &&
                socket
            ) {
                dispatch(setLoadingMoreValue());
                dispatch(loadMoreNotifications(socket, allNotifications?.length));
            }
        },
        [
            containerRef,
            dispatch,
            loadMoreNotificationsLoading,
            notificationsCount,
            allNotifications?.length,
            socket,
        ],
    );

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('scroll', onScroll);
        return () => {
            container.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    const unreadedNotifications = useMemo(() => {
        const unreaded = allNotifications?.find((x) => x.is_unread);
        return !!unreaded;
    }, [allNotifications]);

    useEffect(() => {
        return () => {
            if (notifications && unreadedNotifications && socket) {
                dispatch(readAllNotifications(socket));
            }
        };
    }, [notifications, unreadedNotifications, dispatch, socket]);

    return (
        <>
            {notifications && (
                <Box
                    className="user-notifications-close"
                    position="fixed"
                    top={100}
                    right={10}
                    zIndex={999}
                    onClick={onClose}
                >
                    <CancelOutlined fontSize="large" />
                </Box>
            )}
            <Box className={`user-notifications ${notifications ? 'open' : ''}`} ref={containerRef}>
                <Box component="ul" className="user-notifications-list">
                    {allNotifications.length !== 0 ? (
                        allNotifications?.map((x) => (
                            <Notificationitem
                                data={x}
                                key={x.guid}
                                setNotifications={setNotifications}
                            />
                        ))
                    ) : (
                        <Box className="no-notifications">No notifications</Box>
                    )}
                </Box>
                {loadMoreNotificationsLoading && (
                    <LottieContainer
                        containerStyles={{
                            height: '50px',
                            width: '153px',
                            margin: '10px auto',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                )}
            </Box>
        </>
    );
};

UserNotifications.propTypes = {
    notifications: PropTypes.bool,
    setNotifications: PropTypes.func,
    onClose: PropTypes.func,
};

export default UserNotifications;
