const validate = (values) => {
  const errors = {};
  if (values.maxTransactionAmount && (Number(values.maxTransactionAmount) > 100000000 || Number(values.maxTransactionAmount) < 100000)) {
    errors.maxTransactionAmount = 'Amount must be between 1L to 10Cr';
  }
  if (values.commitmentAmount && (Number(values.commitmentAmount) > 100000000 || Number(values.commitmentAmount) < 100000)) {
    errors.commitmentAmount = 'Amount must be between 1L to 10Cr';
  }
  return errors;
};

export default validate;
