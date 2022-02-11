import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { fetchBrandConfigInsights } from 'app/containers/brands/saga';
import styles from '../../styles.scss';

const BrandBanking = (props) => {
  const { company } = props;
  const [accounts, setAccounts] = useState([]);
  const [isaccounts, setIsAccounts] = useState(true);
  const [Insights, setInsights] = useState({
    totalSplitAmount: '₹ 0',
    activeAccounts: 0,
    inActiveAccounts: 0,
    totalPartners: 0,
    TodaySplitAmount: '₹ 0'
  });
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    fetchBrandConfigInsights(company?.company?.companyCode).then((res) => {
      if (res?.data) {
        setInsights({
          activeAccounts: res?.data?.accountData?.activeCount || 0,
          inActiveAccounts: res?.data?.accountData?.inActiveCount || 0,
          totalPartners: res?.data?.partnerData?.totalPartnerCount || 0,
          totalSplitAmount: `₹ ${numberWithCommas(res?.data?.overallPayoutData?.totalPayoutAmount || 0)}`,
          TodaySplitAmount: `₹ ${numberWithCommas(res?.data?.todayPayoutData?.totalPayoutAmount || 0)}`
        });

        const mData = res?.data?.accountData || {};
        const cashfree = [];
        const razorpay = [];
        const kotak = [];
        if (Object.keys(mData?.cashfree).length > 0) {
          Object.keys(mData?.cashfree).map((account) => {
            cashfree.push({
              split: mData.cashfree[account].split || 0,
              isActive: mData.cashfree[account].isActive,
              accountId: account,
              totalPayoutAmount: mData.cashfree[account]?.totalPayoutAmount || 0
            });
            return 0;
          });
        }
        if (Object.keys(mData?.razorpay).length > 0) {
          Object.keys(mData?.razorpay).map((account) => {
            razorpay.push({
              split: mData.razorpay[account].split || 0,
              isActive: mData.razorpay[account].isActive,
              accountId: account,
              totalPayoutAmount: mData.razorpay[account]?.totalPayoutAmount || 0
            });
            return 0;
          });
        }
        if (Object.keys(mData?.kotak).length > 0) {
          Object.keys(mData?.kotak).map((account) => {
            kotak.push({
              split: mData.kotak[account].split || 0,
              isActive: mData.kotak[account].isActive,
              accountId: account,
              totalPayoutAmount: mData.kotak[account]?.totalPayoutAmount || 0
            });
            return 0;
          });
        }

        setIsAccounts(razorpay.length > 0 || cashfree.length > 0 || kotak.length > 0);

        const payload = [
          {
            vendor: 'razorpay',
            accounts: razorpay
          },
          {
            vendor: 'cashfree',
            accounts: cashfree
          },
          {
            vendor: 'kotak',
            accounts: kotak
          }
        ];
        setAccounts(payload);
      }
    });
  }, [company]);

  const IMGS = {
    cashfree: '/assets/cashfree.svg',
    razorpay: '/assets/razorpay.svg',
    kotak: '/assets/kotak.svg'
  };

  const getImage = (vendor) => {
    switch (vendor) {
      case 'razorpay':
        return IMGS.razorpay;
      case 'cashfree':
        return IMGS.cashfree;
      case 'kotak':
        return IMGS.kotak;
      default:
        return IMGS.razorpay;
    }
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} className={styles.mb10}>
        <Grid
          container={true}
          alignItems="flex-start"
          justify="space-between"
          className={styles.headerMain}
        >
          <Grid item={true}>
            <Grid className={styles.headerValue}>{Insights.totalSplitAmount}</Grid>
            <Grid className={styles.headerHeading}>Total Split amount</Grid>
          </Grid>
          <Grid item={true}>
            <Grid className={styles.headerValue}>{Insights.activeAccounts}</Grid>
            <Grid className={styles.headerHeading}>Active accounts</Grid>
          </Grid>
          <Grid item={true}>
            <Grid className={styles.headerValue}>{Insights.inActiveAccounts}</Grid>
            <Grid className={styles.headerHeading}>In active accounts</Grid>
          </Grid>
          <Grid item={true}>
            <Grid className={styles.headerValue}>{Insights.totalPartners}</Grid>
            <Grid className={styles.headerHeading}>Total partners</Grid>
          </Grid>
          <Grid item={true}>
            <Grid className={styles.headerValue}>{Insights.TodaySplitAmount}</Grid>
            <Grid className={styles.headerHeading}>Today’s split amount</Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item={true} xs={12} className={styles.mb10}>
        <Grid className={styles.headerText}>Accounts</Grid>
      </Grid>
      {!isaccounts && <Grid>No Accounts Found</Grid>}
      <Grid item={true} xs={12}>
        <Grid container={true} className={styles.GridDiv}>
          {accounts.map((list) => (list?.accounts && list.accounts.length
            ? list.accounts.map((mList) => (
              <Grid item={true} className={styles.accountMainCard} key={`card-no-${list}`}>
                <Grid className={styles.accountCard}>
                  <Grid container={true} className={styles.imaegDiv} alignItems="center">
                    <Grid item={true} xs={8}>
                      <img
                        src={getImage(list?.vendor || 'cashfree')}
                        alt="AccountImage"
                      />
                    </Grid>
                    <Grid item={true} xs={4}>
                      <Grid className={`${mList.isActive ? styles.activeGrid : styles.inactiveGrid}`}>
                        {mList.isActive ? 'Active' : 'Inactive'}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container={true} className={styles.contentDiv}>
                    <Grid item={true} xs={8}>
                      <Grid item={true} className={styles.innerHeading}>
                        {list?.vendor === 'kotak' ? 'Account Number' : 'Account ID'}
                      </Grid>
                      <Grid item={true}>
                        <Typography noWrap={true} className={styles.innerText}>
                          {mList.accountId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))
            : null))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BrandBanking;
