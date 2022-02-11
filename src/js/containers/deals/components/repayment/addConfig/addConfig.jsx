import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { Grid, FormControlLabel } from '@material-ui/core';
import { Button, NumberField, DropDown, Switch } from 'app/components';
import { fetchBrandConfig } from 'app/containers/brands/saga';
import styles from './styles.scss';

const AddPartners = (props) => {
  const { handleSubmit, onSubmit, onClose, dealData } = props;
  const partnerOption = ['cashfree', 'razorpay'];
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedDealType, setSelectedDealType] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('razorpay');
  const [allAccountsList, setAllAccountsList] = useState({ cashfree: [], razorpay: [] });

  useEffect(() => {
    if (dealData?.brandCode) {
      fetchBrandConfig(dealData.brandCode).then((res) => {
        if (res?.data) {
          const { configs } = res.data;
          const razorpayData = configs.find((list) => list.vendor === 'razorpay');
          const cashfreeData = configs.find((list) => list.vendor === 'cashfree');
          setAllAccountsList({
            cashfree: map(cashfreeData?.accounts || [], 'accountId'),
            razorpay: map(razorpayData?.accounts || [], 'accountId')
          });
          setAccountsList(map(razorpayData?.accounts || [], 'accountId'));
        }
      });
    }
  }, [dealData]);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      isActive: selectedDealType ? 1 : 0
    });
  };

  return (
    <Grid className={styles.inviteForm} container={true}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid className={styles.label} item={true} xs={12} sm={12}>
              Partner *
            </Grid>
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="vendor"
                  options={partnerOption}
                  selectedOption={selectedPartner}
                  placeholder="partner"
                  component={DropDown}
                  handleSelectedOption={(value) => {
                    if (value === 'cashfree') {
                      setAccountsList(allAccountsList.cashfree);
                      setSelectedAccount('');
                    } else {
                      setAccountsList(allAccountsList.razorpay);
                      setSelectedAccount('');
                    }
                    setSelectedPartner(value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid className={styles.label} item={true} xs={12} sm={12}>
              Select Beneficiary *
            </Grid>
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="selectBeneficiary"
                  options={accountsList}
                  selectedOption={selectedAccount}
                  placeholder="Select Beneficiary"
                  component={DropDown}
                  handleSelectedOption={(value) => {
                    setSelectedAccount(value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid className={styles.label} item={true} xs={12} sm={12}>
              Split percentage  *
            </Grid>
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field name="split" component={NumberField} type="text" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid className={styles.label} item={true} xs={6} sm={12}>
              Status *
            </Grid>
            <Grid item={true} xs={6} container={true} flex-direction="row">
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedDealType}
                    onChange={({ target }) => {
                      setSelectedDealType(target.checked);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container={true} className={styles.buttonStyle} alignItems="center">
          <Grid onClick={onClose} className={styles.cancelButtonDiv}>
            <Grid className={styles.cancelButtonStyle}>Cancel</Grid>
          </Grid>
          <Button type="submit" label="Add Partner" />
        </Grid>
      </form>
    </Grid>
  );
};

AddPartners.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func
};

AddPartners.defaultProps = {
  onSubmit: () => {},
  handleSubmit: () => {}
};

export default AddPartners;
