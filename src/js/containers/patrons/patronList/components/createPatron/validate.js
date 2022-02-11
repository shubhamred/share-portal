import { validateEmail, validateMobile, validateName } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.firstName || values.firstName === '') {
    errors.firstName = 'Required field';
  }
  if (values.firstName && !validateName(values.firstName)) {
    errors.firstName = 'Invalid Name';
  }
  if (!values.lastName || values.lastName === '') {
    errors.lastName = 'Required field';
  }
  if (values.lastName && !validateName(values.lastName)) {
    errors.lastName = 'Invalid Name';
  }
  if (!values.patronName || values.patronName === '') {
    errors.patronName = 'Required field';
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
  return errors;
};

export default validate;
