import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { NumberField, DropDown, Button, CheckBox, Slider, DialogComponent } from 'app/components';

import { sectorOfChoices } from 'app/constants/misc';
import styles from './styles.scss';

const FundingInfoForm = (props) => {
  const { handleSubmit, initialValues, initialize,
    saveFundingInfo, fundingInfoUpdate, clearUpdateStatus } = props;
  const { id } = initialValues;
  const [disabledMode, setDisabledMode] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  // roi expectations
  const roiMarks = [{ value: 8, label: '8%' }, { value: 50, label: '50%' }];
  // investment experience
  const investmentMarks = [{ value: 1, label: '1' }, { value: 50, label: '50' }];
  // alternate investment experience
  const altInvestmentMarks = [{ value: 1, label: '1' }, { value: 50, label: '50' }];
  // risk appetite
  const riskAppetiteList = ['Low', 'Medium', 'High'];
  const [selectedRiskAppetite, setSelectedRiskAppetite] = useState('Medium');
  // products of choice
  const productsList = [{ label: 'RBF', name: 'RBF' },
    { label: 'Advertising & Marketing', name: 'Advertising & Marketing' }, { label: 'Inventory', name: 'Inventory' },
    { label: 'Outlet Expansion', name: 'Outlet Expansion' }, { label: 'Working Capital', name: 'Working Capital' }];

  const handleFormSubmit = (values) => {
    saveFundingInfo(values, id);
    setOpenAlert(true);
    setTimeout(() => {
      setOpenAlert(false);
      clearUpdateStatus();
    }, 1000);
    setDisabledMode(true);
  };

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="commitmentAmount"
                component={NumberField}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="number"
                label="Commitment amount"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="maxTransactionAmount"
                component={NumberField}
                isFieldValue={true}
                disabled={disabledMode}
                inputType="number"
                label="Max transaction amount"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="riskAppetite"
                component={DropDown}
                disabled={disabledMode}
                options={riskAppetiteList}
                selectedOption={selectedRiskAppetite}
                handleSelectedOption={(value) => {
                  setSelectedRiskAppetite(value);
                }}
                label="Risk appetite"
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="roiExpectations"
                label="ROI Expectations"
                step={1}
                marks={roiMarks}
                disabled={disabledMode}
                defaultValue={8}
                minValue={8}
                maxValue={50}
                component={Slider}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="investmentExperience"
                label="Investment Experience"
                step={1}
                marks={investmentMarks}
                disabled={disabledMode}
                defaultValue={1}
                minValue={1}
                maxValue={50}
                component={Slider}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="alternateInvestmentExperience"
                label="Alternate Investment Experience"
                step={1}
                marks={altInvestmentMarks}
                disabled={disabledMode}
                defaultValue={1}
                minValue={1}
                maxValue={50}
                component={Slider}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={12}>
              <Field
                name="sectorsOfChoice"
                label="Sectors of Choice"
                component={CheckBox}
                disabled={disabledMode}
                values={sectorOfChoices}
              // handleCheckBoxValue={handleSectorsOfChoice}
              />
            </Grid>
          </div>
          <div className={styles.fieldRowContainer}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={12}>
              <Field
                name="productsOfChoice"
                label="Products of Choice"
                disabled={disabledMode}
                component={CheckBox}
                values={productsList}
              // handleCheckBoxValue={handleSectorsOfChoice}
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
                  <Button type="submit" label="Save" />
                </Grid>
                <Grid item={true}>
                  <Button
                    type="button"
                    style={{ backgroundColor: 'white', color: '#5A74ED' }}
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
      {fundingInfoUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {fundingInfoUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {fundingInfoUpdate === 'failed' && (
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
  clearUpdateStatus: PropTypes.func,
  fundingInfoUpdate: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialize: PropTypes.func,
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patronType: PropTypes.string.isRequired
  }),
  formData: PropTypes.shape({}),
  saveFundingInfo: PropTypes.func
};

FundingInfoForm.defaultProps = {
  clearUpdateStatus: () => { },
  fundingInfoUpdate: null,
  handleSubmit: () => { },
  initialize: () => { },
  initialValues: {},
  formData: {},
  saveFundingInfo: () => { }
};

export default FundingInfoForm;
