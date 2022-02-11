import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Input, PhoneInput, Button, Radio, AdornmentInput,
  DatePickerNew, DialogComponent, DropDown } from 'app/components';
import styles from './styles.scss';

const ApplicantForm = (props) => {
  const { submitApplicantInfo, handleSubmit, selectedApplicant, initialize, initialValues,
    applicantDetailsUpdate, companyId, applicantInfo, clearUpdateStatus } = props;
  const [disabled, setDisabled] = useState(true);
  const [selectedGender, setSelectedGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedLoginMethod, setSelectedLoginMethod] = useState('');

  const mobileValue = initialValues && initialValues.primaryNumber;

  const loginMethodList = ['Google', 'LinkedIn', 'Creds'];
  // useEffect(() => {
  //   if (getCustomerInfo && selectedApplicant.id) {
  //     getCustomerInfo(selectedApplicant.id);
  //   }
  // }, [selectedApplicant]);

  useEffect(() => {
    if (initialValues && applicantInfo && applicantInfo.customer.id === selectedApplicant.id) initialize(initialValues);
  }, []);

  const handleFormSubmit = (values) => {
    submitApplicantInfo(values, companyId, selectedApplicant.id, (phoneNumber || mobileValue), selectedGender);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
    setDisabled(true);
  };

  const genderList = ['Male', 'Female', 'Other', 'Prefer Not to Disclose'];
  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="firstName"
                label="First Name"
                component={Input}
                disabled={disabled}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="middleName"
                label="Middle Name"
                component={Input}
                disabled={disabled}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="lastName"
                label="Last Name"
                component={Input}
                disabled={disabled}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="primaryEmail"
                label="Primary Email"
                component={Input}
                disabled={disabled}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="primaryNumber"
                label="Primary Number"
                component={PhoneInput}
                disabled={disabled}
                onChange={(value) => { setPhoneNumber(value); }}
                propValue={mobileValue}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="PAN"
                label="PAN No."
                component={Input}
                disabled={disabled}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="DOB"
                label="Date of Birth"
                placeholder="Select date"
                component={DatePickerNew}
                disabled={disabled}
                disableFuture={true}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={6}>
              <Field
                name="gender"
                component={Radio}
                handleChange={(value) => {
                  setSelectedGender(value);
                }}
                disabled={disabled}
                selected={selectedGender}
                label="Gender"
                options={genderList}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="loginCred"
                component={DropDown}
                placeholder="Choose login"
                disabled={disabled}
                options={loginMethodList}
                selectedOption={selectedLoginMethod}
                handleSelectedOption={(value) => {
                  setSelectedLoginMethod(value);
                }}
                label="Login"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="linkedInUrl"
                label="LinkedIn URL"
                component={Input}
                disabled={disabled}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="DIN"
                label="DIN"
                component={Input}
                disabled={disabled}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={6} sm={3}>
              <Field
                name="shareholding"
                label="Shareholding %"
                component={AdornmentInput}
                disabled={disabled}
              />
            </Grid>
          </div>
          <Grid container={true} justify="flex-start">
            <Grid container={true} item={true}>
              {disabled && (
                <Grid className={styles.formLabelStyle} item={true}>
                  <Button
                    style={{ backgroundColor: 'white', color: '#5A74ED' }}
                    type="button"
                    label="Edit"
                    onClick={() => { setDisabled(false); }}
                  />
                </Grid>
              )}
              {!disabled && (
                <>
                  <Grid className={styles.formLabelStyle} item={true}>
                    <Button type="submit" label="Save" />
                  </Grid>
                  <Grid className={styles.formLabelStyle} item={true}>
                    <Button
                      style={{ marginLeft: 50, backgroundColor: 'white', color: '#5A74ED' }}
                      type="button"
                      label="Discard"
                      onClick={() => {
                        initialize(initialValues);
                        setDisabled(true);
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
      {applicantDetailsUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {applicantDetailsUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {applicantDetailsUpdate === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Save failed</div>
                <div className={styles.messageIcon}><ErrorIcon style={{ fill: 'red' }} /></div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};
ApplicantForm.propTypes = {
  clearUpdateStatus: PropTypes.func,
  applicantDetailsUpdate: PropTypes.string,
  submitApplicantInfo: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedApplicant: PropTypes.shape(),
  initialValues: PropTypes.shape(),
  companyId: PropTypes.string,
  initialize: PropTypes.func.isRequired
};

ApplicantForm.defaultProps = {
  clearUpdateStatus: () => { },
  applicantDetailsUpdate: null,
  selectedApplicant: {
    id: '',
    name: ''
  },
  initialValues: {},
  companyId: ''
};

export default ApplicantForm;
