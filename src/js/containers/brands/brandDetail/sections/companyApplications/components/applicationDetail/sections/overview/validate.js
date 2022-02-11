/* eslint-disable global-require */
const messages = {
  percentage: 'Should be between 0 and 100',
  months: 'Should be greater than or equal to 0'
};

const validatePercent = (value) => typeof value === 'undefined' || (value < 0 || value > 100);
const validateMonth = (value) => typeof value === 'undefined' || (value < 0);

const validate = (values) => {
  const errors = {};
  if (validatePercent(values.softSanctionRevenueShare)) {
    errors.softSanctionRevenueShare = messages.percentage;
  }
  if (validatePercent(values.softSanctionYield)) {
    errors.softSanctionYield = messages.percentage;
  }
  if (validatePercent(values.lowerCapRevenuePercentage)) {
    errors.lowerCapRevenuePercentage = messages.percentage;
  }
  if (validatePercent(values.upperCapRevenuePercentage)) {
    errors.upperCapRevenuePercentage = messages.percentage;
  }
  if (validateMonth(values.softSanctionQuantum)) {
    errors.softSanctionQuantum = messages.months;
  }
  if (validateMonth(values.softSanctionTenure)) {
    errors.softSanctionTenure = messages.months;
  }
  return errors;
};

export default validate;
