import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import { AddButton, DialogComponent } from 'app/components';
import { bankAccountTypes as accountTypeList } from 'app/constants/misc';
import EditAccountForm from './forms/editAccountForm';
import AddAccountForm from './forms/addAccountForm';
import styles from './styles.scss';

const Banking = (props) => {
  const {
    companyId,
    updateStatus,
    banks,
    accounts,
    getAccounts,
    brandCode,
    addAccount,
    updateAccount,
    resourceId,
    accountsFetchInProgress
  } = props;

  useEffect(() => {
    if (getAccounts && brandCode) getAccounts(brandCode);
  }, [brandCode]);

  useEffect(() => {
    setBankNameList(banks && banks.map((bank) => bank.name));
  }, [banks]);

  const [openDialog, setOpenDialogstatus] = useState(false);
  const [bankNamelist, setBankNameList] = useState([]);
  const handleSubmit = (values) => {
    if (values) {
      const bankId = banks.map((bank) => (bank.name === values.bankName ? bank.id : null));
      addAccount({
        ...values,
        resourceCode: brandCode,
        companyId: resourceId,
        bankId: bankId.join('')
      }).then(() => {
        getAccounts(brandCode);
      });
      setOpenDialogstatus(!openDialog);
    }
  };
  const handleUpdateAccount = (values) => {
    if (values) {
      const bankId = banks.map((bank) => (bank.name === values.bankName ? bank.id : null));
      updateAccount({
        ...values,
        companyId: resourceId,
        bankId: bankId.join('')
      });
    }
  };

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };

  const renderAccounts = () => {
    if (accounts?.length && bankNamelist.length && !accountsFetchInProgress) {
      return (
        accounts.map(
          (account) => {
            const accountData = { ...account };
            accountData.bankName = banks.map((bank) => (bank.id === accountData.bankId ? bank.name : null)).join('');
            return (
              <Grid className={styles.editFormContainer} key={accountData.id}>
                <EditAccountForm
                  form={accountData.id}
                  onSubmit={handleUpdateAccount}
                  initialValues={accountData}
                  bankNamelist={bankNamelist}
                  accountTypeList={accountTypeList}
                  resourceId={companyId}
                  updateStatus={updateStatus}
                />
              </Grid>
            );
          }
        )
      );
    }

    if (!accountsFetchInProgress && !accounts?.length) {
      return (
        <p>No bank accounts found</p>
      );
    }

    return (
      <div className={styles.progressWrapper}>
        <CircularProgress />
      </div>
    );
  };

  return (
    <Grid>
      <Grid xs={12} container={true} style={{ justifyContent: 'flex-end' }}>
        <Grid item={true}>
          <AddButton onClick={handleOpenModal} label="Add Bank" />
        </Grid>
      </Grid>
      {renderAccounts()}
      {openDialog && (
      <DialogComponent title="Add Bank" onClose={() => setOpenDialogstatus(false)}>
        <AddAccountForm
          onSubmit={handleSubmit}
          handleCancel={() => {
            setOpenDialogstatus(false);
          }}
          bankNamelist={bankNamelist}
          accountTypelist={accountTypeList}
        />
      </DialogComponent>
      )}
    </Grid>
  );
};

Banking.propTypes = {
  getAccounts: PropTypes.func,
  addAccount: PropTypes.func,
  updateAccount: PropTypes.func,
  banks: PropTypes.shape([]),
  accounts: PropTypes.shape([]),
  companyId: PropTypes.string,
  resourceId: PropTypes.string,
  brandCode: PropTypes.string,
  updateStatus: PropTypes.string,
  accountsFetchInProgress: PropTypes.bool
};

Banking.defaultProps = {
  getAccounts: () => { },
  addAccount: () => { },
  updateAccount: () => { },
  banks: [],
  accounts: [],
  companyId: '',
  resourceId: '',
  brandCode: '',
  updateStatus: '',
  accountsFetchInProgress: false
};

export default Banking;
