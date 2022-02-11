const validate = (values) => {
  const errors = {};
  if (!values.list || values.list.lenght > 0) {
    errors.list = 'Selecte patrons';
  }
  return errors;
};

export default validate;
