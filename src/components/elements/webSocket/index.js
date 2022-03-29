import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessage } from 'redux/notifications/actions';
import {
    getAllNotifications,
    getWsAddress,
    setSocket,
    getUnreadedNotificationsCount,
} from 'redux/notifications/actions';
import PropTypes from 'prop-types';

const WebSocketContainer = ({ isLoggedIn }) => {
    const dispatch = useDispatch();
    const { socket } = useSelector((state) => state.notifications);
    const access = localStorage.getItem('access');
    useEffect(() => {
        if (isLoggedIn && socket) {
            dispatch(getAllNotifications(socket));
        }
    }, [dispatch, isLoggedIn, socket]);

    useEffect(() => {
        try {
            if (isLoggedIn) {
                let webSocket;
                let count = 0;
                let status;
                const wsAddress = getWsAddress();

                function cleanUp(webSocket) {
                    webSocket?.removeEventListener('close', onClose);
                    webSocket?.removeEventListener('open', onOpen);
                    webSocket?.removeEventListener('message', onMessage);
                    webSocket?.removeEventListener('error', onError);
                }

                function addListeners(webSocket) {
                    webSocket?.addEventListener('close', onClose);
                    webSocket?.addEventListener('open', onOpen);
                    webSocket?.addEventListener('message', onMessage);
                    webSocket?.addEventListener('error', onError);
                }

                function connectWS() {
                    cleanUp(webSocket);

                    webSocket?.close();
                    webSocket = new WebSocket(`${wsAddress}?token=${access}`);
                    addListeners(webSocket);
                }

                connectWS();

                function onOpen(e) {
                    count = 0;
                    console.log('Conection opened.. ');
                    dispatch(setSocket(webSocket));
                    dispatch(getUnreadedNotificationsCount(webSocket));
                }

                function onMessage(e) {
                    status = JSON.parse(e.data)?.status;
                    const data = JSON.parse(e.data);
                    dispatch(getMessage(data));
                }

                function onClose(e) {
                    count++;
                    console.log('Conection closed');
                    if (status === 403 || status === 401) return;
                    if (count < 15) setTimeout(() => connectWS(), 3000);
                }

                function onError(e) {
                    console.log(e);
                }

                return () => {
                    webSocket?.removeEventListener('open', onOpen);
                    webSocket?.removeEventListener('message', onMessage);
                    webSocket?.removeEventListener('close', onClose);
                    webSocket?.removeEventListener('error', onError);

                    webSocket?.close();
                };
            }
        } catch (err) {
            console.log(err);
        }
    }, [isLoggedIn, access, dispatch]);
    return null;
};

WebSocketContainer.propTypes = {
    isLoggedIn: PropTypes.bool,
};

export default WebSocketContainer;
