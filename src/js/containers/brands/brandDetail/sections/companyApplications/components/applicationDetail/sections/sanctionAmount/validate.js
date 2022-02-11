/* eslint-disable global-require */
const messages = {
  percentage: 'Should be between 0 and 100',
  months: 'Should be greater than or equal to 0',
  number: 'Should be greater than or equal to 0'
};

const validatePercent = (value) => typeof value === 'undefined' || (value < 0 || value > 100);
const validateMonth = (value) => typeof value === 'undefined' || (value < 0);
const validateNumber = (value) => typeof value === 'undefined' || (value < 0);

const validate = (values) => {
  const errors = {};
  if (validatePercent(values.sanctionedRate)) {
    errors.sanctionedRate = messages.percentage;
  }
  if (validatePercent(values.lowerCapRevenuePercentage)) {
    errors.lowerCapRevenuePercentage = messages.percentage;
  }
  if (validateNumber(values.upperCapRevenuePercentage)) {
    errors.upperCapRevenuePercentage = messages.number;
  }
  if (validateMonth(values.revenueShare)) {
    errors.revenueShare = messages.months;
  }
  if (validateMonth(values.sanctionedTenure)) {
    errors.sanctionedTenure = messages.months;
  }
  return errors;
};

export default validate;
