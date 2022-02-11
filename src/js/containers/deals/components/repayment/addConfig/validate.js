const validate = (values) => {
  const errors = {};
  if (!values.vendor || values.vendor === '') {
    errors.vendor = 'Required field';
  }
  if (!values.selectBeneficiary || values.selectBeneficiary === '') {
    errors.selectBeneficiary = 'Required field';
  }
  if (!values.split || values.split === '') {
    errors.split = 'Required field';
  }
  return errors;
};

export default validate;
