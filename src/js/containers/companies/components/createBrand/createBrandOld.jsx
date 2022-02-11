/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Button, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { AutocompleteCustom } from 'app/components';
import { getPatrons } from 'app/containers/patrons/saga';
import { createBrand } from 'app/containers/companies/saga';
import { customerCompanyAssociationTypes } from 'app/constants/misc';
import styles from './styles.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={styles.boxContainer} p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RenderMembers = (props) => {
  const { fields, register, setValue, control } = props;

  const [selectedCustomerDetails, setSelectedCustomer] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [disabledFields, setFieldsDisabled] = useState(false);

  const handleCustomerSelect = (newVal) => {
    setSelectedCustomer(newVal);
    if (newVal === null) {
      setFieldsDisabled(false);
      // reset({
      //   'customers[0].name': '',
      //   'customers[0].id': '',
      //   'customers[0].email': '',
      //   'customers[0].mobile': '',
      //   'customers[0].pan': ''
      // });
      setValue(`customers[0].name`, '');
      setValue(`customers[0].id`, '');
      setValue(`customers[0].email`, '');
      setValue(`customers[0].mobile`, '');
      setValue(`customers[0].pan`, '');
      return;
    }
    if (newVal) {
      setFieldsDisabled(true);
      // reset({
      //   'customers[0].name': newVal.name || '',
      //   'customers[0].id': newVal.id || '',
      //   'customers[0].email': newVal.email || '',
      //   'customers[0].mobile': newVal.mobile || '',
      //   'customers[0].pan': newVal.pan || ''
      // });
      setValue(`customers[0].name`, newVal.name, {
        shouldDirty: true
      });
      setValue(`customers[0].id`, newVal.id);
      setValue(`customers[0].email`, newVal.email, {
        shouldDirty: true
      });
      setValue(`customers[0].mobile`, newVal.mobile, {
        shouldDirty: true
      });
      setValue(`customers[0].pan`, newVal.pan, { shouldDirty: true });
    }
  };

  const handleAutocomplete = (val) => {
    if (!val || val.length < 3) return;
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 5
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomerOptions(res.data);
    });
  };

  return (
    <ul className={styles.fieldArrayContainer}>
      {fields.map((member, index) => (
        <li key={member.id}>
          {/* <div className={styles.dFlex}> */}
          {/*  <h4> */}
          {/*    Person */}
          {/*  </h4> */}
          {/* </div> */}
          <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
            <AutocompleteCustom
              inputValue={inputVal}
              selectedOption={selectedCustomerDetails}
              handleSelectedOption={(ev, val) => handleCustomerSelect(val, index)}
              isArray={false}
              clearOnBlur={false}
              selector="email"
              label="Email"
              required={true}
              options={customerOptions}
              debouncedInputChange={handleAutocomplete}
              handleInputChange={(val) => {
                setInputVal(val);
                setValue(`customers[${index}].email`, val, {
                  shouldDirty: true
                });
              }}
            />
          </Grid>
          <input type="hidden" name={`customers[${index}].id`} />
          <Grid item={true} xs={12} className={styles.fieldMb}>
            <TextField
              className={styles.w100}
              label="Name"
              name={`customers[${index}].name`}
              defaultValue={`${member.name}`}
              required={true}
              disabled={disabledFields}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item={true} xs={12} className={styles.fieldMb}>
            <TextField
              className={styles.w100}
              label="Mobile"
              name={`customers[${index}].mobile`}
              defaultValue={`${member.mobile}`}
              required={true}
              disabled={disabledFields}
              inputRef={register({ required: true })}
            />
            {/* <InputLabel>Mobile Number</InputLabel> */}
            {/* <Controller */}
            {/*  as={ */}
            {/*    <PhoneInput */}
            {/*      disabled={disabledFields} */}
            {/*      className={styles.w100} */}
            {/*      country="IN" */}
            {/*      name={`customers[${index}].mobile`} */}
            {/*      label="mobile" */}
            {/*    /> */}
            {/*  } */}
            {/*  name="mobile" */}
            {/*  country="IN" */}
            {/*  defaultValue={`${member.mobile}`} */}
            {/*  rules={{ required: true }} */}
            {/*  control={control} */}
            {/* /> */}
          </Grid>

          <Grid item={true} xs={12} className={styles.fieldMb}>
            <TextField
              className={styles.w100}
              label="PAN"
              required={true}
              name={`customers[${index}].pan`}
              defaultValue={`${member.pan}`}
              disabled={disabledFields}
              inputRef={register({ pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/i })}
            />
          </Grid>
          <Grid item={true} xs={12} className={`${styles.fieldMb} w100`}>
            <InputLabel>Association</InputLabel>
            <Controller
              as={
                <Select
                  style={{ width: '100%' }}
                  name={`customers[${index}].association`}
                  label="Association"
                >
                  {customerCompanyAssociationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              }
              name={`customers[${index}].association`}
              rules={{ required: true }}
              control={control}
              defaultValue={customerCompanyAssociationTypes[0]}
            />
          </Grid>
        </li>
      ))}
    </ul>
  );
};

const CreateBrand = (props) => {
  const { onClose } = props;
  const [value, setTabValue] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    errors,
    setValue,
    trigger,
    reset
  } = useForm({
    shouldUnregister: false
  });

  const { fields, remove, insert, append } = useFieldArray({
    control,
    name: 'customers'
  });

  useEffect(() => {
    if (fields.length === 0) {
      insert(0, {
        name: '',
        email: '',
        pan: '',
        mobile: '',
        registered: 'false'
      });
    }
  }, [fields]);

  const handleChange = (newValue) => {
    trigger().then((res) => {
      if (res) {
        setTabValue(newValue);
      }
    });
  };

  const handleFormSubmit = (values) => {
    const payload = {
      businessName: values.brandName,
      legalName: values.registeredCompany || null,
      pan: values.pan || null,
      cin: values.cin || null,
      website: values.website || null,
      customers: []
    };
    const { customers } = values;
    if (customers[0].id) {
      const temp = {
        customerId: customers[0].id,
        associationType: customers[0].association
      };
      payload.customers.push(temp);
    } else {
      const temp = {
        customer: {
          name: customers[0].name,
          email: customers[0].email,
          mobile: customers[0].mobile,
          pan: customers[0].pan
        },
        associationType: customers[0].association
      };
      payload.customers.push(temp);
    }
    createBrand(payload).then((res) => {
      if (res.data) {
        onClose();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Paper square={true}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              // onChange={(e, newValue) => handleChange(newValue)}
            >
              <Tab label="Company" />
              <Tab label="Directors" />
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0}>
            <Grid container={true}>
              <Grid item={true} xs={12} className={styles.fieldMb}>
                <TextField
                  className={styles.w100}
                  label="Brand Name"
                  name="brandName"
                  required={true}
                  error={!!errors.brandName}
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item={true} xs={12} className={styles.fieldMb}>
                <TextField
                  className={styles.w100}
                  label="Registered Company Name"
                  name="registeredCompany"
                  inputRef={register()}
                />
              </Grid>
              <Grid item={true} xs={12} className={styles.fieldMb}>
                <TextField
                  className={styles.w100}
                  label="Website"
                  name="website"
                  required={true}
                  type="url"
                  error={!!errors.website}
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item={true} xs={12} className={styles.fieldMb}>
                <TextField
                  className={styles.w100}
                  label="Business PAN"
                  name="pan"
                  inputRef={register()}
                />
              </Grid>
              <Grid item={true} xs={12} className={styles.fieldMb}>
                <TextField
                  className={styles.w100}
                  label="CIN"
                  name="cin"
                  error={!!errors.cin}
                  required={true}
                  inputRef={register({ required: true })}
                />
              </Grid>
            </Grid>
            <Grid
              container={true}
              justify="flex-end"
              className={styles.btnContainer}
            >
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
          <TabPanel value={value} index={1}>
            <RenderMembers
              fields={fields}
              append={append}
              register={register}
              remove={remove}
              setValue={setValue}
              control={control}
              reset={reset}
            />

            <Grid
              container={true}
              justify="flex-end"
              className={styles.btnContainer}
            >
              <Grid item={true}>
                <Button type="button">Cancel</Button>
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
    </form>
  );
};

export default React.memo(CreateBrand);
