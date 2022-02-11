import { validateEmail, validateMobile, validateBusinessPAN, validateName } from 'app/utils/utils';

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
  if (!values.brandName || values.brandName === '') {
    errors.brandName = 'Required field';
  }
  if (values.businessPan && !validateBusinessPAN(values.businessPan)) {
    errors.businessPan = 'Invalid PAN';
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
  if (Number(values.fundingAmount) > 100000000 || Number(values.fundingAmount) < 100000) {
    errors.fundingAmount = 'Amount should be between 1Lakh to 10Cr';
  }
  if (!values.fundingAmount) {
    errors.fundingAmount = 'Funding Amount is required';
  }
  return errors;
};

export default validate;
