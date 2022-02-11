const validate = (values) => {
  const errors = {};
  if (!values.name || values.name === '') {
    errors.name = 'Required field';
  }
  if (!values.accountNumber || values.accountNumber === '') {
    errors.accountNumber = 'Required field';
  }
  if (!values.ifsc || values.ifsc === '') {
    errors.ifsc = 'Required field';
  }
  if (!values.narration || values.narration === '') {
    errors.narration = 'Required field';
  }
  return errors;
};

export default validate;
