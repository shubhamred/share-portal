import { validateEmail } from 'app/utils/utils';

const validate = (values) => {
  const errors = {};
  if (!values.contact || !validateEmail(values.contact)) {
    errors.contact = 'Invalid email';
  }
  return errors;
};

export default validate;
