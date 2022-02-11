// eslint-disable-next-line no-unused-vars
import { createLogger } from 'redux-logger';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createHashHistory as createHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import reducers from './reducers';

const reducer = combineReducers({ ...reducers, routing: routerReducer });

const rootReducer = (defaultState, action) => {
  let state = defaultState;
  if (action.type === 'ACTION_TO_CLEAR_GLOBAL_STATE') {
    // Replace the action which clears the global state, eg: Logout
    state = undefined;
  }
  return reducer(state, action);
};

export const history = createHistory({ queryKey: false });

const middlewares = [];

const composeEnhancers = typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  }) : compose;

/* eslint-disable no-undef */
// if ((typeof (ENV) !== 'undefined') && ENV.logDispatcher) {
//   middlewares.push(createLogger({ collapsed: true }));
// }
/* eslint-enable no-undef */

middlewares.push(routerMiddleware(history));

export const store = composeEnhancers(applyMiddleware(...middlewares))(createStore)(rootReducer);

export default 'store';
