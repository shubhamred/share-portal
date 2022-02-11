const moment = require('moment');

const validate = (values) => {
  const errors = {};
  if (!values.dealName || values.dealName === '') {
    errors.dealName = 'Required field';
  }
  if (!values.brandName || values.brandName === '') {
    errors.brandName = 'Required field';
  }
  if (!values.dealAmount && (values.dealAmountUnit || values.dealCurrency)) {
    // errors.dealAmount = 'Please enter amount';
    errors.dealAmount = 'Required';
  }
  if (!values.dealAmountUnit && values.dealAmount) {
    errors.dealAmountUnit = 'Required';
  }
  if (!values.dealCurrency && values.dealAmount) {
    errors.dealCurrency = 'Required';
  }
  if (values.score) {
    if (values.score > 10 || values.score < 0) {
      errors.score = 'Value must be min of 0 & max of 10 ';
    }
  }
  if (
    !values.commitmentAmount
    && (values.commitmentAmountUnit || values.commitAmountCurrency)
  ) {
    // errors.commitmentAmount = 'Please enter amount';
    errors.commitmentAmount = 'Required';
  }
  if (!values.commitmentAmountUnit && values.commitmentAmount) {
    errors.commitmentAmountUnit = 'Required';
  }
  if (!values.commitAmountCurrency && values.commitmentAmount) {
    errors.commitAmountCurrency = 'Required';
  }
  if (values.publishedAt && values.unPublishedAt) {
    const temp = moment(values.publishedAt, 'DD/MM/YYYY');
    const temp2 = moment(values.unPublishedAt, 'DD/MM/YYYY');
    const diff = temp2.diff(temp, 'day');
    if (diff < 0) {
      errors.unPublishedAt = 'Un Published Date should be greater than Published Date';
    }
  }
  return errors;
};

export default validate;
