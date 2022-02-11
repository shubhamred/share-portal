import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  fetchDealConfig,
  createDealConfig,
  updateToggleDealConfig,
  updateDealConfig
} from 'app/containers/brands/saga';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DialogComponent, Switch } from 'app/components';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Button } from '@material-ui/core';
import AddConfig from './addConfig';
import EditConfig from './editConfig';
import global from '../../../global.scss';
import styles from './styles.scss';

const Repayment = (props) => {
  const { dealData } = props;
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [isaccounts, setIsAccounts] = useState(true);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAccountActive, setIsAccountActive] = useState({
    razorpay: false,
    cashfree: false
  });
  const [accountStatus, setAccountStatus] = useState({
    razorpay: false,
    cashfree: false
  });

  const payloadMaker = ({ data }) => {
    const payload = [];
    if (data?.splits && Object.keys(data?.splits).length > 0) {
      Object.keys(data?.splits).map((account) => {
        const mData = data.splits;
        payload.push({
          split: mData[account].split || 0,
          isActive: data.isActive,
          innerIsActive: mData[account].isActive,
          accountId: account,
          totalPayoutAmount: 0
        });
        return 0;
      });
    }
    return payload;
  };

  const loadData = async () => {
    if (dealData) {
      try {
        const razorpayData = await fetchDealConfig(
          dealData.brandCode,
          'razorpay',
          dealData.dealCode
        );
        const cashfreeData = await fetchDealConfig(
          dealData.brandCode,
          'cashfree',
          dealData.dealCode
        );
        const kotakData = await fetchDealConfig(
          dealData.brandCode,
          'kotak',
          dealData.dealCode
        );

        const cashfree = payloadMaker(cashfreeData);
        const razorpay = payloadMaker(razorpayData);
        const kotak = payloadMaker(kotakData);

        setAccountStatus({
          razorpay: razorpay.length > 0,
          cashfree: cashfree.length > 0,
          kotak: kotak.length > 0
        });
        setIsAccountActive({
          razorpay: razorpayData?.data?.isActive || 0,
          cashfree: cashfreeData?.data?.isActive || 0,
          kotak: kotakData?.data?.isActive || 0
        });
        setIsAccounts(
          razorpay.length > 0 || cashfree.length > 0 || kotak.length > 0
        );
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
      } catch (err) {
        setAccounts([]);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [dealData]);

  const onSubmit = async (value) => {
    const { razorpay, cashfree, kotak } = accountStatus;
    if (
      (value?.vendor === 'razorpay' && razorpay)
      || (value?.vendor === 'cashfree' && cashfree)
      || (value?.kotak === 'cashfree' && kotak)
    ) {
      const mData = {
        isActive: value.isActive,
        split: value?.split || 0
      };
      upsertDealAccount(
        dealData.brandCode,
        value?.vendor || '',
        dealData.dealCode,
        value?.selectBeneficiary,
        mData
      );
      return;
    }
    const payload = {
      dealCode: dealData.dealCode,
      isActive: value?.isActive || 1,
      splits: [
        {
          accountId: value?.selectBeneficiary || '',
          isActive: value?.isActive || 1,
          split: value?.split || 0
        }
      ]
    };
    createDealConfig(dealData.brandCode, value?.vendor || '', payload).then(
      (res) => {
        if (res.data) {
          setDialogueOpen(false);
          loadData();
          dispatch({
            type: 'show',
            payload: res.message,
            msgType: 'success'
          });
        } else {
          dispatch({
            type: 'show',
            payload: res.message,
            msgType: 'error'
          });
        }
      }
    );
  };

  const toggleHandler = (data) => {
    const { accountId, vendor } = data;
    const { brandCode, dealCode } = dealData;
    const payload = {
      isActive: data?.innerIsActive === 1 ? 0 : 1,
      split: data?.split || 0
    };
    upsertDealAccount(brandCode, vendor || '', dealCode, accountId, payload);
  };

  const dealtoggleHandler = (data) => {
    const payload = {
      isActive: data?.isActive === 1 ? 0 : 1
    };
    updateToggleDealConfig(
      dealData.brandCode,
      data?.vendor || '',
      dealData.dealCode,
      payload
    ).then((res) => {
      if (res.data) {
        loadData();
        dispatch({
          type: 'show',
          payload: res.message,
          msgType: 'success'
        });
      } else {
        dispatch({
          type: 'show',
          payload: res.message,
          msgType: 'error'
        });
      }
    });
  };

  const onEdit = async (value) => {
    const { accountId, vendor } = editData;
    const { brandCode, dealCode } = dealData;
    const payload = {
      isActive: value.isActive,
      split: value?.split || 0
    };
    upsertDealAccount(brandCode, vendor || '', dealCode, accountId, payload);
  };

  const upsertDealAccount = (
    brandCode,
    vendor,
    dealCode,
    accountId,
    payload
  ) => {
    updateDealConfig(
      brandCode,
      vendor || '',
      dealCode,
      accountId,
      payload
    ).then((res) => {
      if (res.data) {
        loadData();
        setDialogueOpen(false);
        setEditDialogOpen(false);
        dispatch({
          type: 'show',
          payload: res.message,
          msgType: 'success'
        });
      } else {
        const errorMsg = res.error ? JSON.parse(res.error)?.message : '';
        dispatch({
          type: 'show',
          payload: errorMsg || res.message,
          msgType: 'error'
        });
      }
    });
  };

  const editClickHandler = (data) => {
    setEditData(data);
    setEditDialogOpen(true);
  };

  const getImageSource = (key) => {
    switch (key) {
      case 'cashfree':
        return '/assets/cashfree.svg';
      case 'razorpay':
        return '/assets/razorpay.svg';
      case 'kotak':
        return '/assets/kotak.svg';
      default:
        return '/assets/cashfree.svg';
    }
  };

  return (
    <Grid container={true}>
      <Grid className={styles.mb10} item={true} xs={12}>
        <Grid container={true} justify="space-between" alignItems="center">
          <Grid item={true} md={2} className={styles.headerText}>
            Accounts
          </Grid>
          <Grid container={true} item={true} md={6}>
            {accountStatus.cashfree && (
              <Grid container={true} item={true} md={4} alignItems="center">
                <img
                  src={getImageSource('cashfree')}
                  className={styles.mr10}
                  alt="AccountImage"
                />
                <Grid item={true} className={styles.toggleSwitch}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => dealtoggleHandler({
                          isActive: isAccountActive.cashfree,
                          vendor: 'cashfree'
                        })}
                        checked={isAccountActive.cashfree}
                      />
                    }
                  />
                </Grid>
              </Grid>
            )}
            {accountStatus.razorpay && (
              <Grid container={true} item={true} md={4} alignItems="center">
                <img
                  src={getImageSource('razorpay')}
                  className={styles.mr10}
                  alt="AccountImage"
                />
                <Grid item={true} className={styles.toggleSwitch}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => dealtoggleHandler({
                          isActive: isAccountActive.razorpay,
                          vendor: 'razorpay'
                        })}
                        checked={isAccountActive.razorpay}
                      />
                    }
                  />
                </Grid>
              </Grid>
            )}
            {accountStatus.kotak && (
              <Grid container={true} item={true} md={4} alignItems="center">
                <img
                  src={getImageSource('kotak')}
                  className={styles.mr10}
                  alt="AccountImage"
                />
                <Grid item={true} className={styles.toggleSwitch}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => dealtoggleHandler({
                          isActive: isAccountActive.kotak,
                          vendor: 'kotak'
                        })}
                        checked={isAccountActive.kotak}
                      />
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item={true} md={2} className={styles.buttonContainer}>
            <Button
              className={global.primaryCTA}
              onClick={() => setDialogueOpen(true)}
            >
              Add Account
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {!isaccounts && <Grid>No Accounts Found</Grid>}
      <Grid item={true} xs={12}>
        <Grid container={true} className={styles.GridDiv}>
          {accounts.map((list) => (list?.accounts && list.accounts.length
            ? list.accounts.map((mList) => (
              <Grid
                item={true}
                className={styles.accountMainCard}
                key={`card-no-${list}`}
              >
                <Grid className={styles.accountCard}>
                  <Grid className={styles.imaegDiv}>
                    <img
                      src={getImageSource(list.vendor)}
                      alt="AccountImage"
                    />
                    <MoreVertIcon
                      className={`${styles.moreIcon} ${
                        !isAccountActive[list.vendor]
                          ? styles.disabledStyle
                          : ''
                      }`}
                      onClick={() => editClickHandler({ ...mList, vendor: list.vendor })}
                    />
                  </Grid>
                  <Grid container={true} className={styles.contentDiv}>
                    <Grid item={true} xs={8}>
                      <Grid item={true} className={styles.innerHeading}>
                        Split %
                      </Grid>
                      <Grid item={true} className={styles.innerText}>
                        {`${mList.split}%`}
                      </Grid>
                    </Grid>
                    <Grid item={true} xs={4}>
                      <Grid item={true} className={styles.innerHeading}>
                        Account ID
                      </Grid>
                      <Grid item={true}>
                        <Typography
                          noWrap={true}
                          className={styles.innerText}
                        >
                          {mList.accountId}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container={true}>
                    <Grid item={true} xs={8}>
                      <Grid item={true} className={styles.innerHeading}>
                        Active
                      </Grid>
                      <Grid
                        item={true}
                        className={`${styles.toggleSwitch} ${
                          !isAccountActive[list.vendor]
                            ? styles.disabledStyle
                            : ''
                        }`}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={() => toggleHandler({
                                ...mList,
                                vendor: list.vendor
                              })}
                              checked={mList.innerIsActive}
                            />
                              }
                        />
                      </Grid>
                    </Grid>
                    <Grid item={true} xs={4} />
                  </Grid>
                </Grid>
              </Grid>
            ))
            : null)
          )}
        </Grid>
      </Grid>
      {dialogueOpen && (
        <DialogComponent
          title="Add Accounts"
          onClose={() => setDialogueOpen(false)}
        >
          <AddConfig
            onSubmit={onSubmit}
            dealData={dealData || {}}
            onClose={() => setDialogueOpen(false)}
          />
        </DialogComponent>
      )}
      {editDialogOpen && (
        <DialogComponent
          title="Edit Deal Config"
          onClose={() => setEditDialogOpen(false)}
        >
          <EditConfig
            onSubmit={onEdit}
            editData={editData}
            onClose={() => setEditDialogOpen(false)}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default Repayment;
