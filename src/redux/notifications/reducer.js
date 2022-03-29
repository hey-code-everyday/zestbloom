import * as TYPES from './types.js';

const initialState = {
    allNotifications: [],
    notificationsCount: 0,
    allNotificationLoading: false,
    unReadedNotifyCount: 0,
    loadMoreNotificationsLoading: false,
    socket: null,
};

const notificationsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_ALL_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                allNotificationLoading: true,
            };
        case TYPES.GET_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                allNotifications: payload.data,
                notificationsCount: payload.count,
                allNotificationLoading: false,
            };
        case TYPES.GET_ALL_NOTIFICATIONS_FAIL:
            return {
                ...state,
                allNotificationLoading: true,
            };
        case TYPES.ADD_NOTIFICATION_SUCCESS:
            return {
                ...state,
                allNotifications: [payload.data, ...state.allNotifications],
                unReadedNotifyCount: state.unReadedNotifyCount + 1,
            };
        case TYPES.DELETE_ACTIVITY_SUCCESS: {
            let count = 0;

            payload?.data?.forEach((x) => {
                const isUnread = state.allNotifications.find((y) => y.guid === x.guid)?.is_unread;
                if (isUnread) count++;
            });

            return {
                ...state,
                allNotifications: state.allNotifications.filter(
                    (x) => !payload.data?.find((y) => y.guid === x.guid),
                ),
                unReadedNotifyCount: state.unReadedNotifyCount - count,
            };
        }
        case TYPES.READ_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                allNotifications: state.allNotifications.map((x) => ({ ...x, is_unread: false })),
                unReadedNotifyCount: 0,
            };
        case TYPES.GET_UNREADED_NOTIFICATION_COUNT_SUCCESS:
            return {
                ...state,
                unReadedNotifyCount: payload,
            };
        case TYPES.LOAD_MORE_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                loadMoreNotificationsLoading: true,
            };
        case TYPES.LOAD_MORE_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                allNotifications: [...state.allNotifications, ...payload.data],
                notificationsCount: payload.count,
                loadMoreNotificationsLoading: false,
            };
        case TYPES.LOAD_MORE_NOTIFICATIONS_FAIL:
            return {
                ...state,
                loadMoreNotificationsLoading: false,
            };
        case TYPES.CLEAR_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                allNotifications: [],
            };
        case TYPES.SET_SOCKET_SUCCESS:
            return {
                ...state,
                socket: payload.data,
            };
        case TYPES.ACTION_OFFER_NOTIFICATION:
            return {
                ...state,
                allNotifications: state.allNotifications.map((x) =>
                    x.guid === payload?.guid
                        ? {
                              ...x,
                              activity: {
                                  ...x?.activity,
                                  action_object: {
                                      ...x?.activity?.action_object,
                                      status: payload.status,
                                  },
                              },
                          }
                        : x,
                ),
            };
        default:
            return state;
    }
};

export default notificationsReducer;
