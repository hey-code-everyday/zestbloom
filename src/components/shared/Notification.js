import React, { useCallback, useEffect } from 'react';
import { Box, SvgIcon, Typography, Link as LinkComponent } from '@material-ui/core';
import {
    CheckCircleOutline,
    ErrorOutlined,
    InfoOutlined,
    Warning,
    Close,
} from '@material-ui/icons';
import { deleteNotification } from 'redux/profile/actions';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

const NOTIF_TYPES = {
    success: CheckCircleOutline,
    error: ErrorOutlined,
    info: InfoOutlined,
    warning: Warning,
};

const Notification = ({ type, title, message, guid }) => {
    const dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(deleteNotification(guid));
    }, [guid, dispatch]);

    useEffect(() => {
        let closeNotification = true;
        setTimeout(() => {
            if (closeNotification) {
                onClose();
            }
        }, 10000);
        return () => {
            closeNotification = false;
        };
    }, [onClose]);

    if (!message) return null;

    const notif = NOTIF_TYPES[type];
    return (
        <Box className={`notification ${type}`} display="flex">
            <Box className="notif-icon">
                <SvgIcon component={notif} style={{ fontSize: 24 }} />
            </Box>
            <Box pl={2}>
                <Typography component="strong" className="notif-title">
                    {title}
                </Typography>
                <Typography variant="body1" component="p" className="notif-message">
                    {message}
                </Typography>
            </Box>
            <LinkComponent className="notif-close" color="secondary" onClick={onClose}>
                <Close style={{ fontSize: 15 }} />
            </LinkComponent>
        </Box>
    );
};

Notification.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    guid: PropTypes.string,
};

export default Notification;
