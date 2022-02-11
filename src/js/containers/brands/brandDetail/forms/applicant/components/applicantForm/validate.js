import { validateUrl, validateEmail, validateMobile, validateIndividualPAN } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.firstName || values.firstName === '') {
    errors.firstName = 'Required field';
  }
  if (!values.lastName || values.lastName === '') {
    errors.lastName = 'Required field';
  }
  if (!values.primaryEmail || values.primaryEmail === '') {
    errors.primaryEmail = 'Required field';
  }
  if (values.primaryEmail && !validateEmail(values.primaryEmail)) {
    errors.primaryEmail = 'Invalid email';
  }
  if (!values.primaryNumber || values.primaryNumber === '') {
    errors.primaryNumber = 'Required field';
  }
  if (values.primaryNumber && !validateMobile(values.primaryNumber)) {
    errors.primaryNumber = 'Invalid mobile';
  }
  if (values.linkedInUrl && !validateUrl(values.linkedInUrl)) {
    errors.linkedInUrl = 'Invalid Url';
  }
  if (values.PAN && !validateIndividualPAN(values.PAN)) {
    errors.PAN = 'Invalid PAN';
  }
  return errors;
};

export default validate;
