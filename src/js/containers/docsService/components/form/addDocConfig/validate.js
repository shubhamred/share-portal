const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Please enter name';
  }
  if (!values.resource) {
    errors.resource = 'Please select resource';
  }
  if (!values.docType) {
    errors.docType = 'Please select a doc type';
  }
  return errors;
};

export default validate;
