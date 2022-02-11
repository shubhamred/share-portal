const validate = (values) => {
  const errors = {};
  if (!values.accountId || values.accountId === '') {
    errors.accountId = 'Required field';
  }
  if (!values.name || values.name === '') {
    errors.name = 'Required field';
  }
  if (!values.ifsc || values.ifsc === '') {
    errors.ifsc = 'Required field';
  }
  return errors;
};

export default validate;
