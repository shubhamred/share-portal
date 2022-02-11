/* eslint-disable global-require */

const validate = (values) => {
  const errors = {};
  if (values.fundingAmount && (Number(values.fundingAmount) > 100000000 || Number(values.fundingAmount) < 100000)) {
    errors.fundingAmount = 'Amount must be between 1L to 10Cr';
  }
  if (values.numberOfOutlets && !Number.isInteger((values.numberOfOutlets))) {
    errors.numberOfOutlets = 'Please enter a valid number';
  }
  if (values.numberOfOutlets && values.numberOfOutlets > 1000) {
    errors.numberOfOutlets = 'Value must not be greater than 1000';
  }
  return errors;
};

export default validate;
