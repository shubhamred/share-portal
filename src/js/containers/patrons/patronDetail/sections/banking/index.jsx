import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import { bankAccountTypes } from 'app/constants/misc';
import { getCustomerBankDetails, updateCustomerBankAccount } from 'app/containers/patrons/saga';
import { AutocompleteCustom, DialogComponent } from 'app/components';
import InputLabel from '@material-ui/core/InputLabel';
import { getBanks } from 'app/containers/applications/saga';
import AddBankAccount from './addBankAccount';
import styles from '../../styles.scss';
import globalStyles from '../../../../global.scss';

const PatronBanking = (props) => {
  const { customer } = props;
  const { patronCode } = customer || {};
  const [fieldsDisabled, setFieldsDisabled] = useState(true);
  const [account, setAccount] = useState('');
  const { register, handleSubmit, control, reset, watch } = useForm();
  const [shaowModal, toggleModal] = useState(false);
  const [selectedBankDetails, setSelectedBank] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);

  const accType = watch('accountType');

  const getBankData = () => {
    getCustomerBankDetails(patronCode).then((res) => {
      if (res.data && res.data.length) {
        const tempAccount = res.data[0];
        setBankOptions([tempAccount.bank]);
        setSelectedBank(tempAccount.bank);
        reset({
          accountType: tempAccount.accountType,
          accountNumber: tempAccount.accountNumber,
          ifsc: tempAccount.ifsc,
          bankId: tempAccount.bankId,
          accountHolder: tempAccount.accountHolder,
          country: tempAccount.country
        });
        setAccount(tempAccount);
      }
    });
  };

  const onSubmit = (values) => {
    if (!selectedBankDetails) return;
    const payload = {
      ...values,
      bankId: selectedBankDetails.id
    };
    updateCustomerBankAccount(account.id, payload).then((res) => {
      if (res.data) {
        getBankData();
        setFieldsDisabled(true);
      }
    });
  };

  const handleBankSelect = (val) => {
    setSelectedBank(val);
  };

  const handleAutocomplete = (val) => {
    if (!val || val.length < 3) return;
    const queryParams = {
      where: {
        name: { keyword: val }
      },
      take: 5
    };
    getBanks(queryParams).then((res) => {
      if (res.data) {
        setBankOptions(res.data);
      }
    });
  };

  const handleCancel = () => {
    setFieldsDisabled(true);
  };

  useEffect(() => {
    if (patronCode) {
      getBankData();
    }
  }, [patronCode]);

  return (
    <Grid container={true} className={globalStyles.commonSpacing}>
      <Grid item={true} xs={12}>
        <Grid container={true} alignItems="center" justify="space-between">
          <Grid item={true}>
            <p>
              <b>Bank Details</b>
            </p>
          </Grid>
          <Grid item={true}>
            {!account ? (
              <Button
                variant="contained"
                className={globalStyles.primaryCTA}
                onClick={() => toggleModal(true)}
              >
                Add Bank Account
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      {account ? (
        <Grid item={true} xs={12}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Grid container={true}>
              <Grid
                item={true}
                xs={12}
                container={true}
                alignItems="flex-end"
                justify="space-between"
              >
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={styles.w100}
                    type="text"
                    name="accountHolder"
                    label="Name as per Bank account "
                    disabled={fieldsDisabled}
                    inputRef={register({ required: true })}
                  />
                </Grid>
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={styles.w100}
                    type="number"
                    name="accountNumber"
                    label="Account number"
                    disabled={fieldsDisabled}
                    inputRef={register({ required: true })}
                  />
                </Grid>
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    className={styles.w100}
                    type="text"
                    name="ifsc"
                    label="IFSC Code"
                    disabled={fieldsDisabled}
                    inputRef={register({ required: true })}
                  />
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                container={true}
                alignItems="flex-end"
                justify="space-between"
              >
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  {
                    fieldsDisabled ? (
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        className={styles.w100}
                        label="Bank Name"
                        disabled={true}
                        value={account?.bank?.name}
                      />
                    ) : (
                      <AutocompleteCustom
                        selectedOption={selectedBankDetails}
                        handleSelectedOption={(ev, val) => handleBankSelect(val)}
                        isArray={false}
                        clearOnBlur={true}
                        selector="name"
                        label="Bank Name"
                        options={bankOptions}
                        debouncedInputChange={(val) => {
                          handleAutocomplete(val);
                        }}
                      />
                    )
                  }

                </Grid>
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  <InputLabel shrink={true}>Account Type</InputLabel>
                  <Controller
                    as={
                      <Select
                        className={styles.w100}
                        name="accountType"
                        label="Account Type"
                      >
                        {bankAccountTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    }
                    name="accountType"
                    label="Account Type"
                    rules={{ required: true }}
                    disabled={fieldsDisabled}
                    control={control}
                    defaultValue=""
                  />
                </Grid>
                <Grid item={true} xs={3} className={styles.fieldItem}>
                  {accType === 'NRO Savings Account' ? (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      className={styles.w100}
                      type="text"
                      name="country"
                      label="Country"
                      disabled={fieldsDisabled}
                      inputRef={register({ required: true })}
                    />
                  ) : null}
                </Grid>
              </Grid>
              <Grid item={true} xs={12} container={true}>
                {fieldsDisabled ? (
                  <Grid item={true} xs={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => setFieldsDisabled(false)}
                    >
                      Edit
                    </Button>
                  </Grid>
                ) : (
                  <>
                    <Grid item={true}>
                      <Button type="button" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item={true}>
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      ) : (
        <p>No Bank Accounts Available</p>
      )}
      {shaowModal ? (
        <DialogComponent
          title="Add Bank Account"
          closeButton={true}
          onClose={() => toggleModal(false)}
        >
          <AddBankAccount
            patronCode={patronCode}
            onClose={(val) => {
              toggleModal(false);
              if (val) getBankData();
            }}
          />
        </DialogComponent>
      ) : null}
    </Grid>
  );
};

export default PatronBanking;
