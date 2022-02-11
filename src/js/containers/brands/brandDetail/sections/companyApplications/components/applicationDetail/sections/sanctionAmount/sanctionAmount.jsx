import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Input, NumberField } from 'app/components';
import CustomDatePicker from 'app/components/datePickerNew';
import { updateApplicationDetail, updateSanctionedAmount } from 'app/containers/applications/saga';
import { pickBy } from 'lodash';
import moment from 'moment';
import Styles from '../../style.scss';

const SanctionedAmount = (props) => {
  const { application, applicationId, handleSubmit } = props;
  const { sanctionValidTill } = application;
  const [disabledState, toggleDisabledState] = useState(true);
  const [selectedDate, setDate] = useState(null);

  const handleFormSubmit = (values) => {
    const sanitizedValues = pickBy(values, (value) => !!value);
    const payload = {
      ...sanitizedValues
    };
    if (selectedDate) {
      payload.sanctionValidTill = moment(
        selectedDate,
        'DD/MM/YYYY'
      ).toISOString();
    }

    // seperating the payload of sanction fields and risk fields.
    let riskPayload = {};
    const sactionPayload = (({ revenueShare, baseRevenueAmount, lowerCapRevenuePercentage, upperCapRevenuePercentage,
      softThresholdAmount, hardThresholdAmount, ...o }) => {
      riskPayload = {
        revenueShare,
        baseRevenueAmount,
        lowerCapRevenuePercentage,
        upperCapRevenuePercentage,
        softThresholdAmount,
        hardThresholdAmount
      };
      return o;
    })(payload);

    // update sanction data
    updateSanctionedAmount(applicationId, sactionPayload).then((res) => {
      if (res.data) {
        toggleDisabledState(true);
      }
    });

    // update risk data
    updateApplicationDetail(applicationId, riskPayload).then((res) => {
      if (res.data) {
        toggleDisabledState(true);
      }
    });
  };

  const handleDateChange = (formattedDate) => {
    setDate(formattedDate);
  };

  const handleCancel = () => {
    if (sanctionValidTill) {
      const formattedDate = moment(sanctionValidTill).format('DD/MM/YYYY');
      setDate(formattedDate);
    }
    toggleDisabledState(true);
  };

  useEffect(() => {
    if (sanctionValidTill) {
      const formattedDate = moment(sanctionValidTill).format('DD/MM/YYYY');
      setDate(formattedDate);
    }
  }, [sanctionValidTill]);

  return (
    <Grid container={true}>
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12}>
          <Grid
            item={true}
            xs={12}
            container={true}
            alignItems="center"
            justify="space-between"
          >
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="sanctionedAmount"
                component={Input}
                isAmountFormat={true}
                label="Sanctioned Amount (Rs)"
                placeholder="Sanctioned Amount"
                type="text"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={`${Styles.fieldItem} w100`}>
              <Field
                name="sanctionedRate"
                component={NumberField}
                min={0}
                max={100}
                label="Sanctioned Rate (%)"
                placeholder="Sanctioned Rate"
                type="text"
                step="any"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={`${Styles.fieldItem} w100`}>
              <Field
                name="sanctionedTenure"
                component={NumberField}
                min={0}
                label="Sanctioned Tenure (months)"
                placeholder="Sanctioned Tenure"
                type="text"
                disabled={disabledState}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={12} container={true}>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <CustomDatePicker
                lableStyle={{ fontSize: '12px', color: '#00000061' }}
                label="Sanction Valid Till"
                disabled={disabledState}
                onDateSelect={handleDateChange}
                initialValue={selectedDate}
              />
            </Grid>
          </Grid>

          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={Styles.seactionSpacing}
          >
            <Grid item={true} xs={12} className={Styles.fieldHeading}>
              {' '}
              Risk
              {' '}
            </Grid>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="revenueShare"
                component={NumberField}
                label="Revenue Share"
                placeholder="Revenue Share"
                type="text"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="baseRevenueAmount"
                component={Input}
                isAmountFormat={true}
                label="Base Revenue Amount"
                placeholder="Base Revenue Amount"
                type="text"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="lowerCapRevenuePercentage"
                component={NumberField}
                min={0}
                max={100}
                step="any"
                label="Lower Revenue Percentage (%)"
                placeholder="Lower Revenue Percentage"
                type="text"
                disabled={disabledState}
              />
            </Grid>
          </Grid>
          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={Styles.seactionSpacing}
          >
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="upperCapRevenuePercentage"
                component={NumberField}
                min={0}
                max={100}
                step="any"
                label="Upper Revenue Percentage (%)"
                placeholder="Upper Revenue Percentage"
                type="text"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="softThresholdAmount"
                component={Input}
                isAmountFormat={true}
                label="Soft Threshold Amount"
                placeholder="Soft Threshold Amount"
                type="text"
                disabled={disabledState}
              />
            </Grid>
            <Grid item={true} xs={3} className={Styles.fieldItem}>
              <Field
                name="hardThresholdAmount"
                component={Input}
                isAmountFormat={true}
                label="Hard Threshold Amount"
                placeholder="Hard Threshold Amount"
                type="text"
                disabled={disabledState}
              />
            </Grid>
          </Grid>

          {!disabledState && (
            <Grid item={true} xs={12}>
              <Button
                className={Styles.primaryBtn}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
              <Button type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Grid item={true} xs={12}>
        {disabledState ? (
          <Button
            type="button"
            className={Styles.primaryBtn}
            onClick={() => toggleDisabledState(false)}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};

SanctionedAmount.propTypes = {
  handleSubmit: PropTypes.func,
  application: PropTypes.object,
  applicationId: PropTypes.string
};

SanctionedAmount.defaultProps = {
  handleSubmit: () => {},
  application: {},
  applicationId: ''
};

export default SanctionedAmount;
