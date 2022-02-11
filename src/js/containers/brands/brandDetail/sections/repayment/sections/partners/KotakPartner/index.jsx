import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { ControlledAccordion, DialogComponent, Button } from 'app/components';
import { createAccount, createBrandAccount, updateAccountConfig, updateBrandAccount } from 'app/containers/brands/saga';
import AddAccount from './components/addAccount';
import EditAccount from './components/editAccount';
import AccountsList from './components/accountsList';
import styles from '../../../styles.scss';
import rootStyle from './styles.scss';
import { AccountTypes } from '../../../data/enum';

function List(props) {
  const { list, vendor, brandCode, fetchData, brandId } = props;
  const [expanded, setExpanded] = useState(false);
  const [nbfcAccounts, setNBFCAccounts] = useState([]);
  const [brandAccount, setBrandAccount] = useState({});
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [editDialogueOpen, setEditDialogueOpen] = useState(false);
  const [editAccount, setEditAccount] = useState({});
  const [isNBFC, setIsNBFC] = useState(false);

  useEffect(() => {
    if (list?.vendor && Object.keys(list?.accounts).length > 0) {
      fetchNbfcAcc(list?.accounts);
    }
    if (list?.vendor && Object.keys(list?.brandAccount).length > 0) {
      fetchBrandAcc(list?.brandAccount);
    }
  }, [list]);

  const fetchNbfcAcc = (accounts) => {
    const NbfcAccounts = [];
    Object.keys(accounts).map((account) => {
      NbfcAccounts.push({
        ifsc: accounts[account].ifsc,
        isActive: accounts[account].isActive,
        name: accounts[account].name,
        accountNumber: account
      });
      return 0;
    });
    setNBFCAccounts(NbfcAccounts);
  };

  const fetchBrandAcc = (brandAcc) => {
    setBrandAccount(brandAcc);
  };

  const handleAccChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getAccountId = (data = {}) => (data.accountNumber);

  // const renderSplitPercentage = (data) => {
  //   if (data?.isNBFCAccount && !data?.isBrandAccount) {
  //     return (data?.totalSplit).toFixed(2);
  //   }
  //   if (data?.isBrandAccount && !data?.isNBFCAccount) {
  //     return (data?.brandSplit).toFixed(0);
  //   }
  //   if (data?.isNBFCAccount && data?.isBrandAccount) {
  //     return (data?.totalSplit + data?.brandSplit).toFixed(0);
  //   }
  //   return '-';
  // };

  const rowHtml = (data) => (
    <Grid container={true}>
      <Grid item={true} xs={12} className={styles.mb10}>
        <Grid
          container={true}
          alignItems="flex-start"
          justify="space-between"
          className={styles.headerMainPartners}
        >
          <Grid item={true} xs={3}>
            <img src={data.img} alt={data.alt} />
          </Grid>
          <Grid item={true} xs={3}>
            <Grid className={styles.headerValue2}>Kotak V Account Number</Grid>
            <Grid className={styles.headerHeading2}>
              <Typography noWrap={true}>{getAccountId(data) || '-'}</Typography>
            </Grid>
          </Grid>
          <Grid item={true} xs={3}>
            {/* <Grid className={styles.headerValue2}>Total Split %</Grid>
            <Grid className={styles.headerHeading2}>
              {renderSplitPercentage(data)}
            </Grid> */}
          </Grid>
          <Grid item={true} xs={3}>
            <Grid className={styles.headerValue2}># Active accounts</Grid>
            <Grid className={styles.headerHeading2}>{data.activeAccounts}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const onSubmit = (values) => {
    const payload = {
      name: values?.name,
      accountNumber: values?.accountNumber,
      ifsc: values?.ifsc
    };
    if (values.type === AccountTypes.NBFC) {
      payload.isActive = values?.isActive || 0;
      createAccount(brandCode, vendor, payload).then(() => {
        setDialogueOpen(false);
        fetchData();
      });
      return;
    }
    if (values.type === AccountTypes.BRAND) {
      payload.narration = values?.narration || null;
      createBrandAccount(brandCode, vendor, payload).then(() => {
        setDialogueOpen(false);
        fetchData();
      });
    }
  };

  const handleEditAccount = (values) => {
    const payload = {
      name: values?.name,
      accountNumber: values?.accountNumber,
      ifsc: values?.ifsc
    };
    if (values.type === AccountTypes.BRAND) {
      payload.narration = values?.narration || null;
      updateBrandAccount(brandCode, vendor, payload).then(() => {
        setEditDialogueOpen(false);
        fetchData();
      });
      return;
    }
    if (values.type === AccountTypes.NBFC) {
      payload.isActive = values?.isActive || 0;
      updateAccountConfig(brandCode, vendor, values?.accountNumber, payload).then(() => {
        setEditDialogueOpen(false);
        fetchData();
      });
    }
  };

  const handleEdit = (config, type) => {
    setEditAccount(config);
    setEditDialogueOpen(true);
    if (type === AccountTypes.NBFC) {
      setIsNBFC(true);
    } else {
      setIsNBFC(false);
    }
  };

  return (
    <ControlledAccordion
      key={`list-of-${list?.accountNumber}=${list.vendor}`}
      fullWidth={true}
      heading={rowHtml(list)}
      expanded={expanded}
      id={list?.id}
      handleChange={handleAccChange}
      unmountOnExit={true}
    >
      <Grid container={true}>
        {Object.keys(list?.overallSplitPercentage)?.length > 0 && nbfcAccounts?.length && (
        <Grid item={true} xs={12} className={rootStyle.p16}>
          <Grid item={true} xs={12} className={`${rootStyle.pb20} ${rootStyle.splitPercentage}`}>
            Overall Split %
          </Grid>
          <Grid item={true} xs={12} className={`${rootStyle.revenueSources} ${rootStyle.pb20}`}>
            {Object.keys(list?.overallSplitPercentage)?.length && (
                Object.keys(list?.overallSplitPercentage).map((source) => (
                  <div className={`${rootStyle.splitPercentageContainer} ${rootStyle.splitPercentage}`}>
                    {`${source}: ${list?.overallSplitPercentage[source]}%`}
                  </div>
                ))
            )}
          </Grid>
        </Grid>
        )}
        <Grid item={true} xs={12}>
          <AccountsList
            accounts={nbfcAccounts}
            brandAccount={brandAccount}
            fetchData={fetchData}
            brandCode={brandCode}
            brandId={brandId}
            vendor={vendor}
            openDialogue={handleEdit}
            brandSplitPercentage={list?.brandSplit}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Grid container={true} className={rootStyle.fieldRowContainer}>
            <Button type="button" label="Add Account" onClick={() => setDialogueOpen(true)} />
          </Grid>
        </Grid>
      </Grid>
      {dialogueOpen && (
        <DialogComponent
          title="Add Account"
          onClose={() => setDialogueOpen(false)}
        >
          <AddAccount
            onSubmit={onSubmit}
            onClose={() => setDialogueOpen(false)}
            brandAccount={brandAccount}
          />
        </DialogComponent>
      )}
      {editDialogueOpen && (
        <DialogComponent
          title="Edit Account"
          onClose={() => setEditDialogueOpen(false)}
        >
          <EditAccount
            form="editAccount"
            onSubmit={handleEditAccount}
            onClose={() => setEditDialogueOpen(false)}
            isNBFC={isNBFC}
            initialValues={{
              name: editAccount?.name,
              accountNumber: editAccount?.accountNumber,
              ifsc: editAccount?.ifsc,
              // eslint-disable-next-line no-unneeded-ternary
              isActive: editAccount?.isActive === 1 ? true : false,
              narration: editAccount?.narration || ''
            }}
          />
        </DialogComponent>
      )}
    </ControlledAccordion>
  );
}

export default List;
