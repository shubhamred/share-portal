import React from 'react';
import { Grid } from '@material-ui/core';
import styles from '../../../companyApplications/components/applicationDetail/style.scss';

const RazerPay = (props) => {
  const { item } = props || {};
  // eslint-disable-next-line no-unused-vars
  const { integrationData } = item || {};
  return (
    <Grid container={true}>
      <Grid container={true}>
        <Grid item={true} xs={4}>
          <p className={styles.subHeader}>Account</p>
          <p className={styles.subHeaderValue}>{item.type || '-'}</p>
        </Grid>
        <Grid item={true} xs={4}>
          <p className={styles.subHeader}>Account Name</p>
          <p className={styles.subHeaderValue}>{item.accountName || '-'}</p>
        </Grid>
        <Grid item={true} xs={4}>
          <p className={styles.subHeader}>Account Number</p>
          <p className={styles.subHeaderValue}>{item.accountNumber || '-'}</p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RazerPay;
