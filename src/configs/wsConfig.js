const wsUrl = window.__RUNTIME_CONFIG__.REACT_APP_WS_URL;

export const WS_CONFIG = {
    getAllNotifications: `${wsUrl}/ws/activities/`,
};

export const WS_REQUEST = {
    get_notifications: 'list',
    read_all: 'mark_all_as_read',
    new_notification: 'new_notification',
    delete_notification: 'delete_notification',
    get_unread_count: 'get_unread_count',
};
