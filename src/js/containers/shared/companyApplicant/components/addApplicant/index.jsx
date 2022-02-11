/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { AutocompleteCustom } from 'app/components';
import PhoneInput from 'react-phone-number-input';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getPatrons } from 'app/containers/patrons/saga';
import { linkTeamToCompany } from 'app/containers/companies/saga';
import { customerCompanyAssociationTypes } from 'app/constants/misc';
import styles from '../../style.scss';

const AddApplicant = (props) => {
  const dispatch = useDispatch();
  const { companyId, onClose } = props;
  const { register, handleSubmit, control, errors, setValue, reset, setError } = useForm();
  const [selectedCustomerDetails, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [disabledFields, setFieldsDisabled] = useState(false);

  const onSubmit = (data) => {
    let payload = {};
    if (!disabledFields) {
      if (!data.pan) {
        setError('pan', { shouldFocus: true, message: 'Required' });
      } else {
        payload = {
          name: data.name,
          email: inputVal,
          mobile: data.mobile,
          pan: data.pan
        };
        formSubmit({ customer: payload, associationType: data.association });
      }
    } else {
      payload = {
        customerId: selectedCustomerDetails.id,
        associationType: data.association
      };
      formSubmit(payload);
    }
  };

  const formSubmit = (payload) => {
    linkTeamToCompany(companyId, payload).then((res) => {
      if (res.data) {
        onClose();
      } else if (res.statusCode === 409) {
        const msg = res.message?.message || 'Something Went Wrong';
        dispatch({
          type: 'show',
          payload: msg,
          msgType: 'error'
        });
      }
    });
  };

  const handleCustomerSelect = (newVal) => {
    setSelectedCustomer(newVal);
    if (newVal === null) {
      setFieldsDisabled(false);
      reset();
    }
    if (newVal) {
      setValue('name', newVal.name, { shouldDirty: true, shouldValidate: false });
      setValue('mobile', newVal.mobile, { shouldDirty: true, shouldValidate: false });
      setValue('pan', newVal.pan, { shouldDirty: true, shouldValidate: false });
      setFieldsDisabled(true);
    }
  };

  const handleAutocomplete = (val) => {
    if (!val || val.length < 3) return;
    const customerQueryParams = {
      where: { email: { keyword: val }, isPatron: true },
      take: 5
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomerOptions(res.data);
    });
  };

  return (
    <Grid container={true}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <InputLabel required={true} className={styles.fieldLabel}>Email</InputLabel>
          <AutocompleteCustom
            inputValue={inputVal}
            selectedOption={selectedCustomerDetails}
            handleSelectedOption={(ev, val) => handleCustomerSelect(val)}
            isArray={false}
            clearOnBlur={false}
            selector="email"
            options={customerOptions}
            debouncedInputChange={handleAutocomplete}
            handleInputChange={(val) => {
              setInputVal(val);
            }}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <TextField
            className={styles.w100}
            inputRef={register({ required: true })}
            type="text"
            name="name"
            label="Name"
            required={true}
            InputLabelProps={{ shrink: true }}
            disabled={disabledFields}
          />
        </Grid>
        <Grid
          item={true}
          xs={12}
          className={`${styles.fieldItem} ${styles.phoneInputWrapper} w100`}
        >
          <InputLabel required={true} className={styles.fieldLabel}>Mobile Number</InputLabel>
          <Controller
            as={
              <PhoneInput
                className={styles.w100}
                international={true}
                defaultCountry="IN"
                country="IN"
                name="mobile"
                label="mobile"
                disabled={disabledFields}
              />
            }
            name="mobile"
            country="IN"
            defaultValue=""
            rules={{ required: true }}
            control={control}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <TextField
            className={styles.w100}
            inputRef={register({
              pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/i
            })}
            disabled={disabledFields}
            InputLabelProps={{ shrink: true }}
            type="text"
            name="pan"
            label="PAN"
            required={true}
            error={errors && errors.pan}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <InputLabel required={true} className={styles.fieldLabel}>Association</InputLabel>
          <Controller
            as={
              <Select
                className={styles.w100}
                name="association"
                label="Association"
              >
                {customerCompanyAssociationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            }
            name="association"
            rules={{ required: true }}
            control={control}
            defaultValue={customerCompanyAssociationTypes[0]}
          />
        </Grid>
        <Grid item={true} className={styles.fieldItem}>
          <div className={styles.btnContainer}>
            <Button onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </div>
        </Grid>
      </form>
    </Grid>
  );
};

export default AddApplicant;
