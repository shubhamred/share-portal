const validate = (values) => {
  const errors = {};
  if (!values.applicationCode || values.applicationCode === '') {
    errors.applicationCode = 'Required field';
  }
  if (!values.split || values.split === '') {
    errors.split = 'Required field';
  }
  if (!values.revenueSource || values.revenueSource.length === 0) {
    errors.revenueSource = 'Required field';
  }
  if (!values.narration || values.narration === '') {
    errors.narration = 'Required field';
  }
  return errors;
};

export default validate;
