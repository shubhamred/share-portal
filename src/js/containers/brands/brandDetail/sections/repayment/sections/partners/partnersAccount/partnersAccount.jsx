/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { DialogComponent, Switch } from 'app/components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch } from 'react-redux';
import { updateToggleAccountConfig } from 'app/containers/brands/saga';
import AddPartnersAccounts from './addPartnersAccounts';
import DealConfigs from './dealConfig';
import styles from '../../../styles.scss';

const PartnersAccount = (props) => {
  const { list, brandCode, vendor, fetchData } = props;
  const dispatch = useDispatch();
  const [accountList, setAccountList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (list.accounts && list.accounts.length >= 1) {
      const mData = list.accounts.map((acc) => {
        let split = 0;
        if (list?.deals && Object.keys(list.deals).length > 0) {
          Object.keys(list.deals).map((deal) => {
            const { splits } = list.deals[deal];
            const accountData = Object.keys(splits);
            const accountExist = accountData.findIndex(
              (accId) => (accId === acc.accountId || accId === acc.accountNumber)
            );
            if (accountExist >= 0) {
              const currentDealSplitObj = splits[accountData[accountExist]];
              split += (currentDealSplitObj?.isActive ? currentDealSplitObj.split : 0);
            }
            return 0;
          });
        }
        return { ...acc, split };
      });
      setAccountList(mData);
    }
  }, [list]);

  const toggleHandler = (data = {}) => {
    const payload = {
      ...data,
      isActive: data?.isActive === 1 ? 0 : 1
    };
    setAccountConfig(data.accountNumber || data.accountId, payload);
  };

  const setAccountConfig = (accountId, payload) => {
    updateToggleAccountConfig(brandCode, vendor || '', accountId, payload).then(
      (res) => {
        if (res.error) {
          dispatch({
            type: 'show',
            payload: res.message,
            msgType: 'error'
          });
        } else {
          setDialogOpen(false);
          fetchData();
          const errorMsg = res.error ? JSON.parse(res.error)?.message : '';
          dispatch({
            type: 'show',
            payload: errorMsg || res.message,
            msgType: 'success'
          });
        }
      }
    );
  };

  const rowHtml = (data, index) => (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Grid container={true} className={styles.headerMainPartners}>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>{vendor === 'kotak' ? 'Account Number' : 'Account Id'}</Grid>
            <Grid className={styles.headerValue3}>
              <Typography noWrap={true}>{vendor === 'kotak' ? data?.accountNumber || '' : data.accountId}</Typography>
            </Grid>
          </Grid>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>Total Split %</Grid>
            <Grid className={styles.headerValue3}>{`${data.split} %`}</Grid>
          </Grid>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>Status</Grid>
            <Grid className={`${styles.headerValue3} ${styles.switchStyle}`}>
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => toggleHandler(data)}
                    checked={data.isActive}
                  />
                }
              />
            </Grid>
          </Grid>
          <Grid xs={2} item={true} className={styles.subHeaderMainPartners} />
        </Grid>
      </Grid>
      <Grid item={true} xs={12}>
        <DealConfigs {...props} account={data} accountStatus={data.isActive} />
      </Grid>
      {accountList.length - 1 !== index && (
        <Grid className={styles.borderStyle} item={true} xs={12} />
      )}
    </Grid>
  );

  const onSubmit = async (value) => {
    const payload = {
      ...(vendor === 'kotak'
        ? {
          name: value?.name || '',
          email: value?.email || '',
          ifsc: value?.ifsc || ''
        }
        : {}),
      isActive: value.isActive
    };
    setAccountConfig(value?.accountId || '', payload);
  };

  return (
    <Grid container={true} xs={12} item={true}>
      <Grid
        item={true}
        xs={12}
        className={styles.applicationHeader}
        container={true}
        justify="space-between"
        alignItems="baselines"
      >
        <Grid item={true} className={styles.heading1}>
          Accounts
        </Grid>
        <Grid item={true}>
          <Button
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => setDialogOpen(true)}
          >
            Add Account Details
          </Button>
        </Grid>
      </Grid>
      {accountList.length ? (
        accountList.map((type, index) => (
          <Grid item={true} xs={12} key={type.id}>
            {rowHtml(type, index)}
          </Grid>
        ))
      ) : (
        <Grid item={true} xs={12} className={styles.nullapplication}>
          No Accounts Available
        </Grid>
      )}
      {dialogOpen && (
        <DialogComponent
          title="Add Partner Account"
          onClose={() => setDialogOpen(false)}
        >
          <AddPartnersAccounts
            vendor={vendor}
            accountId={list?.accountNumber || ''}
            onSubmit={onSubmit}
            onClose={() => setDialogOpen(false)}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default React.memo(PartnersAccount);
