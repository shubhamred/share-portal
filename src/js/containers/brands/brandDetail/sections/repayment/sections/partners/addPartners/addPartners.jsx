import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button, Input, DropDown } from 'app/components';
import styles from './styles.scss';
import { PayoutStrategies } from '../../../data/enum';

const AddPartners = (props) => {
  const { handleSubmit, onSubmit, onClose } = props;
  const [selectedPartner, setSelectedPartner] = useState('razorpay');
  const [selectedStratergy, setSelectedStratergy] = useState('');
  const [stratergyOption, setStratergyOption] = useState(PayoutStrategies.RAZORPAY);
  const partnerOption = ['cashfree', 'razorpay', 'kotak'];

  const handleFormSubmit = (values) => {
    const submittedData = { ...values };
    if (
      (submittedData.vendor === 'cashfree'
        || submittedData.payoutStratergy === 'razorpayOrder')
      && submittedData?.settlementBucket
    ) {
      delete submittedData.settlementBucket;
    }

    if (submittedData.vendor === 'razorpay' && submittedData?.publicKey) {
      delete submittedData.publicKey;
    }

    if (submittedData.vendor === 'kotak' && submittedData?.settlementBucket) {
      delete submittedData.settlementBucket;
    }

    onSubmit({
      ...submittedData
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
                      setStratergyOption(PayoutStrategies.CASHFREE);
                      setSelectedStratergy('');
                    } else if (value === 'razorpay') {
                      setStratergyOption(PayoutStrategies.RAZORPAY);
                      setSelectedStratergy('');
                    } else {
                      setStratergyOption(PayoutStrategies.KOTAK);
                      setSelectedStratergy('');
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
              Payout Stratergy *
            </Grid>
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="payoutStratergy"
                  options={stratergyOption}
                  selectedOption={selectedStratergy}
                  placeholder="Payout Stratergy"
                  component={DropDown}
                  handleSelectedOption={(value) => {
                    setSelectedStratergy(value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {selectedPartner !== 'kotak' && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={5}>
              <Field
                name="appId"
                component={Input}
                label="App ID *"
                type="text"
              />
            </Grid>
            <Grid className={styles.childDivWidth} item={true} xs={5}>
              <Field
                name="appSecret"
                component={Input}
                label="Secret *"
                type="text"
              />
            </Grid>
          </Grid>
        )}
        {selectedStratergy === 'razorpayRoute' && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field
                name="settlementBucket"
                component={Input}
                label="Settlement Bucked ID"
                type="text"
                disabled={true}
              />
            </Grid>
          </Grid>
        )}
        {selectedPartner === 'cashfree' && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field
                name="publicKey"
                component={Input}
                label="Public Key"
                type="text"
              />
            </Grid>
          </Grid>
        )}
        {selectedPartner === 'kotak' && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field
                name="accountNumber"
                component={Input}
                label="E-collect Account Number"
                type="text"
              />
            </Grid>
          </Grid>
        )}
        <Grid
          container={true}
          className={styles.buttonStyle}
          alignItems="center"
        >
          <Grid
            onClick={() => onClose()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            <Grid style={{ padding: '4px', color: '#1518AF' }}>Cancel</Grid>
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
