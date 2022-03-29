import { WS_REQUEST } from 'configs/wsConfig';

const isOpen = (ws) => {
    return ws?.readyState === ws?.OPEN;
};

const sendMessage = (socket, action, offset) => {
    const data = {
        action,
        request_id: new Date().getTime(),
    };

    if (offset) data.offset = offset;
    if (isOpen(socket)) {
        socket.send(JSON.stringify(data));
    }
};

const getAllNotifications = (socket) => sendMessage(socket, WS_REQUEST.get_notifications);

const readAllNotifications = (socket) => sendMessage(socket, WS_REQUEST.read_all);
const getUnreadedNotificationsCount = (socket) => sendMessage(socket, WS_REQUEST.get_unread_count);

const loadMoreNotifications = (socket, offset) =>
    sendMessage(socket, WS_REQUEST.get_notifications, offset);

const data = {
    getAllNotifications,
    readAllNotifications,
    loadMoreNotifications,
    getUnreadedNotificationsCount,
};

export default data;
