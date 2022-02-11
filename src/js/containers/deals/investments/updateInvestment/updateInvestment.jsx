import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import { MaskedInput, Button } from 'app/components';
import { useDispatch } from 'react-redux';
import styles from './styles.scss';

const UpdateInvestment = (props) => {
  const dispatch = useDispatch();
  const {
    investmentDetail,
    getInvestmentDetail,
    updateInvestment,
    investmentId
  } = props;

  useEffect(() => {
    if (getInvestmentDetail) getInvestmentDetail(investmentId);
  }, [investmentId]);

  const handleSubmit = (updateFormData) => {
    const formData = { ...updateFormData, remarks: updateFormData.remarks || 'New' };
    updateInvestment(investmentId, formData).then((res) => {
      if (res.data) {
        dispatch({
          type: 'show',
          payload: 'Investment Updated Successfully',
          msgType: 'success'
        });
      }
    });
  };
  const [inputValue, setInputValue] = useState(investmentDetail && investmentDetail.amount);
  const [investmentFeeValue, setInvestmentFeeValue] = useState(
    investmentDetail?.feePercentage || ''
  );
  const [investmentTaxValue, setInvestmentTaxValue] = useState(
    investmentDetail?.taxPercentage || ''
  );
  const [showError, toggleError] = useState(false);
  const [showInvestmentFeeError, toggleInvestmentFeeError] = useState(false);
  useEffect(() => {
    setInputValue(investmentDetail && investmentDetail.amount);
    setInvestmentFeeValue(investmentDetail?.feePercentage || '');
    setInvestmentTaxValue(investmentDetail?.taxPercentage || '');
    return () => {
      setInputValue('');
      setInvestmentFeeValue('');
      setInvestmentTaxValue('');
      toggleError(false);
      toggleInvestmentFeeError(false);
    };
  }, [investmentDetail]);

  useEffect(() => {
    if (!inputValue) {
      toggleError(true);
    } else {
      toggleError(false);
    }
    if (investmentFeeValue) {
      toggleInvestmentFeeError(false);
    }
  }, [investmentFeeValue, inputValue]);

  const handleFormSubmit = () => {
    if (!inputValue) {
      return;
    }
    if (!investmentFeeValue) {
      toggleInvestmentFeeError(true);
      return;
    }
    const payload = {
      ...investmentDetail,
      amount: Number(inputValue),
      feePercentage: Number(investmentFeeValue),
      taxPercentage: Number(investmentTaxValue)
    };
    handleSubmit(payload);
  };

  return (
    <>
      <Grid style={{ marginBottom: '30px' }}>
        <MaskedInput
          label="Amount *"
          name="Amount"
          handleChange={({ target: { value } }) => setInputValue(value)}
          value={inputValue}
        />
        {showError && <FormHelperText error={true}>Amount is Required</FormHelperText>}
        <TextField
          label="Investment Fee (%) *"
          name="investmentFee"
          onChange={(e) => setInvestmentFeeValue(e.target.value)}
          value={investmentFeeValue}
          className={styles.feeInput}
        />
        {showInvestmentFeeError && (
          <FormHelperText error={true} style={{ marginLeft: '8px' }}>Investment Fee is Required</FormHelperText>
        )}
        <TextField
          label="Investment Tax (%)"
          name="investmentTaxPercentage"
          onChange={(e) => setInvestmentTaxValue(e.target.value)}
          value={investmentTaxValue}
          className={styles.feeInput}
        />
      </Grid>
      <Button
        label="Update"
        onClick={handleFormSubmit}
        style={{ width: '100%' }}
      />
    </>
  );
};

UpdateInvestment.propTypes = {
  updateInvestment: PropTypes.func,
  investmentDetail: PropTypes.shape({
    id: PropTypes.string
  }),
  getInvestmentDetail: PropTypes.func,
  investmentId: PropTypes.string
};

UpdateInvestment.defaultProps = {
  investmentDetail: null,
  updateInvestment: () => {},
  getInvestmentDetail: () => {},
  investmentId: null
};

export default UpdateInvestment;
