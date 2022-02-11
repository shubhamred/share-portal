/* eslint-disable global-require */

import {
  validateIndividualPAN, validateMobile, validateName, validateUrl, formatDate
} from 'app/utils/utils';

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
  if (values.panNumber && !validateIndividualPAN(values.panNumber)) {
    errors.panNumber = 'Invalid PAN';
  }
  if (!values.mobile || values.mobile === '') {
    errors.mobile = 'Required field';
  }
  if (!values.mobile || values.mobile === '') {
    errors.mobile = 'Mobile is required';
  }
  if (values.mobile && !validateMobile(values.mobile)) {
    errors.mobile = 'Invalid mobile';
  }
  if (values.linkedInUrl && !validateUrl(values.linkedInUrl)) {
    errors.linkedInUrl = 'Invalid Url';
  }
  // if (values.totalWorkExp && values.totalWorkExp > 50) {
  //   errors.totalWorkExp = 'Value must not be greater than 50';
  // }
  // if (!values.fatherOrSpouseName || values.fatherOrSpouseName === '') {
  //   errors.fatherOrSpouseName = 'Required field';
  // }
  // if (values.address && values.fatherOrSpouseName.length > 100) {
  //   errors.fatherOrSpouseName = 'Name must not be greater than 100';
  // }
  // if (!values.address || values.address === '') {
  //   errors.address = 'Required field';
  // }
  // if (values.address && values.address.length < 20 && values.address.length > 200) {
  //   errors.address = 'Address must be 20 to 200';
  // }
  // if (!values.correspondenceAddress || values.correspondenceAddress === '') {
  //   errors.correspondenceAddress = 'Required field';
  // }
  // if (!values.isAadhaarPresent || values.isAadhaarPresent === '') {
  //   errors.isAadhaarPresent = 'Required field';
  // }
  // if (!values.investorProfileOption || values.investorProfileOption === '') {
  //   errors.investorProfileOption = 'Required field';
  // }
  // if (values.eligibleInvestor === null || values.eligibleInvestor === '') {
  //   errors.eligibleInvestor = 'Required field';
  // }
  // if (values.nonTaxResident === null || values.nonTaxResident === '') {
  //   errors.nonTaxResident = 'Required field';
  // }
  if (values.dateOfBirth) {
    const startDate = new Date(formatDate(values.dateOfBirth));
    const endDate = new Date();
    if (startDate > endDate) {
      errors.dateOfBirth = 'Enter valid date';
    }
  }
  return errors;
};

export default validate;
