/* eslint-disable max-len */

import { memoize } from 'lodash';

const Required = (value) => ((value === undefined || value === '') ? 'Please enter a value' : undefined);
const MaxLength = (max) => (value) => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const MinLength = (min) => (value) => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
const MinValue = (min) => (value) => (value && value < min ? `Value must be greater than ${min}` : undefined);
const MaxValue = (max) => (value) => (value && value > max ? `Value must be less than ${max}` : undefined);

const validateRequired = memoize(Required);
const validateMaxLength = memoize(MaxLength);
const validateMinLength = memoize(MinLength);
const validateMinValue = memoize(MinValue);
const validateMaxValue = memoize(MaxValue);
export {
  validateRequired,
  validateMaxLength,
  validateMinLength,
  validateMinValue,
  validateMaxValue
};
