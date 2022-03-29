import * as TYPES from './types.js';
import NotificationService from './services';
import { WS_CONFIG, WS_REQUEST } from 'configs';

export const setSocket = (socket) => ({
    type: TYPES.SET_SOCKET_SUCCESS,
    payload: { data: socket },
});

export const actionOfferFromNotification = (guid, status) => ({
    type: TYPES.ACTION_OFFER_NOTIFICATION,
    payload: { guid, status },
});

export const setLoadingMoreValue = () => ({ type: TYPES.LOAD_MORE_NOTIFICATIONS_REQUEST });

export const getWsAddress = () => WS_CONFIG.getAllNotifications;

export const addNotification = (data) => ({
    type: TYPES.ADD_NOTIFICATION_SUCCESS,
    payload: { data },
});

export const clearNotifications = () => ({ type: TYPES.CLEAR_NOTIFICATIONS_SUCCESS });

const setNotifications = (response) => ({
    type: TYPES.GET_NOTIFICATIONS_SUCCESS,
    payload: {
        data: response?.results,
        count: response?.count,
    },
});

const setLoadMoreNotifications = (response) => ({
    type: TYPES.LOAD_MORE_NOTIFICATIONS_SUCCESS,
    payload: {
        data: response?.results,
        count: response?.count,
    },
});

const readNotifictions = () => ({
    type: TYPES.READ_NOTIFICATIONS_SUCCESS,
});

const setUnreadedNotifyCount = (payload) => ({
    type: TYPES.GET_UNREADED_NOTIFICATION_COUNT_SUCCESS,
    payload,
});

const deleteActivity = (data) => ({ type: TYPES.DELETE_ACTIVITY_SUCCESS, payload: { data } });

export const getAllNotifications = (socket) => (dispatch) => {
    return NotificationService.getAllNotifications(socket);
};

export const readAllNotifications = (socket) => (dispatch) => {
    return NotificationService.readAllNotifications(socket);
};

export const getUnreadedNotificationsCount = (socket) => (dispatch) => {
    return NotificationService.getUnreadedNotificationsCount(socket);
};

export const loadMoreNotifications = (socket, offset) => (dispatch) => {
    return NotificationService.loadMoreNotifications(socket, offset);
};

export const getMessage = (data) => {
    switch (data?.action) {
        case WS_REQUEST.get_notifications: {
            if (data?.response?.offset === 0) {
                return setNotifications(data?.response);
            }
            return setLoadMoreNotifications(data?.response);
        }
        case WS_REQUEST.new_notification:
            return addNotification(data.response);
        case WS_REQUEST.read_all:
            return readNotifictions();
        case WS_REQUEST.delete_notification:
            return deleteActivity(data.response);
        case WS_REQUEST.get_unread_count:
            return setUnreadedNotifyCount(data?.response?.count);
        default:
            return () => ({});
    }
};
