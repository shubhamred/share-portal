import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch, DialogComponent } from 'app/components';
import { useDispatch } from 'react-redux';
import { createApplication,
  getApplications,
  updateApplication,
  updateBrandAccount,
  updateAccountConfig } from 'app/containers/brands/saga';
import AddApplication from '../addApplication';
import EditApplication from '../editApplication';
import ApplicationList from '../applicationList';
import styles from '../../styles.scss';

const Accounts = (props) => {
  const { accounts, openDialogue, brandAccount, brandId, brandCode, vendor, fetchData } = props;
  const dispatch = useDispatch();

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [editDialogueOpen, setEditDialogueOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [appList, setAppList] = useState([]);
  const [editApplication, setEditApplication] = useState({});

  const onSubmit = (values) => {
    const payload = values;
    payload.accountNumber = accountNumber;
    createApplication(brandCode, vendor, payload).then((res) => {
      fetchData();
      getApplicationList();
      setDialogueOpen(false);
      if (res.error) {
        dispatch({
          type: 'show',
          payload: res.error,
          msgType: 'error'
        });
      }
    });
  };

  useEffect(() => {
    getApplicationList();
  }, []);

  const handleEditSubmit = (values) => {
    updateApplication(brandCode, vendor, values?.applicationCode, values).then(() => {
      setEditDialogueOpen(false);
      getApplicationList();
      fetchData();
    });
  };

  const handleLinkApplication = (accountNum) => {
    setDialogueOpen(true);
    setAccountNumber(accountNum);
  };

  const getApplicationList = () => {
    getApplications(brandCode, vendor).then((res) => {
      setAppList(res.data.applications);
    });
  };

  const handleEditApplication = (editApp) => {
    setEditDialogueOpen(true);
    setEditApplication(editApp);
  };

  const handleSetApplication = (accNo) => {
    const filteredApplications = appList.filter((application) => application.accountNumber === accNo);
    if (filteredApplications?.length > 0) {
      return filteredApplications;
    }
    return [];
  };

  const toggleHandler = (data = {}) => {
    const payload = {
      ...data,
      isActive: data?.isActive === 1 ? 0 : 1
    };
    updateBrandAccount(brandCode, vendor, payload).then(() => {
      fetchData();
    });
  };

  const toggleAccountHandler = (data = {}) => {
    const payload = {
      ...data,
      isActive: data?.isActive === 1 ? 0 : 1
    };
    updateAccountConfig(brandCode, vendor, data?.accountNumber, payload).then(() => {
      fetchData();
    });
  };

  return (
    <Grid container={true}>
      {accounts?.length > 0 && (
        <Grid container={true}>
          <Grid container={true} className={styles.p16}>
            <Grid item={true} xs={12} className={styles.pb20}>
              Settlement Accounts
            </Grid>
            <Grid item={true} xs={12} className={`${styles.headerHeading} ${styles.pb20}`}>
              NBFC
            </Grid>
          </Grid>
          {accounts.map((account, index) => (
            <Grid item={true} xs={12} className={styles.p16}>
              <Grid
                container={true}
                className={styles.labelContainer}
                alignItems="flex-start"
                justify="space-between"
              >
                <Grid item={true} xs={3}>
                  Account Name
                </Grid>
                <Grid item={true} xs={3}>
                  Account Number
                </Grid>
                <Grid item={true} xs={3}>
                  IFSC Code
                </Grid>
                <Grid item={true} xs={2}>
                  Status
                </Grid>
                <Grid item={true} xs={1} className={styles.editAccount} onClick={() => openDialogue(account, 'NBFC')}>
                  EDIT
                </Grid>
              </Grid>
              <Grid
                container={true}
                className={styles.headerHeading2}
                alignItems="center"
                justify="space-between"
              >
                <Grid item={true} xs={3}>
                  {account.name}
                </Grid>
                <Grid item={true} xs={3}>
                  {account.accountNumber}
                </Grid>
                <Grid item={true} xs={3}>
                  {account.ifsc}
                </Grid>
                <Grid item={true} xs={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => toggleAccountHandler(account)}
                        checked={account.isActive}
                      />
                  }
                  />
                </Grid>
              </Grid>
              <ApplicationList
                applications={handleSetApplication(account.accountNumber)}
                accountNumber={account.accountNumber}
                dialogueOpen={handleEditApplication}
                brandCode={brandCode}
                vendor={vendor}
                fetchData={fetchData}
                getApplicationList={getApplicationList}
                handleLinkApplication={handleLinkApplication}
              />
              {accounts.length - 1 !== index && (
              <Grid className={styles.borderStyle} item={true} xs={12} />
              )}
            </Grid>
          ))}
        </Grid>
      )}
      {Object.keys(brandAccount)?.length > 0 && (
        <Grid container={true} className={styles.p16}>
          <Grid className={styles.borderStyle} item={true} xs={12} />
          <Grid container={true}>
            <Grid item={true} xs={12} className={`${styles.headerHeading} ${styles.p15}`}>
              Brand
            </Grid>
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Grid
                container={true}
                className={styles.labelContainer}
                alignItems="flex-start"
                justify="space-between"
              >
                <Grid item={true} xs={3}>
                  Account Name
                </Grid>
                <Grid item={true} xs={3}>
                  Account Number
                </Grid>
                <Grid item={true} xs={3}>
                  Description
                </Grid>
                <Grid item={true} xs={2}>
                  Status
                </Grid>
                <Grid item={true} xs={1} className={styles.editAccount} onClick={() => openDialogue(brandAccount, 'Brand')}>
                  EDIT
                </Grid>
              </Grid>
              <Grid
                container={true}
                className={styles.headerHeading2}
                alignItems="center"
                justify="space-between"
              >
                <Grid item={true} xs={3}>
                  {brandAccount?.name}
                </Grid>
                <Grid item={true} xs={3}>
                  {brandAccount?.accountNumber}
                </Grid>
                <Grid item={true} xs={3}>
                  {brandAccount?.narration}
                </Grid>
                <Grid item={true} xs={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => toggleHandler(brandAccount)}
                        checked={brandAccount?.isActive}
                      />
                      }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {dialogueOpen && (
        <DialogComponent
          title="Add Application Configuration"
          onClose={() => setDialogueOpen(false)}
        >
          <AddApplication
            onSubmit={onSubmit}
            onClose={() => setDialogueOpen(false)}
            brandId={brandId}
          />
        </DialogComponent>
      )}
      {editDialogueOpen && (
        <DialogComponent
          title="Edit Application Configuration"
          onClose={() => setEditDialogueOpen(false)}
        >
          <EditApplication
            form="editApplication"
            onSubmit={handleEditSubmit}
            onClose={() => setEditDialogueOpen(false)}
            brandId={brandId}
            initialValues={{
              applicationCode: editApplication?.applicationCode,
              revenueSource: editApplication?.revenueSource,
              split: editApplication?.split,
              narration: editApplication?.narration,
              // eslint-disable-next-line no-unneeded-ternary
              isActive: editApplication?.isActive === 1 ? true : false
            }}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default Accounts;
