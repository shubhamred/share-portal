const validate = (values) => {
  const errors = {};
  if (!values.deal || values.deal === '') {
    errors.deal = 'Required field';
  }
  if (!values.split || values.split === '') {
    errors.split = 'Required field';
  }
  return errors;
};

export default validate;
