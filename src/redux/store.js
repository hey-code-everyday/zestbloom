import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { initApp } from './initApp';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

initApp(store);

export default store;
