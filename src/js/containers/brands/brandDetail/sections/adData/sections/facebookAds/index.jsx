import React from 'react';
import Grid from '@material-ui/core/Grid';
import styles from '../styles.scss';

const FacebookAds = (props) => {
  const { integrationData, type } = props.item || {};
  return (
    <div>
      {integrationData ? integrationData.adData.map((item) => {
        const { id, account_status: accountStatus, amount_spent: amountSpent,
          id: adAccountId } = item;
        return (
          <div>
            <p className={styles.subHeading}>
              Ad Data Id:
              {adAccountId}
            </p>
            <Grid container={true} xs={12} direction="row" alignItems="center">
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Ad Account Name * </p>
                  <p className={styles.subHeading}>
                    {`${type} `}
                    Ads
                  </p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Account ID </p>
                  <p className={styles.subHeading}>{id}</p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Account Status</p>
                  <p className={styles.subHeading}>{accountStatus === 2 ? 'Active' : 'Inactive'}</p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Account Age</p>
                  <p className={styles.subHeading}>-</p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Amount Spent </p>
                  <p className={styles.subHeading}>
                    {item.currency}
                    {' '}
                    {amountSpent}
                  </p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>End advertiser name</p>
                  <p className={styles.subHeading}>-</p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Media agency </p>
                  <p className={styles.subHeading}>-</p>
                </div>
              </Grid>
              <Grid item={true} xs={3}>
                <div>
                  <p className={styles.heading}>Campaigns </p>
                  <p className={styles.subHeading}>-</p>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      }) : <div>No data</div>}
    </div>);
};
export default FacebookAds;
