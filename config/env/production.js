'use strict';

const { API_HOST, DOMAIN, CLIENT_ID, AUDIENCE, ASSET_URL } = require('./env-config');

// eslint-disable-next-line no-unused-vars
const prodConfig = {
  apiEndpoint: API_HOST,
  apiVersion: 'v1',
  assetsUrl: ASSET_URL
};

module.exports = {
  webpack: {
    logDispatcher: true
  },
  clientConfig: {
    ...prodConfig
  },
  authConfig: {
    domain: DOMAIN,
    clientId: CLIENT_ID,
    audience: AUDIENCE
  }
};
