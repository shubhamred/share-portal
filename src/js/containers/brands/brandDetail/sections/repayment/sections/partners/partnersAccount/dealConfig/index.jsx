import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { DialogComponent, Switch } from 'app/components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch } from 'react-redux';
import { createDealConfig, updateDealConfig } from 'app/containers/brands/saga';
import AddPartnersAccountsDeal from './addPartnersAccountsDeal';
import EditPartnersAccountsDeal from './editPartnersAccountsDeal';
import styles from '../../../../styles.scss';

const PartnersAccount = (props) => {
  const { list, account, brandCode, vendor, fetchData, brandId, accountStatus } = props;
  const dispatch = useDispatch();
  const [accountList, setAccountList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (list?.deals && Object.keys(list.deals).length > 0) {
      const mData = [];
      Object.keys(list.deals).map((deal) => {
        const { splits } = list.deals[deal];
        const accountData = Object.keys(splits);
        const accountExist = accountData.findIndex((l) => (l === account.accountId) || (l === account.accountNumber));
        if (accountExist >= 0) {
          mData.push({
            dealCode: deal,
            split: splits[accountData[accountExist]].split,
            isActive: list.deals[deal].isActive,
            innerIsActive: splits[accountData[accountExist]].isActive
          });
        }
        return 0;
      });
      setAccountList(mData);
    }
  }, [list, account]);

  const toggleHandler = (data) => {
    const payload = {
      split: data?.split || 0,
      isActive: data?.innerIsActive === 1 ? 0 : 1
    };
    upsertDealAccount(data.dealCode, account?.accountId || account?.accountNumber, payload);
  };

  const rowHtml = (data) => (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Grid container={true} className={styles.headerMainPartners}>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>Deal Name</Grid>
            <Grid className={styles.headerValue3}>
              <Typography noWrap={true}>{data.dealCode}</Typography>
            </Grid>
          </Grid>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>Split Percentage %</Grid>
            <Grid className={styles.headerValue3}>{`${data.split} %`}</Grid>
          </Grid>
          <Grid xs={3} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.headerHeading3}>Status</Grid>
            <Grid className={`${styles.headerValue3} ${styles.switchStyle} ${!data.isActive || !accountStatus ? styles.disabledStyle : ''}`}>
              <FormControlLabel control={<Switch onChange={() => toggleHandler(data)} checked={data.innerIsActive} />} />
            </Grid>
          </Grid>
          <Grid xs={2} item={true} className={styles.subHeaderMainPartners}>
            <Grid className={styles.subHeaderMainPartnersButton}>
              <Grid
                className={`${styles.editButtonStyle} ${!data.isActive || !accountStatus ? styles.disabledStyle : ''}`}
                onClick={() => {
                  setEditDialogOpen(true);
                  setEditData({ ...data });
                }}
              >
                EDIT
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const onSubmit = async (value) => {
    if (list?.deals && Object.keys(list.deals).length > 0 && Object.keys(list.deals).includes(value?.deal?.dealCode)) {
      const mData = {
        isActive: value.isActive,
        split: value?.split || 0
      };
      upsertDealAccount(value?.deal?.dealCode, account?.accountId || account?.accountNumber, mData);
      return;
    }
    const payload = {
      dealCode: value?.deal?.dealCode || '',
      isActive: value.isActive,
      splits: [
        {
          accountId: account?.accountId || account?.accountNumber || '',
          isActive: value.isActive,
          split: value?.split || 0
        }
      ]
    };
    createDealConfig(brandCode, vendor || '', payload).then((res) => {
      if (res.data) {
        fetchData();
        setDialogOpen(false);
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

  const onEdit = async (value) => {
    const payload = {
      isActive: value.isActive,
      split: value?.split || 0
    };
    upsertDealAccount(value.dealCode, account?.accountId || account?.accountNumber, payload);
  };

  const upsertDealAccount = (dealCode, accountId, payload) => {
    updateDealConfig(brandCode, vendor || '', dealCode, accountId, payload).then((res) => {
      if (res.data) {
        fetchData();
        setDialogOpen(false);
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

  return (
    <Grid container={true} xs={12} item={true}>
      {accountList.length ? (
        accountList.map((type, index) => (
          <Grid item={true} xs={12} key={type.id}>
            {rowHtml(type, index)}
          </Grid>
        ))
      ) : null}
      <Grid item={true} xs={12} container={true} justify="space-between">
        <Grid item={true} style={{ marginLeft: '14px' }}>
          <Button startIcon={<AddIcon />} color="primary" onClick={() => setDialogOpen(true)}>
            Link deal
          </Button>
        </Grid>
      </Grid>
      {dialogOpen && (
        <DialogComponent title="Link deal" onClose={() => setDialogOpen(false)}>
          <AddPartnersAccountsDeal onSubmit={onSubmit} brandId={brandId} onClose={() => setDialogOpen(false)} />
        </DialogComponent>
      )}
      {editDialogOpen && (
        <DialogComponent title="Edit Deal Config" onClose={() => setEditDialogOpen(false)}>
          <EditPartnersAccountsDeal
            onSubmit={onEdit}
            editData={editData}
            onClose={() => setEditDialogOpen(false)}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default React.memo(PartnersAccount);
