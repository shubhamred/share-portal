import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { Button, TextField, InputLabel } from '@material-ui/core';
import { AutocompleteCustom } from 'app/components';
import { getPatrons } from 'app/containers/patrons/saga';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { validateUrl, validateEmail } from '../../../utils/utils';
import { createCompany } from '../saga';
import styles from './styles.scss';

const CreatePartner = (props) => {
  const { onClose } = props;
  const {
    register,
    handleSubmit,
    control,
    errors,
    setError,
    clearErrors,
    setValue
  } = useForm({ shouldUnregister: false });

  const [selectedCustomerDetails, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [disabledFields, setFieldsDisabled] = useState(false);

  const dispatch = useDispatch();

  const handleFormSubmit = (values) => {
    const { partner } = values;
    const { nbfcName, nbfcLegalName, nbfcWebsite, nbfcMobile, nbfcSignatoryName } = partner;
    if (!validateUrl(nbfcWebsite)) {
      setError('partner.nbfcWebsite', { type: 'invalid', message: 'Invalid url' });
      return;
    }
    if (!inputVal) {
      setError('partner.email', { type: 'invalid' });
      return;
    }
    if (!validateEmail(inputVal)) {
      setError('partner.email', { type: 'invalid', message: 'Invalid email' });
      return;
    }
    if (!isValidPhoneNumber(nbfcMobile)) {
      setError('partner.nbfcMobile', { type: 'invalid', message: 'Invalid mobile' });
      return;
    }

    const payload = {
      businessName: nbfcName || '',
      legalName: nbfcLegalName || '',
      website: nbfcWebsite || '',
      companyType: 'NBFC',
      customers: []
    };

    if (selectedCustomerDetails?.id) {
      const temp = {
        customerId: selectedCustomerDetails?.id || '',
        associationType: 'Team Member'
      };
      payload.customers.push(temp);
    } else {
      const temp = {
        associationType: 'Team Member',
        customer: {
          name: nbfcSignatoryName || '',
          mobile: nbfcMobile || '',
          email: inputVal || ''
        }
      };
      payload.customers.push(temp);
    }
    formSubmit(payload);
  };

  const formSubmit = (payload) => {
    createCompany(payload).then((res) => {
      if (res.data) {
        onClose();
      } else {
        dispatch({
          type: 'show',
          payload: res.message.message,
          msgType: 'error'
        });
      }
    });
  };

  const handleCustomerSelect = (newVal) => {
    setSelectedCustomer(newVal);
    clearErrors('partner.email');
    if (newVal === null) {
      setFieldsDisabled(false);
      setValue('partner.nbfcMobile', null);
      setValue('partner.nbfcSignatoryName', null);
      return;
    }
    if (newVal && newVal.id) {
      setFieldsDisabled(true);
      setValue('partner.nbfcMobile', newVal.mobile);
      setValue('partner.nbfcSignatoryName', newVal.name);
      setValue('partner.id', newVal.id);
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
    <Grid>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true} className={styles.createPartner} spacing={1}>
          <Grid item={true} xs={12}>
            <h4 className={styles.overView}>Overview Data</h4>
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <TextField
              className={styles.w100}
              label="NBFC Name"
              name="partner.nbfcName"
              InputLabelProps={{ shrink: true }}
              required={true}
              error={!!errors?.partner?.nbfcName}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <TextField
              className={styles.w100}
              label="NBFC Website"
              name="partner.nbfcWebsite"
              InputLabelProps={{ shrink: true }}
              required={true}
              error={!!errors?.partner?.nbfcWebsite}
              inputRef={register({ required: true })}
            />
            {errors?.partner?.nbfcWebsite && <p className={styles.error}>{errors?.partner?.nbfcWebsite.message}</p>}
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <TextField
              className={styles.w100}
              label="NBFC Legal Name"
              name="partner.nbfcLegalName"
              InputLabelProps={{ shrink: true }}
              required={true}
              error={!!errors?.partner?.nbfcLegalName}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <AutocompleteCustom
              inputValue={inputVal}
              selectedOption={selectedCustomerDetails}
              handleSelectedOption={(ev, val) => handleCustomerSelect(val)}
              isArray={false}
              clearOnBlur={false}
              selector="email"
              label="NBFC Mail Id"
              required={true}
              options={customerOptions}
              error={!!errors?.partner?.email}
              debouncedInputChange={handleAutocomplete}
              handleInputChange={(val) => {
                setInputVal(val);
                setValue(`partner.email`, val);
                clearErrors('partner.email');
              }}
              freeSolo={true}
              variant="standard"
            />
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <TextField
              className={styles.w100}
              label="NBFC Authorized Signatory Name"
              name="partner.nbfcSignatoryName"
              InputLabelProps={{ shrink: true }}
              required={true}
              error={!!errors?.partner?.nbfcSignatoryName}
              inputRef={register({ required: true })}
              disabled={disabledFields}
            />
          </Grid>
          <Grid item={true} xs={6} md={4} className={styles.formLabelStyle}>
            <InputLabel
              required={true}
              error={!!errors?.partner?.nbfcMobile}
              shrink={true}
              className={styles.fieldLabel}
            >
              NBFC Phone Number
            </InputLabel>
            <Controller
              as={
                <PhoneInput
                  className={styles.w100}
                  international={true}
                  defaultCountry="IN"
                  country="IN"
                  name="partner.nbfcMobile"
                  error={errors?.partner?.nbfcMobile ? 'Invalid Mobile' : undefined}
                  label="mobile"
                  disabled={disabledFields}
                />
              }
              name="partner.nbfcMobile"
              country="IN"
              defaultValue=""
              rules={{ required: true }}
              control={control}
            />
            {errors?.partner?.nbfcMobile && <p className={styles.error}>{errors?.partner?.nbfcMobile.message}</p>}
          </Grid>
          <Grid container={true} justify="flex-end" className={styles.btnContainer}>
            <Grid item={true}>
              <Button onClick={onClose} type="button">
                Cancel
              </Button>
            </Grid>
            <Grid item={true}>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

CreatePartner.propTypes = {
  onClose: PropTypes.func
};

CreatePartner.defaultProps = {
  onClose: () => {}
};

export default CreatePartner;
