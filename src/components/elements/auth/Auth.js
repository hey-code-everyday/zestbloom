import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, loginRefresh, logoutFromLocalStorage } from 'redux/auth/actions';
import { API_CONFIG } from '../../../configs';

axios.defaults.headers.Accept = 'application/json';
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const Auth = () => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    const handleAuth = useCallback(() => {
        let isAlreadyFetchingAccessToken = false;
        let subscribers = [];

        function onAccessTokenFetched(accessToken) {
            subscribers = subscribers.filter((callback) => callback(accessToken));
        }

        function addSubscriber(callback) {
            subscribers.push(callback);
        }

        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        const getRefreshToken = (refreshToken) => {
            isAlreadyFetchingAccessToken = true;
            if (validateToken(refreshToken)) {
                return dispatch(loginRefresh(refreshToken)).then((response) => {
                    isAlreadyFetchingAccessToken = false;
                    const accessToken = response?.access;
                    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                    onAccessTokenFetched(accessToken);
                    subscribers = [];
                });
            } else {
                return dispatch(logoutFromLocalStorage());
            }
        };

        if (validateToken(accessToken)) {
            // axios.defaults.baseURL = 'https://api.example.com';
            axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            dispatch(getUser('me'));
        } else {
            getRefreshToken(refreshToken);
        }

        // Set axios interceptors
        // Add a request interceptor
        axios.interceptors.request.use(
            (config) =>
                // Do something before request is sent
                config,
            (error) =>
                // Do something with request error
                Promise.reject(error),
        );

        // Add a response interceptor
        axios.interceptors.response.use(
            (response) =>
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                response,
            (error) => {
                const originalRequest = error.config;
                const refreshToken = localStorage.getItem('refresh');
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                if (
                    error.response.status === 401 &&
                    originalRequest.url === API_CONFIG.loginRefresh
                ) {
                    dispatch(logoutFromLocalStorage());
                    return Promise.reject(error);
                }

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    if (!isAlreadyFetchingAccessToken)
                        getRefreshToken(refreshToken, originalRequest);

                    const retryOriginalRequest = new Promise((resolve) => {
                        addSubscriber((accessToken) => {
                            originalRequest.headers.Authorization = 'Bearer ' + accessToken;
                            resolve(axios(originalRequest));
                        });
                    });
                    return retryOriginalRequest;
                }
                return Promise.reject(error);
            },
        );
    }, [dispatch]);

    useEffect(() => {
        handleAuth();
    }, [handleAuth, isLoggedIn]);

    function validateToken(token) {
        if (!token) {
            return false;
        }

        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return false;
        }

        return true;
    }

    return null;
};

export default Auth;
