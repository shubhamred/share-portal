import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import { bankAccountTypes } from 'app/constants/misc';
import { AutocompleteCustom } from 'app/components';
import { getBanks } from 'app/containers/applications/saga';
import InputLabel from '@material-ui/core/InputLabel';
import { createBankAccount } from 'app/containers/patrons/saga';
import styles from '../../../styles.scss';

const AddBankAccount = (props) => {
  const { patronCode, onClose } = props;
  const { register, handleSubmit, control, watch } = useForm();
  const [selectedBankDetails, setSelectedBank] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const accType = watch('accountType');

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

  const onSubmit = (values) => {
    if (!selectedBankDetails) return;
    const payload = {
      ...values,
      bankId: selectedBankDetails.id,
      resourceCode: patronCode
    };
    createBankAccount(payload).then((res) => {
      if (res.data) {
        onClose(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Grid container={true}>
        <Grid item={true} xs={12} className={`${styles.fieldItem} ${styles.w100}`}>
          <AutocompleteCustom
            selectedOption={selectedBankDetails}
            handleSelectedOption={(ev, val) => handleBankSelect(val)}
            isArray={false}
            clearOnBlur={true}
            selector="name"
            label="Name of the Bank"
            required={true}
            options={bankOptions}
            debouncedInputChange={handleAutocomplete}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem}`}>
          <TextField
            InputLabelProps={{ shrink: true }}
            className={styles.w100}
            type="text"
            name="accountHolder"
            required={true}
            label="Name as per Bank account "
            inputRef={register({ required: true })}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem}`}>
          <TextField
            InputLabelProps={{ shrink: true }}
            className={styles.w100}
            type="number"
            name="accountNumber"
            required={true}
            label="Account number"
            inputRef={register({ required: true })}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem}`}>
          <TextField
            InputLabelProps={{ shrink: true }}
            className={styles.w100}
            type="text"
            required={true}
            name="ifsc"
            label="IFSC Code"
            inputRef={register({ required: true })}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem}`}>
          <InputLabel shrink={true} required={true}>Account Type</InputLabel>
          <Controller
            as={
              <Select
                className={styles.w100}
                name="accountType"
                label="Account Type"
                required={true}
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
            control={control}
            defaultValue=""
          />
        </Grid>
        {
          accType === 'NRO Savings Account' ? (
            <Grid item={true} xs={12} className={`${styles.fieldItem}`}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="text"
                name="country"
                required={true}
                label="Country"
                inputRef={register({ required: true })}
              />
            </Grid>
          ) : null
        }
        <Grid item={true} xs={12} container={true} alignItems="center" justify="flex-end">
          <Grid item={true}>
            <Button type="button" onClick={onClose}>Cancel</Button>
          </Grid>
          <Grid item={true}>
            <Button type="submit" color="primary" variant="contained">Submit</Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddBankAccount;
