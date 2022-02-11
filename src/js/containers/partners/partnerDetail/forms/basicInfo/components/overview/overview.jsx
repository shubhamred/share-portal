import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Input, Button } from 'app/components';

import styles from './styles.scss';

const Overview = (props) => {
  const { partnerDetail, initialValues, initialize, formData, handleSubmit, clearValues, getBusinessDetails, updateCompanyDetails, getApplicantList } = props;
  const [disabledMode, setDisabledMode] = useState(true);

  const handleFormSubmit = (values) => {
    updateCompanyDetails(values, partnerDetail.id);
    setDisabledMode(true);
  };

  useEffect(() => {
    if (initialValues) initialize(initialValues);
  }, [formData]);

  useEffect(() => {
    if (clearValues) clearValues();
    if (getBusinessDetails && partnerDetail && partnerDetail.id) getBusinessDetails(partnerDetail.id);
    if (partnerDetail && partnerDetail.id) getApplicantList(partnerDetail.id);
  }, [partnerDetail]);

  return (
    <Grid className={styles.overviewWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcId"
                component={Input}
                disabled={true}
                isFieldValue={true}
                inputType="text"
                label="Klub NBFC ID"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="NBFC Name"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcWebsite"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="NBFC Website"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcLegalName"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="NBFC Legal Name"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcSignatoryName"
                component={Input}
                disabled={true}
                label="NBFC Authorized Signatory Name"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcMobile"
                component={Input}
                disabled={true}
                label="NBFC Phone Number"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="nbfcMail"
                component={Input}
                disabled={true}
                label="NBFC Mail Id"
              />
            </Grid>
          </Grid>
          <Grid container={true} item={true} xs={12} spacing={2}>
            <Grid item={true} xs={12} className={styles.fieldHeading}>
              {' '}
              NACH Details
              {' '}
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} md={3}>
              <Field
                name="corporateUtilityCode"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Corporate Utility Code"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={6} md={3}>
              <Field
                name="corporateConfigurationId"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Corporate Configuration ID"
              />
            </Grid>
          </Grid>
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
              </>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

Overview.propTypes = {
  partnerDetail: PropTypes.shape(),
  handleSubmit: PropTypes.func,
  formData: PropTypes.shape({})

};

Overview.defaultProps = {
  partnerDetail: {},
  handleSubmit: () => {},
  formData: {}
};

export default Overview;
