/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, AddButton, DialogComponent } from 'app/components';
import { addBrandIntegrations, updateBrandIntegrations } from 'app/containers/brands/saga';
import DetailForm from 'app/containers/deals/components/DocumentsTab/form';
import { DocType } from 'app/containers/deals/components/DocumentsTab/data/mockdata';
import { Context } from 'app/utils/utils';
import EditForm from './editForm';
import styles from '../../../companyApplications/components/applicationDetail/style.scss';

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: '500',
    fontSize: '22px',
    lineHeight: '22px',
    color: '#212529cc',
    opacity: '0.9'
  },
  heading: {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '16px',
    color: '#22262ab3'
  },
  headingValue: {
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '16px',
    color: '#212529'
  },
  actions: {
    cursor: 'pointer'
  }
}));

const MarketplaceOverview = () => {
  const { marketplaceData, brandCode, fetchMarketplaceData } = useContext(Context);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialogstatus] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const classes = useStyles();

  const submitHandler = async (data) => {
    const { marketplace_account_name, marketplace_accouunt_number, marketplace_account_type } = data;
    const response = await addBrandIntegrations(brandCode, 'MARKETPLACE', marketplace_account_type?.value || '', {
      accountName: marketplace_account_name,
      accountNumber: marketplace_accouunt_number
    });
    if (response?.message) {
      dispatch({
        type: 'show',
        payload: response.message,
        msgType: 'error'
      });
    } else {
      fetchMarketplaceData();
      setOpenDialogstatus(false);
    }
  };

  const submitEditHandler = async (data) => {
    const { marketplace_account_name, marketplace_accouunt_number, marketplace_account_type } = data;
    const response = await updateBrandIntegrations(brandCode, 'MARKETPLACE', marketplace_account_type, {
      accountName: marketplace_account_name,
      accountNumber: marketplace_accouunt_number
    });
    if (response?.message) {
      dispatch({
        type: 'show',
        payload: response.message,
        msgType: 'error'
      });
    } else {
      setOpenEditDialog(false);
      fetchMarketplaceData();
    }
  };

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };

  const editDialoghandler = (data) => {
    setOpenEditDialog(true);
    setEditData(data);
  };

  const tipContent = (data) => (
    <Grid className={classes.tipContent}>
      <Grid className={classes.actions} onClick={() => editDialoghandler(data)} style={{ padding: '10px' }}>
        Edit Account
      </Grid>
    </Grid>
  );

  return (
    <Grid container={true}>
      <Grid container={true} item={true} justify="space-between" style={{ marginBottom: '30px' }}>
        <Grid className={styles.mainHeader}>Marketplace</Grid>
        <Grid>
          <AddButton onClick={handleOpenModal} label="Add Marketplace" />
        </Grid>
      </Grid>
      {marketplaceData && marketplaceData.length ? (
        marketplaceData.map((acc) => (
          <Grid item={true} xs={12} key={acc.id}>
            <Grid container={true} className={styles.mainContainer}>
              <Grid item={true} xs={3}>
                <p className={styles.subHeader}>Merchant Name</p>
                <p className={styles.subHeaderValue}>{acc.type || '-'}</p>
              </Grid>
              <Grid item={true} xs={3}>
                <p className={styles.subHeader}>Account Name</p>
                <p className={styles.subHeaderValue}>{acc.accountName || '-'}</p>
              </Grid>
              <Grid item={true} xs={3}>
                <p className={styles.subHeader}>Account Number</p>
                <p className={styles.subHeaderValue}>{acc?.accountNumber || '-'}</p>
              </Grid>
              <Grid item={true} xs={2} />
              <Grid item={true} xs={1} justify="flex-end">
                <Tooltip
                  anchorOriginVertical="center"
                  anchorOriginHorizontal="right"
                  transformOriginHorizontal="right"
                  title={tipContent(acc)}
                >
                  <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true">
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        ))
      ) : (
        <p>No Accounts available</p>
      )}
      {openDialog && (
        <DialogComponent
          title="Marketplace"
          onClose={handleOpenModal}
          closeButton={true}
          customWidth="750px"
          customPadding="10px 10px 8px 10px"
          contentStyle={{ padding: '24px 18px 16px' }}
        >
          <DetailForm
            onClose={handleOpenModal}
            type={DocType.Marketplace}
            isTab={false}
            onSubmit={submitHandler}
            editable={true}
            inputGrid={6}
          />
        </DialogComponent>
      )}
      {openEditDialog && (
        <DialogComponent
          title="Marketplace"
          onClose={() => { setOpenEditDialog(false); }}
          closeButton={true}
          customWidth="750px"
          customPadding="10px 10px 8px 10px"
          contentStyle={{ padding: '24px 18px 16px' }}
        >
          <EditForm
            onClose={() => { setOpenEditDialog(false); }}
            config={editData}
            onSubmit={submitEditHandler}
            editable={true}
            inputGrid={6}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default MarketplaceOverview;
