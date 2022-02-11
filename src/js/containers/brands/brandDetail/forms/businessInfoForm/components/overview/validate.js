import { validateUrl, validateEmail, validateBusinessPAN, validateGSTIN, formatDate } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.brandName || values.brandName === '') {
    errors.brandName = 'Required field';
  }
  if (values.workEmail && !validateEmail(values.workEmail)) {
    errors.workEmail = 'Invalid Email';
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
  if (values.dateOfIncorportation) {
    const startDate = new Date(formatDate(values.dateOfIncorportation));
    const endDate = new Date();
    if (startDate > endDate) {
      errors.dateOfIncorportation = 'Enter valid date';
    }
  }
  return errors;
};

export default validate;
