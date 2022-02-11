/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, InputLabel, MenuItem, Select, Tab, TextField, NativeSelect } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { AutocompleteCustom } from 'app/components';
import { customerCompanyAssociationTypes } from 'app/constants/misc';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Paper from '@material-ui/core/Paper';
import { getPatrons } from 'app/containers/patrons/saga';
import { createBrand } from 'app/containers/companies/saga';
import { EntityTypes } from 'app/utils/enums';
import styles from './styles.scss';

const CreateBrand = (props) => {
  const { onClose } = props;
  const [value, setTabValue] = useState(0);
  const [selectedCustomerDetails, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [companyData, setCompanyData] = useState('');
  const [disabledFields, setFieldsDisabled] = useState(false);
  const [selectedEntityType, setselectedEntityType] = useState('');
  const [entityError, setEntityError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    errors,
    setValue,
    trigger,
    setError,
    clearErrors,
    reset,
    getValues
  } = useForm({ shouldUnregister: false });

  const statusList = Object.values(EntityTypes);

  const handleChange = (newValue) => {
    trigger().then((res) => {
      if (!selectedEntityType) {
        setEntityError('Please select entity type');
        return;
      }
      if (res) {
        const data = getValues();
        // console.log({ data, companyData });
        setCompanyData(data);
        setTabValue(newValue);
      }
    });
  };

  const handleCustomerSelect = (newVal) => {
    setSelectedCustomer(newVal);
    clearErrors('customer.email');
    if (newVal === null) {
      setFieldsDisabled(false);
      reset({
        'customer.firstName': null,
        'customer.lastName': null,
        'customer.email': null,
        'customer.mobile': null,
        'customer.pan': null
      });
      return;
    }
    if (newVal) {
      setFieldsDisabled(true);
      reset({
        'customer.firstName': newVal.firstName || null,
        'customer.lastName': newVal.lastName || null,
        'customer.name': `${newVal.firstName} ${newVal.lastName}` || null,
        'customer.id': newVal.id || null,
        'customer.email': newVal.email || null,
        'customer.mobile': newVal.mobile || null,
        'customer.pan': newVal.pan || null
      });
    }
  };

  const handleFormSubmit = (values) => {
    const { customer, customerCompany } = values;
    const { company } = companyData;
    if (!isValidPhoneNumber(customer.mobile)) {
      setError('customer.mobile', { type: 'invalid' });
    } else {
      const payload = {
        businessName: company?.businessName || '',
        legalName: company?.legalName || '',
        pan: company?.pan || null,
        legalConstitution: selectedEntityType,
        customers: []
      };
      if (selectedCustomerDetails?.id) {
        const temp = {
          customerId: selectedCustomerDetails?.id || '',
          associationType: customerCompany?.associationType || ''
        };
        payload.customers.push(temp);
      } else {
        if (!inputVal) {
          setError('customer.email', { type: 'invalid' });
          return;
        }
        const temp = {
          customer: {
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            pan: customer?.pan || null
          },
          associationType: customerCompany?.associationType || ''
        };
        payload.customers.push(temp);
      }
      formSubmit(payload);
    }
  };

  const formSubmit = (payload) => {
    createBrand(payload).then((res) => {
      if (res.data) {
        onClose();
      }
    });
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

  const handleTabChange = (event, newVal) => {
    if (newVal === 0) {
      setTabValue(newVal);
    }
    trigger().then((res) => {
      if (res) {
        const data = getValues();
        if (newVal === 0 && Object.keys(companyData?.company).length) {
          Object.keys(companyData.company).map((key) => setValue(`company.${key}`, companyData.company[key]));
        }
        setCompanyData(data);
        setTabValue(newVal);
      }
    });
  };

  return (
    <Grid className={styles.inviteForm}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <TabContext value={value}>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <Paper square={true}>
                <TabList
                  onChange={handleTabChange}
                  value={value}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Entity" />
                  <Tab label="Directors" />
                </TabList>
              </Paper>
              <TabPanel value={0}>
                <Grid container={true}>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <TextField
                      className={styles.w100}
                      label="Entity Name"
                      name="company.businessName"
                      InputLabelProps={{ shrink: true }}
                      required={true}
                      error={!!errors?.company?.businessName}
                      inputRef={register({ required: true })}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <TextField
                      className={styles.w100}
                      label="Registered Company Name"
                      InputLabelProps={{ shrink: true }}
                      name="company.legalName"
                      inputRef={register()}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <InputLabel
                      htmlFor="demo-customized-select-native"
                      required={true}
                      error={entityError}
                      shrink={true}
                    >
                      Entity type
                    </InputLabel>
                    <NativeSelect
                      id="demo-customized-select-native"
                      value={selectedEntityType}
                      style={{ padding: '6px 0px', width: '100%' }}
                      onChange={({ target }) => {
                        setselectedEntityType(target.value);
                      }}
                      error={entityError}
                    >
                      <option value="">Select entity type</option>
                      {statusList?.map((status) => (
                        <option value={status}>{status}</option>
                      ))}
                    </NativeSelect>
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <TextField
                      className={styles.w100}
                      label="Business PAN"
                      InputLabelProps={{ shrink: true }}
                      name="company.pan"
                      inputRef={register()}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} justify="flex-end" className={styles.btnContainer}>
                  <Grid item={true}>
                    <Button onClick={onClose} type="button">
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item={true}>
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={() => handleChange(1)}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={1}>
                <Grid container={true}>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <AutocompleteCustom
                      inputValue={inputVal}
                      selectedOption={selectedCustomerDetails}
                      handleSelectedOption={(ev, val) => handleCustomerSelect(val)}
                      isArray={false}
                      clearOnBlur={false}
                      selector="email"
                      label="Email"
                      required={true}
                      options={customerOptions}
                      error={!!errors?.customer?.email}
                      debouncedInputChange={handleAutocomplete}
                      handleInputChange={(val) => {
                        setInputVal(val);
                        setValue(`customer.email`, val);
                        clearErrors('customer.email');
                      }}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <TextField
                      className={styles.w100}
                      label="Name"
                      required={true}
                      name="customer.name"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors?.customer?.name}
                      disabled={disabledFields}
                      inputRef={register({ required: true })}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <InputLabel
                      required={true}
                      error={!!errors?.customer?.mobile}
                      shrink={true}
                      className={styles.fieldLabel}
                    >
                      Mobile Number
                    </InputLabel>
                    <Controller
                      as={
                        <PhoneInput
                          className={styles.w100}
                          international={true}
                          defaultCountry="IN"
                          country="IN"
                          name="customer.mobile"
                          error={errors?.customer?.mobile ? 'Invalid Mobile' : undefined}
                          label="mobile"
                          disabled={disabledFields}
                        />
                      }
                      name="customer.mobile"
                      country="IN"
                      defaultValue=""
                      rules={{ required: true }}
                      control={control}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <TextField
                      className={styles.w100}
                      label="PAN"
                      InputLabelProps={{ shrink: true }}
                      name="customer.pan"
                      error={!!errors?.customer?.pan}
                      disabled={disabledFields}
                      inputRef={register()}
                    />
                  </Grid>
                  <Grid item={true} xs={12} className={styles.formLabelStyle}>
                    <InputLabel required={true}>Association</InputLabel>
                    <Controller
                      as={
                        <Select
                          style={{ width: '100%' }}
                          name="customerCompany.associationType"
                          label="Association"
                        >
                          {customerCompanyAssociationTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      }
                      name="customerCompany.associationType"
                      rules={{ required: true }}
                      control={control}
                      defaultValue={customerCompanyAssociationTypes[0]}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} justify="flex-end" className={styles.btnContainer}>
                  <Grid item={true}>
                    <Button type="button" onClick={onClose}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item={true}>
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </form>
    </Grid>
  );
};

CreateBrand.propTypes = {
  onClose: PropTypes.func
};

CreateBrand.defaultProps = {
  onClose: () => {}
};

export default CreateBrand;
