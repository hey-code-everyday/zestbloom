import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';
import ScrollToTop from 'helpers/ScrollToTop';
import './assets/styles/index.scss';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ScrollToTop />
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);

reportWebVitals();
