import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { isEmpty } from 'lodash';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
  Input, NumberField, Button, CheckBox, Radio,
  AdornmentInput, TextArea, DialogComponent
} from 'app/components';

import { getParameterValuesFromHash } from 'app/utils/utils';
import styles from './styles.scss';
import globalStyles from '../../../../global.scss';

const FundingInfoForm = (props) => {
  const { handleSubmit, initialValues, initialize, submitPerformanceInfo, getPerformanceDetail, formData,
    performanceInfoUpdate, clearUpdateStatus } = props;
  const [disabledMode, setDisabledMode] = useState(true);
  const paramValues = getParameterValuesFromHash('/brands/:brandId');
  const { brandId } = paramValues;
  const [openAlert, setOpenAlert] = useState(false);
  // pos machine availability
  const [posMachineAvailability, selectedPOSMachineAvailability] = useState('');

  // channels of sale
  const channelList = [{ label: 'Offline', name: 'Offline' },
    { label: 'Online', name: 'Online' }];
  const [online, setOnline] = useState(false);
  const handleChannelsOfSale = (checkedArray) => {
    if (checkedArray.includes('Online')) setOnline(true);
    if (!checkedArray.includes('Online')) setOnline(false);
  };

  // online platforms of sale
  const onlinePlatformList = [{ label: 'Amazon', name: 'Amazon' },
    { label: 'Flipkart', name: 'Flipkart' }, { label: 'Swiggy', name: 'Swiggy' },
    { label: 'Zomato', name: 'Zomato' }, { label: 'PayTm', name: 'PayTm' }, { label: 'Snapdeal', name: 'Snapdeal' }];

  // pos machine list
  const posMachineList = [{ label: 'Pine Labs', name: 'Pine Labs' },
    { label: 'MSwipe', name: 'MSwipe' }, { label: 'BharatPe', name: 'BharatPe' },
    { label: 'India Transact', name: 'India Transact' }, { label: 'Other', name: 'Other' }];
  const [otherPOSMachines, setOtherPOSMachines] = useState(false);
  const handleOtherPOSMachines = (checkedArray) => {
    if (checkedArray.includes('Other')) setOtherPOSMachines(true);
    if (!checkedArray.includes('Other')) setOtherPOSMachines(false);
  };
  // list of locations
  const locationList = [{ label: 'Bengaluru', name: 'Bengaluru' },
    { label: 'Delhi NCR', name: 'Delhi NCR' }, { label: 'Mumbai', name: 'Mumbai' },
    { label: 'Hyderabad', name: 'Hyderabad' }, { label: 'Kolkata', name: 'Kolkata' },
    { label: 'Chennai', name: 'Chennai' }, { label: 'Pune', name: 'Pune' },
    { label: 'Jaipur', name: 'Jaipur' }, { label: 'Surat', name: 'Surat' },
    { label: 'Lucknow', name: 'Lucknow' }, { label: 'Chandigarh', name: 'Chandigarh' },
    { label: 'Ahmedabad', name: 'Ahmedabad' }, { label: 'Other', name: 'Other' }];
  const [otherLocation, setOtherLocation] = useState(false);
  const handleOtherLocation = (checkedArray) => {
    if (checkedArray.includes('Other')) setOtherLocation(true);
    if (!checkedArray.includes('Other')) setOtherLocation(false);
  };
  // payment gateway list
  const paymentGateWayList = [{ label: 'RazorPay', name: 'RazorPay' },
    { label: 'PayTm', name: 'PayTm' }, { label: 'EBS', name: 'EBS' },
    { label: 'Cashfree', name: 'Cashfree' }, { label: 'Other', name: 'Other' }];
  const [otherPaymentGateWay, setOtherPaymentGateWay] = useState(false);
  const handleOtherPaymentGateways = (checkedArray) => {
    if (checkedArray.includes('Other')) setOtherPaymentGateWay(true);
    if (!checkedArray.includes('Other')) setOtherPaymentGateWay(false);
  };
  useEffect(() => {
    // if (clearValues) clearValues();
    if (getPerformanceDetail) getPerformanceDetail(brandId);
  }, []);
  useEffect(() => {
    // if (clearValues) clearValues();
    if (!isEmpty(initialValues && initialValues.posMachineAvailability && initialValues.posMachines)) {
      initialize(initialValues);
      selectedPOSMachineAvailability(initialValues.posMachineAvailability);
      handleOtherPOSMachines(initialValues.posMachines);
      handleOtherLocation(initialValues.geographicalPresence);
      handleOtherPaymentGateways(initialValues.paymentGateWayList);
    }
  }, [formData]);

  const handleFormSubmit = (values) => {
    submitPerformanceInfo(values, brandId);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
    setDisabledMode(true);
  };

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true} className={globalStyles.commonSpacing}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={3} md={3}>
              <Field
                name="channelsOfSale"
                label="Channels of Sale"
                component={CheckBox}
                disabled={disabledMode}
                values={channelList}
                handleCheckBoxValue={handleChannelsOfSale}
              />
            </Grid>
            {online && (
              <Grid className={styles.formLabelStyle} item={true} xs={12} sm={7} md={7}>
                <Field
                  name="platformsOfSale"
                  label="Platforms of Sale"
                  component={CheckBox}
                  disabled={disabledMode}
                  values={onlinePlatformList}
                // handleCheckBoxValue={handleSectorsOfChoice}
                />
              </Grid>
            )}
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={3} md={3}>
              <Field
                name="posMachineAvailability"
                component={Radio}
                handleChange={(value) => {
                  selectedPOSMachineAvailability(value);
                }}
                disabled={disabledMode}
                selected={posMachineAvailability}
                label="POS Machines"
                options={['Yes', 'No']}
              />
            </Grid>
            {posMachineAvailability === 'Yes' && (
              <Grid className={styles.formLabelStyle} item={true} xs={12} sm={7} md={7}>
                <Field
                  name="posMachines"
                  label="POS Machines"
                  component={CheckBox}
                  disabled={disabledMode}
                  values={posMachineList}
                  handleCheckBoxValue={handleOtherPOSMachines}
                />
                {otherPOSMachines && posMachineAvailability === 'Yes' && (
                  <div style={{ width: '90%' }}>
                    <Field
                      name="otherPOSMachines"
                      component={Input}
                      disabled={disabledMode}
                      isFieldValue={true}
                      inputType="text"
                    />
                  </div>
                )}
              </Grid>
            )}
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="latesAuditedTO"
                component={NumberField}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="number"
                label="Latest audited TO"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="currentYearTO"
                component={NumberField}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="Current Year TO"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="ebitda"
                component={AdornmentInput}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="EBITDA %"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="lastMonthRevenue"
                component={NumberField}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="number"
                label="Last month revenue"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="grossMargin"
                component={AdornmentInput}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="Gross Margin"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="tenure"
                component={NumberField}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="Tenure (in months)"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={6}>
              <Field
                name="detailedBusinessNote"
                component={TextArea}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="text"
                label="Detailed business note"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={9} md={9}>
              <Field
                name="geographicalPresence"
                label="Geographical Presence"
                component={CheckBox}
                disabled={disabledMode}
                values={locationList}
                handleCheckBoxValue={handleOtherLocation}
              />
              {otherLocation && (
                <Field
                  name="otherLocation"
                  component={Input}
                  isFieldValue={true}
                  placeholder="Please specify"
                  disabled={disabledMode}
                  inputType="text"
                />
              )}
            </Grid>
            {/* {otherLocation && (
              <Grid className={styles.formLabelStyle} item={true} xs={12} sm={3} md={3}>
                <Field
                  name="otherLocation"
                  components={Input}
                  isFieldValue={true}
                  disabled={disabledMode}
                  inputType="text"
                  label=""
                />
              </Grid>
            )} */}
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={6}>
              <Field
                name="paymentGateWayList"
                label="Payment Gateway"
                component={CheckBox}
                disabled={disabledMode}
                values={paymentGateWayList}
                handleCheckBoxValue={handleOtherPaymentGateways}
              />
              {otherPaymentGateWay && (
                <Field
                  name="otherPaymentGateWay"
                  component={Input}
                  isFieldValue={true}
                  disabled={disabledMode}
                  inputType="text"
                  placeholder="Please specify"
                />
              )}
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={3} md={3}>
              <Field
                name="numberOfOutlets"
                component={NumberField}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="Number of outlets"
              />
            </Grid>
          </div>
          <Grid container={true} xs={12} justify="flex-start">
            <Grid container={true} item={true} xs={3} justify="space-between">
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
                        selectedPOSMachineAvailability(initialValues.posMachineAvailability);
                        handleOtherPOSMachines(initialValues.posMachines);
                        handleOtherLocation(initialValues.geographicalPresence);
                        handleOtherPaymentGateways(initialValues.paymentGateWayList);
                        setDisabledMode(true);
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      </Grid>
      {performanceInfoUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {performanceInfoUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {performanceInfoUpdate === 'failed' && (
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

FundingInfoForm.propTypes = {
  performanceInfoUpdate: PropTypes.bool,
  clearUpdateStatus: PropTypes.func,
  handleSubmit: PropTypes.func,
  initialize: PropTypes.func,
  initialValues: PropTypes.shape({
  }),
  submitPerformanceInfo: PropTypes.func,
  getPerformanceDetail: PropTypes.func,
  formData: PropTypes.shape({})
};

FundingInfoForm.defaultProps = {
  performanceInfoUpdate: false,
  clearUpdateStatus: () => { },
  handleSubmit: () => { },
  initialize: () => { },
  initialValues: {},
  submitPerformanceInfo: () => { },
  getPerformanceDetail: () => { },
  formData: {}
};

export default FundingInfoForm;
