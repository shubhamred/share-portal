import registry from 'app-registry';
import axios from 'axios';
import { replace as replaceRouter } from 'react-router-redux';
import { getTokenSilently } from '../react-auth0-spa';
import { store } from '../store';

const isAuthTokenValid = (authToken) => (authToken !== null && authToken !== '');

export default async function apiCall(payload, apiVersion = 'v1') {
  const {
    API_CALL,
    TYPES,
    data,
    params,
    url,
    // isMock = false,
    isErrorRequired = true,
    isAuthRequired = true,
    isLoaderRequired = false
  } = payload;
  // Reading API configs from config/env
  const { apiEndpoint } = registry.get('config');
  const API_URL = `${apiEndpoint}/${apiVersion}${url}`;

  // Reading auth-token from cookie
  const authToken = isAuthRequired && await getTokenSilently();

  // Re-routing to login if not authorized
  if (isAuthRequired && !isAuthTokenValid(authToken)) {
    store.dispatch(replaceRouter('/'));
    return null;
  }

  // if (isMock) {
  //   const mockData = require(`./data${url}.json`);
  //   // API call success
  //   store.dispatch({ type: TYPES.successType, data: mockData });
  //   return mockData;
  // }

  // Setting API parameters
  const apiParams = {
    ...API_CALL,
    data,
    params,
    url: API_URL,
    ...(isAuthRequired && {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
  };
  try {
    if (API_CALL.method === 'PUT' || API_CALL.method === 'POST' || isLoaderRequired) {
      store.dispatch({ type: 'SHOW_LOADER' });
    }
    //  Setting initial state
    if (TYPES && TYPES.requestType) {
      store.dispatch({ type: TYPES.requestType });
    }
    // Make API call
    const apiResponse = await axios(apiParams);
    if (apiResponse.data) {
      // API call success
      if (TYPES && TYPES.successType) {
        store.dispatch({
          type: TYPES.successType,
          data: apiResponse.data
        });
      }
      if (API_CALL.method === 'PUT' || API_CALL.method === 'POST' || isLoaderRequired) {
        store.dispatch({ type: 'HIDE_LOADER' });
      }
      return apiResponse.data;
    }
  } catch (err) {
    if (API_CALL.method === 'PUT' || API_CALL.method === 'POST' || isLoaderRequired) {
      store.dispatch({ type: 'HIDE_LOADER' });
    }
    // API call failure
    let errMessage = err.message || 'Error';
    if (err.response) {
      errMessage = err.response.data.message || (err.response.data.error && err.response.data.error.message) || 'Error';
    }

    // handle data not found response
    if (err.response.data.statusCode === 404 || err.response.status === 404) {
      if (TYPES && TYPES.failureType) {
        store.dispatch({
          type: TYPES.failureType,
          error: errMessage
        });
      }
      return err.response && err.response.data;
    }

    // handle other response errors
    if (isErrorRequired && err.response.data.statusCode !== 409) {
      store.dispatch({
        type: 'show',
        payload: errMessage,
        msgType: 'error'
      });
    }

    // handle duplicate data conflict errors.
    if (err.response.data.statusCode === 409) {
      store.dispatch({
        type: 'show',
        payload: 'Duplicate: Already exists',
        msgType: 'error'
      });
    }

    // Logging the error
    registry.get('logger')
      .info(`The API ${API_URL} returned this error:`, JSON.stringify(errMessage));
    if (TYPES && TYPES.failureType) {
      store.dispatch({
        type: TYPES.failureType,
        error: errMessage
      });
    }
    // eslint-disable-next-line no-unused-expressions,max-len
    err.response
    && err.response.status === 401
      ? (window.location.href = '/')
      : null;
    return err.response && err.response.data;
  }

  return null;
}
