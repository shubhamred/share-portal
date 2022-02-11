import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  Divider,
  Button as MaterialBtn,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  DatePickerNew,
  Input,
  Button,
  PhoneInput,
  DialogComponent,
  Radio
} from 'app/components';

import { useDispatch } from 'react-redux';
import { saveFundingInfo } from 'app/containers/patrons/saga';
import styles from './styles.scss';

const BasicInfoForm = (props) => {
  const dispatch = useDispatch();
  const [disabledMode, setDisabledMode] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues && initialValues.mobile
  );
  const [openAlert, setOpenAlert] = useState(false);
  const [eligibleInvestor, setEligibleInvestor] = useState(
    initialValues && initialValues.eligibleInvestor
  );
  const [nonTaxResident, setNonTaxResident] = useState(
    initialValues && initialValues.nonTaxResident
  );
  const [isAadhaarPresent, setAadhaarPresent] = useState(
    initialValues && initialValues.isAadhaarPresent
  );
  const [hasNriAccount, setHasNriAccount] = useState(
    initialValues && initialValues.hasNriAccount
  );
  const {
    handleSubmit,
    initialValues,
    initialize,
    patronDetail,
    getCustomerDetail,
    saveBasicInfo,
    formData,
    basicInfoUpdate,
    clearUpdateStatus,
    switchToDocSection
    // submitting,
    // pristine
  } = props;

  const { investorProfile } = patronDetail || {};

  const isAadhaarPresentList = ['Yes', 'No', 'Not Applicable'];
  const riskAppetiteOptions = [
    { value: 'Low', label: 'Newbie' },
    { value: 'Medium', label: 'Slightly Experienced' },
    { value: 'High', label: 'Seasoned Investor' }
  ];

  const [selectedRiskAppetite, setRiskAppetite] = useState('Low');

  useEffect(() => {
    // if (clearValues) clearValues();
    if (getCustomerDetail && patronDetail && patronDetail !== {}) {
      getCustomerDetail(patronDetail.id);
    }
    if (investorProfile && investorProfile.length) {
      const [temp] = investorProfile;
      if (temp) {
        setRiskAppetite(temp.riskAppetite);
      }
    }
    if (initialValues) initialize(initialValues);
  }, [patronDetail]);

  const handleRiskAppetiteChange = (event) => {
    setRiskAppetite(event.target.value);
  };

  const handleBasicInfoUpdate = (values) => {
    // eslint-disable-next-line no-param-reassign
    values.eligibleInvestor = values.eligibleInvestor === '' ? null : values.eligibleInvestor === 'Yes';
    // eslint-disable-next-line no-param-reassign
    values.nonTaxResident = values.nonTaxResident === '' ? null : values.nonTaxResident === 'No';
    values.hasNriAccount = values.hasNriAccount === '' ? null : values.hasNriAccount === 'Yes';

    const [temp] = investorProfile || [];
    if (temp && temp.id && selectedRiskAppetite) {
      saveFundingInfo(
        {
          ...temp,
          riskAppetite: selectedRiskAppetite,
          investmentExperience: temp.investmentExperience || 1
        },
        temp.id,
        false
      );
    }

    saveBasicInfo(values, patronDetail.id).then((res) => {
      if (res.data) {
        setDisabledMode(true);
      } else if (res.statusCode === 409) {
        dispatch({
          type: 'show',
          payload: res.message,
          msgType: 'error'
        });
      }
    });
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
  };

  useEffect(() => {
    // if (clearValues) clearValues();
    if (initialValues) initialize(initialValues);
  }, [formData]);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(handleBasicInfoUpdate)}
        >
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="firstName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="First name"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="middleName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Middle name"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="lastName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Last name"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="mobile"
                component={PhoneInput}
                label="Mobile"
                country="IN"
                disabled={disabledMode}
                onChange={setPhoneNumber}
                placeholder="Mobile"
                propValue={
                  phoneNumber || (initialValues && initialValues.mobile)
                }
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="email"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="email"
                label="Email"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="linkedInUrl"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="LinkedIn URL"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="employerName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Employer Name"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="designation"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Designation"
              />
            </Grid>
            {investorProfile && investorProfile.length ? (
              <Grid
                className={styles.formLabelStyle}
                item={true}
                xs={12}
                sm={6}
                md={3}
              >
                <InputLabel id="riskAppetite-select-label">
                  Risk Appetite
                </InputLabel>
                <Select
                  labelId="riskAppetite-select-label"
                  id="riskAppetite-select"
                  disabled={disabledMode}
                  value={selectedRiskAppetite}
                  onChange={handleRiskAppetiteChange}
                  style={{ minWidth: '200px', marginTop: '7px' }}
                >
                  {riskAppetiteOptions.map((item) => (
                    <MenuItem value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </Grid>
            ) : null}
          </div>
          <Grid item={true} xs={12} style={{ marginBottom: '2rem' }}>
            <Divider width="100%" />
          </Grid>
          <Grid item={true} xs={12}>
            <p>
              <b>KYC Details</b>
            </p>
          </Grid>
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="fatherOrSpouseName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Father or Spouse Name"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="dateOfBirth"
                component={DatePickerNew}
                disabled={disabledMode}
                label="Date of Birth"
                disableFuture={true}
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="panNumber"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="PAN Number"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="nonTaxResident"
                component={Radio}
                disabled={disabledMode}
                selected={nonTaxResident}
                options={['Yes', 'No']}
                label="Tax Resident of India"
                handleChange={(value) => {
                  setNonTaxResident(value);
                }}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer} style={{ display: 'none' }}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={5}
            >
              <Field
                name="isAadhaarPresent"
                component={Radio}
                handleChange={(value) => {
                  setAadhaarPresent(value);
                }}
                disabled={disabledMode}
                selected={isAadhaarPresent}
                options={isAadhaarPresentList}
                label="Is Aadhaar Present"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="eligibleInvestor"
                component={Radio}
                handleChange={(value) => {
                  setEligibleInvestor(value);
                }}
                disabled={disabledMode}
                selected={eligibleInvestor}
                options={['Yes', 'No']}
                label="Eligible Investor"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="hasNriAccount"
                component={Radio}
                handleChange={(value) => {
                  setHasNriAccount(value);
                }}
                disabled={disabledMode}
                selected={hasNriAccount}
                options={['Yes', 'No']}
                label="Has Nri Account"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="country"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Country"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="tin"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Tin"
              />
            </Grid>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="birthPlace"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Birth Place"
              />
            </Grid>
          </div>

          <Grid container={true} xs={3} justify="space-between">
            {disabledMode && (
              <Grid item={true}>
                <Button
                  style={{ backgroundColor: 'white', color: '#5A74ED' }}
                  type="button"
                  label="Edit"
                  onClick={() => setDisabledMode(false)}
                />
              </Grid>
            )}
            {!disabledMode && (
              <>
                <Grid item={true}>
                  <Button
                    type="submit"
                    label="Save"
                    style={{ marginRight: '8px' }}
                  />
                </Grid>
                <Grid item={true}>
                  <Button
                    type="button"
                    style={{ backgroundColor: 'white', color: '#5A74ED' }}
                    label="Discard"
                    onClick={() => {
                      initialize(initialValues);
                      setPhoneNumber(initialValues.mobile);
                      setDisabledMode(true);
                      if (investorProfile && investorProfile?.length) {
                        setRiskAppetite(investorProfile[0].riskAppetite);
                      }
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </form>
        <Grid item={true} style={{ marginTop: '1.5rem' }}>
          <MaterialBtn
            onClick={switchToDocSection}
            color="primary"
            endIcon={<ArrowForwardIcon />}
          >
            KYC Documents
          </MaterialBtn>
        </Grid>
      </Grid>
      {basicInfoUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {basicInfoUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}>
                  <CheckCircleIcon style={{ fill: 'green' }} />
                </div>
              </div>
            )}
            {basicInfoUpdate === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Save failed</div>
                <div className={styles.messageIcon}>
                  <ErrorIcon style={{ fill: 'red' }} />
                </div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

BasicInfoForm.propTypes = {
  clearUpdateStatus: PropTypes.func,
  basicInfoUpdate: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialize: PropTypes.func,
  initialValues: PropTypes.shape({
    mobile: PropTypes.string
  }),
  patronDetail: PropTypes.shape({
    customer: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  getCustomerDetail: PropTypes.func,
  saveBasicInfo: PropTypes.func,
  formData: PropTypes.shape({})
  // submitting: PropTypes.bool,
  // pristine: PropTypes.bool
};

BasicInfoForm.defaultProps = {
  clearUpdateStatus: () => {},
  basicInfoUpdate: null,
  handleSubmit: () => {},
  initialize: () => {},
  initialValues: {},
  patronDetail: null,
  getCustomerDetail: () => {},
  saveBasicInfo: () => {},
  formData: null
  // submitting: false,
  // pristine: false
};

export default BasicInfoForm;
