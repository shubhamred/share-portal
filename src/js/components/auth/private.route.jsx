import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import AuthErrorPage from '../errorPage/auth.error.page';
import logger from '../../services/logger';

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect, errorMessage, loading } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      logger.info(`errorMessage:${errorMessage}`);
      if (!errorMessage && !isAuthenticated && !loading) {
        await loginWithRedirect({
          appState: { targetUrl: path }
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path, errorMessage]);

  // don't show anything if niether authenticated nor error message is available.
  if (!errorMessage && !isAuthenticated) {
    return null;
  }
  const errorPage = <AuthErrorPage message={errorMessage} />;
  // eslint-disable-next-line react/no-multi-comp, react/jsx-props-no-spreading
  const render = (props) => (isAuthenticated === true ? <Component {...props} /> : errorPage);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default PrivateRoute;
