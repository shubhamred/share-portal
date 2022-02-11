/* eslint-disable global-require */

const validate = (values) => {
  const errors = {};
  if (!values.remarks || values.remarks === '') {
    errors.loanAmount = 'Required field';
  }
  return errors;
};

export default validate;
