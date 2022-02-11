import { validateEmail, validateMobile } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.firstName || values.firstName === '') {
    errors.firstName = 'Required field';
  }
  if (!values.lastName || values.lastName === '') {
    errors.lastName = 'Required field';
  }
  if (!values.mobile || values.mobile === '') {
    errors.mobile = 'Mobile is required';
  }
  if (values.mobile && !validateMobile(values.mobile)) {
    errors.mobile = 'Invalid mobile';
  }
  if (!values.email || values.email === '') {
    errors.email = 'Email is required';
  }
  if (values.email && !validateEmail(values.email)) {
    errors.email = 'Invalid email';
  }
  if (!values.associationType || values.associationType === '') {
    errors.associationType = 'Required';
  }
  return errors;
};

export default validate;
