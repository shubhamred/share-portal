import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Grid } from '@material-ui/core';
import { Input, Button, DropDown } from 'app/components';
import stateList from 'app/constants/stateList';

import styles from './styles.scss';

const Address = (props) => {
  const { handleSubmit, onSubmit, partnerDetail, getAddresses, addresses, initialValues, initialize } = props;

  const [disabledMode, setDisabledMode] = useState(true);
  const [selectedState, setSelectedState] = useState('');

  const handleFormSubmit = (values) => {
    if (initialValues?.id) {
      onSubmit({ ...values, addressType: 'Business', addressId: initialValues?.id });
    } else {
      onSubmit({ ...values, addressType: 'Business' });
    }
    setDisabledMode(true);
  };

  useEffect(() => {
    if (initialValues) initialize(initialValues);
  }, [addresses]);

  useEffect(() => {
    if (getAddresses && partnerDetail && partnerDetail.companyCode) getAddresses(partnerDetail.companyCode);
  }, [partnerDetail]);

  return (
    <Grid className={styles.addressWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={12}>
              <Field
                name="line1"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Address Line 1"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={12}>
              <Field
                name="line2"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Address Line 2"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={12}>
              <Field
                name="line3"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Address Line 3"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="country"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Country"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="state"
                component={DropDown}
                options={stateList}
                selectedOption={selectedState}
                disabled={disabledMode}
                handleSelectedOption={(val) => {
                  setSelectedState(val);
                }}
                isFieldValue={true}
                type="dropdown"
                label="State"
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="city"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="City"
              />
            </Grid>
          </Grid>
          <Grid className={styles.fieldRowContainer} container={true} spacing={2}>
            <Grid className={styles.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="pincode"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Pincode"
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

Address.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func
};

Address.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {}
};

export default Address;
