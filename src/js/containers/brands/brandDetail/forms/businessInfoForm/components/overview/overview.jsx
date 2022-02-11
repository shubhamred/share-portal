/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { Grid, SnackbarContent, Snackbar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DatePickerNew, Input, DropDown, CheckBox, Button, DialogComponent } from 'app/components';
import { sectorOfChoices } from 'app/constants/misc';
import styles from './styles.scss';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  }
}));

// eslint-disable-next-line react/no-multi-comp
const Overview = (props) => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { handleSubmit, initialValues, initialize, updateBusinessDetails, formData,
    getBusinessDetails, brandDetail, businessDetailsUpdate, getApplicantList, clearValues,
    clearUpdateStatus, updateFinancials, messageType, clearError } = props;

  const [disabledMode, setDisabledMode] = useState(true);
  const [selectedConstitution, setSelectedConstitution] = useState('Private Limited');
  const [openAlert, setOpenAlert] = useState(false);
  const [otherSectors, setOtherSectors] = useState(false);
  const [isRequestExpired, setisRequestExpired] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const constitutionList = ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited'];

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // console.log({ anchorEl, open });

  const handleSectorsOfChoice = (checkedArray) => {
    if (checkedArray.includes('Other')) setOtherSectors(true);
    if (!checkedArray.includes('Other')) setOtherSectors(false);
  };

  const handleFormSubmit = (values) => {
    updateBusinessDetails(values, brandDetail.company.id);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
    setDisabledMode(true);
  };

  useEffect(() => {
    if (clearValues) clearValues();
    if (getBusinessDetails && brandDetail && brandDetail.company) getBusinessDetails(brandDetail.company.id);
    if (getApplicantList && brandDetail && brandDetail.company) getApplicantList(brandDetail.company.id);
  }, [brandDetail]);

  useEffect(() => {
    if (initialValues) initialize(initialValues);
    handleSectorsOfChoice(initialValues.operatingSectors);
  }, [formData]);

  useEffect(() => {
    if (initialValues && initialValues.brandName) {
      setisRequestExpired(checkForRequestExpiration());
    }
  }, [formData]);

  const checkForRequestExpiration = () => {
    if (initialValues.financialRequestStatus === 'In Progress' && initialValues.lastFinancialRequestAt) {
      const currentTime = new Date().getTime();
      const lastFinancialRequestAt = new Date(initialValues.lastFinancialRequestAt).getTime();
      const timeDifference = Math.abs(currentTime - lastFinancialRequestAt) / 36e5;
      return !(timeDifference < 6);
    } if (initialValues.financialRequestStatus === 'Success') {
      return false;
    } if (!initialValues.financialRequestStatus) {
      return true;
    }
    return true;
  };

  const financialStatus = ['In Progress', 'Success', 'Failure'];

  const isFinancialRequestIsMade = financialStatus.includes(initialValues.financialRequestStatus);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
          <Input
            disabled={true}
            inputType="text"
            propValue={brandDetail?.company?.companyCode || ''}
            label="Brand Code"
          />
        </Grid>
      </Grid>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="brandName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Brand name"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="workEmail"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Email"
              />
            </Grid>
            <Grid item={true} xs={12} sm={6} md={3} className={styles.formLabelStyle}>
              <Field
                name="companyLogo"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Company Logo"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={9}>
              <Field
                name="description"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Description"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="websiteUrl"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Website URL"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="legalName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Legal name"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3} />
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="legalConstitution"
                disabled={disabledMode}
                component={DropDown}
                options={constitutionList}
                selectedOption={selectedConstitution}
                label="Legal Constitution"
                handleSelectedOption={(value) => {
                  setSelectedConstitution(value);
                }}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="dateOfIncorportation"
                disabled={disabledMode}
                component={DatePickerNew}
                placeholder="Select date"
                label="Date of Incorporation"
                disableFuture={true}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="businessPAN"
                isFieldValue={true}
                disabled={isFinancialRequestIsMade || disabledMode}
                component={Input}
                inputType="text"
                label="Business PAN Number"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={4}>
              <Grid container={true} alignItems="center">
                <Grid item={true} xs={10}>
                  <Field
                    name="cin"
                    component={Input}
                    disabled={isFinancialRequestIsMade || disabledMode}
                    isFieldValue={true}
                    inputType="text"
                    label="CIN/LLPIN"
                  />
                </Grid>
                {
                  initialValues.financialRequestStatus === 'In Progress' ? (
                    <Grid
                      item={true}
                      xs={2}
                      onMouseLeave={handlePopoverClose}
                      aria-owns={open ? 'mouse-over-popover' : undefined}
                      aria-haspopup="true"
                    >
                      <IconButton
                        onMouseEnter={handlePopoverOpen}
                      >
                        <img src="/assets/pending_state.svg" alt="state" />
                      </IconButton>
                      <Popover
                        id="mouse-over-popover"
                        className={classes.popover}
                        classes={{
                          paper: classes.paper
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus={true}
                      >
                        Under verification: waiting for Probe
                      </Popover>
                    </Grid>
                  ) : initialValues.financialRequestStatus === 'Success' ? (
                    <Grid
                      item={true}
                      xs={2}
                      onMouseLeave={handlePopoverClose}
                      aria-owns={open ? 'mouse-over-popover' : undefined}
                      aria-haspopup="true"
                    >
                      <IconButton
                        onMouseEnter={handlePopoverOpen}
                      >
                        <img src="assets/ApprovedIcon.svg" alt="state" />
                      </IconButton>
                      <Popover
                        id="mouse-over-popover"
                        className={classes.popover}
                        classes={{
                          paper: classes.paper
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus={true}
                      >
                        Verified
                      </Popover>
                    </Grid>
                  ) : initialValues.financialRequestStatus === 'Failure' ? (
                    <Grid
                      item={true}
                      xs={2}
                      onMouseLeave={handlePopoverClose}
                      aria-owns={open ? 'mouse-over-popover' : undefined}
                      aria-haspopup="true"
                    >
                      <IconButton
                        onMouseEnter={handlePopoverOpen}
                      >
                        <img src="assets/error_state.svg" alt="state" height="20" width="20" />
                      </IconButton>
                      <Popover
                        id="mouse-over-popover"
                        className={classes.popover}
                        classes={{
                          paper: classes.paper
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left'
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus={true}
                      >
                        Error
                      </Popover>
                    </Grid>
                  ) : null
                }
              </Grid>
            </Grid>

            {(initialValues.cin || initialValues.businessPAN) && disabledMode && !isFinancialRequestIsMade && (
              <>
                <Grid item={true} style={{ marginTop: '0.8rem' }}>
                  <Button
                    label="Fetch Financials"
                    disabled={!isRequestExpired}
                    onClick={() => {
                      updateFinancials(brandDetail && brandDetail.company && brandDetail.company.id);
                      setisRequestExpired(false);
                    }}
                  />
                </Grid>
              </>
            )}
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <Field
                name="operatingSectors"
                label="Operating Sectors"
                component={CheckBox}
                disabled={disabledMode}
                values={sectorOfChoices}
                handleCheckBoxValue={handleSectorsOfChoice}
              />
              {otherSectors && (
                <Field
                  name="otherSectors"
                  component={Input}
                  isFieldValue={true}
                  placeholder="Please specify"
                  disabled={disabledMode}
                  inputType="text"
                />
              )}
            </Grid>
          </div>
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
                  <Button type={disabledMode ? 'button' : 'submit'} label="Save" />
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
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {businessDetailsUpdate === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Save failed</div>
                <div className={styles.messageIcon}><ErrorIcon style={{ fill: 'red' }} /></div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
      <Snackbar open={Boolean(messageType)} onClose={() => clearError()} autoHideDuration={2000} transitionDuration={0}>
        <SnackbarContent
          message={(messageType === 'success' && 'Fetching Initiated')
            || (messageType === 'error' && 'Something went wrong. Please try again')}
          style={{ backgroundColor: (messageType === 'success' && '#4caf50') || (messageType === 'error' && '#f44336') }}
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
  clearError: PropTypes.func,
  updateFinancials: PropTypes.func

};

Overview.defaultProps = {
  brandDetail: {},
  clearUpdateStatus: () => { },
  businessDetailsUpdate: null,
  handleSubmit: () => { },
  initialize: () => { },
  updateBusinessDetails: () => { },
  getBusinessDetails: () => { },
  initialValues: {},
  formData: {},
  messageType: '',
  clearError: () => { },
  updateFinancials: () => { }
};

export default Overview;
