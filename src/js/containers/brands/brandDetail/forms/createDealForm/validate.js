const validate = (values) => {
  const errors = {};
  if (!values.dealName || values.dealName === '') {
    errors.dealName = 'Required field';
  }
  if (!values.applicationCode || values.applicationCode === '') {
    errors.applicationCode = 'Required field';
  }
  if (!values.dealAmount && (values.dealAmountUnit || values.dealCurrency)) {
    errors.dealAmount = 'Please enter amount';
  }
  if (!values.dealAmountUnit && values.dealAmount) {
    errors.dealAmountUnit = 'Required';
  }
  if (!values.dealCurrency && values.dealAmount) {
    errors.dealCurrency = 'Required';
  }
  if (!values.commitmentAmount && (values.commitmentAmountUnit || values.commitAmountCurrency)) {
    errors.commitmentAmount = 'Please enter amount';
  }
  if (!values.commitmentAmountUnit && values.commitmentAmount) {
    errors.commitmentAmountUnit = 'Required';
  }
  return errors;
};

export default validate;
