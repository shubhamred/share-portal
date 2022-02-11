import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import registry from 'app-registry';

import { store } from './store';
import routes from './routes';
import storage from './services/storage';
import logger from './services/logger';
import * as serviceWorker from './serviceWorker';
import ErrorBoundry from './errorBoundary';
import { Auth0Provider } from './react-auth0-spa';
import history from './utils/history';

import './rootStyles.scss';

registry.register('store', store);
registry.register('storage', storage);
registry.register('logger', logger);

const theme = createTheme({
  typography: {
    // fontFamily: [
    //   // 'Rubik',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif'
    // ].join(',')
  },
  overrides: {
    MuiInput: {
      root: {
        color: '#202124 !important',
        '&.Mui-disabled': {
          opacity: '0.4'
        }
      },
      underline: {
        '&:not(.Mui-disabled)::before': {
          borderColor: 'hsl(213deg 5% 39% / 32%)'
        }
      }
    },
    MuiButton: {
      root: {
        textTransform: 'capitalize'
      }
    }
  }
});

/* eslint-disable no-undef */
if (typeof appConfig !== 'undefined') {
  const config = appConfig || {};
  registry.register('config', config);
  if (config.logger && config.logger.level) {
    logger.setLevel(config.logger.level);
  }
} else {
  registry.get('logger').warning('WARNING: the config is not defined');
}

if (typeof authConfig !== 'undefined') {
  const authorizationConfiguration = authConfig || {};
  registry.register('authConfig', authorizationConfiguration);
} else {
  registry.get('logger').warning('WARNING: the auth config is not defined');
}
const authorizationConfig = registry.get('authConfig');
/* eslint-enable no-undef */
const onRedirectCallback = (appState) => {
  logger.info(
    'app.jsx onRedirectCallback appState:',
    JSON.stringify(appState, null, 4)
  );
  logger.info(
    'app.jsx onRedirectCallback window.location.origin:',
    window.location.origin
  );
  logger.info(
    `app.jsx onRedirectCallback:${
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    }`
  );

  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={authorizationConfig.domain}
    client_id={authorizationConfig.clientId}
    redirect_uri={window.location.origin}
    audience={authorizationConfig.audience}
    onRedirectCallback={onRedirectCallback}
    useRefreshTokens={true}
  >
    <ThemeProvider theme={theme}>
      <ErrorBoundry>
        <Provider store={store}>
          <Router history={history}>{routes}</Router>
        </Provider>
      </ErrorBoundry>
    </ThemeProvider>
  </Auth0Provider>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
