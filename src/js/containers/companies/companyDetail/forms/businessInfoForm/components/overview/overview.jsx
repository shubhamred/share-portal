import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { Grid, SnackbarContent, Snackbar } from '@material-ui/core';
import {
  DatePickerNew,
  Input,
  Button,
  DialogComponent
} from 'app/components';
import styles from './styles.scss';

// eslint-disable-next-line react/no-multi-comp
const Overview = (props) => {
  // eslint-disable-next-line no-unused-vars
  const {
    handleSubmit,
    initialValues,
    initialize,
    updateBusinessDetails,
    getBusinessDetails,
    brandDetail,
    businessDetailsUpdate,
    getApplicantList,
    clearValues,
    clearUpdateStatus,
    messageType,
    clearError,
    entityType
  } = props;
  // console.log(props);

  const [disabledMode, setDisabledMode] = useState(true);

  const [openAlert, setOpenAlert] = useState(false);

  const handleFormSubmit = (values) => {
    updateBusinessDetails(values, brandDetail?.company?.id || brandDetail.id);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
    setDisabledMode(true);
  };

  useEffect(() => {
    if (clearValues) clearValues();
    if (getBusinessDetails && brandDetail && brandDetail.id) getBusinessDetails(brandDetail.id);
    if (getApplicantList && brandDetail && brandDetail.company) getApplicantList(brandDetail.id);
  }, [brandDetail]);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.fieldRowContainer}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="brandName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label={`${entityType} name`}
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
                name="legalName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label={`${entityType} legal name`}
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
                name="dateOfIncorportation"
                disabled={disabledMode}
                component={DatePickerNew}
                inputType="text"
                placeholder="Select date"
                label="Date of Incorporation"
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
                name="businessPAN"
                isFieldValue={true}
                disabled={disabledMode}
                component={Input}
                inputType="text"
                label={`${entityType} PAN`}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer2}>
            <Grid
              className={styles.formLabelStyle}
              item={true}
              xs={12}
              sm={6}
              md={3}
            >
              <Field
                name="legalConstitution"
                isFieldValue={true}
                disabled={true}
                component={Input}
                inputType="text"
                label="Entity Type"
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
                name="cin"
                isFieldValue={true}
                disabled={disabledMode}
                component={Input}
                inputType="text"
                label="CIN"
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
                name="websiteUrl"
                isFieldValue={true}
                disabled={disabledMode}
                component={Input}
                inputType="text"
                label="Website"
              />
            </Grid>
          </div>
          {/* <Divider width="100%" style={{ marginBottom: '2rem' }} /> */}
          {/* <Grid item={true} xs={12}>
            <p style={{ color: 'rgba(33, 37, 25, 0.7)' }}>
              Authorised Signatory Details
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
                name="workEmail"
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
                name="mobile"
                component={PhoneInput}
                disabled={disabledMode}
                country="IN"
                isFieldValue={true}
                label="Mobile Number"
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
                name="businessPAN"
                isFieldValue={true}
                disabled={disabledMode}
                component={Input}
                inputType="text"
                label="PAN Number"
              />
            </Grid>
          </div> */}
          <Grid container={true} xs={12} justify="flex-start">
            {disabledMode && (
              <Grid className={styles.formLabelStyle} item={true}>
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
                <Grid className={styles.formLabelStyle} item={true}>
                  <Button
                    type={disabledMode ? 'button' : 'submit'}
                    label="Save"
                    style={{ marginRight: '20px' }}
                  />
                </Grid>
                <Grid className={styles.formLabelStyle} item={true}>
                  <Button
                    style={{ backgroundColor: 'white', color: '#5A74ED' }}
                    type="button"
                    label="Discard"
                    onClick={() => {
                      initialize(initialValues);
                      setDisabledMode(true);
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Grid>
      {businessDetailsUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {businessDetailsUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}>
                  <CheckCircleIcon style={{ fill: 'green' }} />
                </div>
              </div>
            )}
            {businessDetailsUpdate === 'failed' && (
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
      <Snackbar
        open={Boolean(messageType)}
        onClose={() => clearError()}
        autoHideDuration={2000}
        transitionDuration={0}
      >
        <SnackbarContent
          message={
            (messageType === 'success' && 'Fetching Initiated')
            || (messageType === 'error'
              && 'Something went wrong. Please try again')
          }
          style={{
            backgroundColor:
              (messageType === 'success' && '#4caf50')
              || (messageType === 'error' && '#f44336')
          }}
        />
      </Snackbar>
    </Grid>
  );
};

Overview.propTypes = {
  brandDetail: PropTypes.shape(),
  clearUpdateStatus: PropTypes.func,
  businessDetailsUpdate: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialize: PropTypes.func,
  updateBusinessDetails: PropTypes.func,
  getBusinessDetails: PropTypes.func,
  initialValues: PropTypes.shape({}),
  formData: PropTypes.shape({}),
  messageType: PropTypes.string,
  clearError: PropTypes.func
};

Overview.defaultProps = {
  brandDetail: {},
  clearUpdateStatus: () => {},
  businessDetailsUpdate: null,
  handleSubmit: () => {},
  initialize: () => {},
  updateBusinessDetails: () => {},
  getBusinessDetails: () => {},
  initialValues: {},
  formData: {},
  messageType: '',
  clearError: () => {}
};

export default Overview;
