import { validateUrl, validateEmail, validateBusinessPAN, validateGSTIN, validateMobile } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.brandName || values.brandName === '') {
    errors.brandName = 'Required field';
  }
  if (values.workEmail && !validateEmail(values.workEmail)) {
    errors.workEmail = 'Invalid Email';
  }
  if (values.mobile && !validateMobile(values.mobile)) {
    errors.mobile = 'Invalid Mobile';
  }
  if (values.websiteUrl && !validateUrl(values.websiteUrl)) {
    errors.websiteUrl = 'Invalid Url';
  }
  if (values.businessPAN && !validateBusinessPAN(values.businessPAN)) {
    errors.businessPAN = 'Invalid PAN';
  }
  if (values.gstin && !validateGSTIN(values.gstin)) {
    errors.gstin = 'Invalid GSTIN';
  }
  return errors;
};

export default validate;
