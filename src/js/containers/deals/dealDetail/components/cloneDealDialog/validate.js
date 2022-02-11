const validate = (values) => {
  const errors = {};
  if (!values.name || values.name === '') {
    errors.name = 'Required field';
  }
  if (!values.applicationCode || values.applicationCode === '') {
    errors.applicationCode = 'Required field';
  }
  if (!values.dealAmount) {
    errors.dealAmount = 'Please enter amount';
  }
  if (!values.dealAmountUnit) {
    errors.dealAmountUnit = 'Required';
  }
  if (!values.dealCurrency) {
    errors.dealCurrency = 'Required';
  }
  return errors;
};

export default validate;
