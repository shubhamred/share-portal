const validate = (values) => {
  const errors = {};
  if (!values.docCategory) {
    errors.docCategory = 'Please enter doc category';
  }
  if (!values.docType) {
    errors.docType = 'Please select a doc type';
  }
  return errors;
};

export default validate;
