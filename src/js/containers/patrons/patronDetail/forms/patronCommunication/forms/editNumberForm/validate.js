import { validateMobile } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.contact || !validateMobile(values.contact)) {
    errors.contact = 'Invalid number';
  }
  return errors;
};

export default validate;
