import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import PropTypes from 'prop-types';
import { store } from './store';
import logger from './services/logger';

const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

let gClient;
export const getTokenSilently = async (...p) => {
  store.dispatch({ type: 'SHOW_LOADER' });
  const token = await gClient.getTokenSilently(...p);
  store.dispatch({ type: 'HIDE_LOADER' });
  return token;
};

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const auth0FromHook = await createAuth0Client(initOptions);
      gClient = auth0FromHook;
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const {
          appState
        } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      } else if (window.location.search.includes('error')) {
        setErrorMessage(searchParams.get('error_description'));
      }

      const authenticatedStatus = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(authenticatedStatus);

      if (authenticatedStatus) {
        const loginUser = await auth0FromHook.getUser();
        setUser(loginUser);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
    }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      logger.error(error);
    } finally {
      setPopupOpen(false);
    }
    const loginUser = await auth0Client.getUser();
    setUser(loginUser);
    setIsAuthenticated(true);
    setErrorMessage(null);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const loginUser = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setErrorMessage(null);
    setUser(loginUser);
  };
  return (
    <Auth0Context.Provider value={
        {
          isAuthenticated,
          errorMessage,
          user,
          loading,
          popupOpen,
          loginWithPopup,
          handleRedirectCallback,
          getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
          loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
          getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
          logout: (...p) => auth0Client.logout(...p)
        }
    }
    >
      { children }
    </Auth0Context.Provider>
  );
};

Auth0Provider.propTypes = {
  children: PropTypes.shape({}).isRequired,
  onRedirectCallback: PropTypes.func.isRequired
};
