const validate = (values) => {
  const errors = {};
  if (!values.line1) {
    errors.line1 = 'Please enter address line1';
  }
  if (!values.city) {
    errors.city = 'Please enter city';
  }
  if (!values.state) {
    errors.state = 'Please enter state';
  }
  if (!values.country) {
    errors.country = 'Please enter country';
  }
  if (!values.pincode || !Number.isInteger(parseInt(values.pincode, 10)) || values.pincode.length !== 6) {
    errors.pincode = 'Invalid pincode';
  }
  return errors;
};

export default validate;
