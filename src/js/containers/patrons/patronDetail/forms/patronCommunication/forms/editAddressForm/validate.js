const validate = (values) => {
  const errors = {};
  if (!values.addressType) {
    errors.addressType = 'Please select a type';
  }
  if (!values.pincode || !Number.isInteger(parseInt(values.pincode, 10)) || values.pincode.length !== 6) {
    errors.pincode = 'Invalid pincode';
  }
  if (!values.city) {
    errors.city = 'Please enter city';
  }
  if (!values.country) {
    errors.country = 'Please enter country';
  }
  if (!values.line1) {
    errors.line1 = 'Please enter address line1';
  }
  if (!values.state) {
    errors.state = 'Please enter state';
  }
  if (!values.premiseOwnership) {
    errors.premiseOwnership = 'Please select an ownership';
  }
  if (!values.completeAddress) {
    errors.completeAddress = 'Please enter complete Address';
  }
  return errors;
};

export default validate;
