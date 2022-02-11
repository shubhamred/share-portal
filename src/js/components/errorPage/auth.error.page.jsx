import React from 'react';
import PropTypes from 'prop-types';
import { Grid, AppBar, Toolbar, Typography } from '@material-ui/core';
import { useAuth0 } from 'app/react-auth0-spa';
import styles from './auth.error.page.scss';

export default function AuthErrorPage(props) {
  const { logout } = useAuth0() || {};
  return (
    <>
      <div className={styles.grow}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar>
            <Grid container={true}>
              <Grid style={{ width: '72px', padding: '8px', paddingLeft: '0px' }}>
                <img alt="Klub" src="/assets/klub-logo-white.svg" />
              </Grid>
              <Typography className={styles.title} variant="h5" noWrap={true}>
                Portal
              </Typography>
            </Grid>
            <Grid>
              <Grid
                className={styles.logout}
                onClick={() => { if (logout) logout({ returnTo: window.location.origin }); }}
              >
                Logout
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorCode}>401</h1>
        <p className={styles.errorMessage}>You are not authorized to access this page</p>
        <p className={styles.errorDescription}>
          <b>Details : </b>
          {props.message}
        </p>
      </div>
    </>
  );
}

AuthErrorPage.propTypes = {
  message: PropTypes.string.isRequired
};
