const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Please enter name';
  }
  if (!values.resource) {
    errors.resource = 'Please select resource';
  }
  if (!values.maximumFiles) {
    errors.maximumFiles = 'Please enter a maximum files';
  }
  if (!values.maximumFileSize) {
    errors.maximumFileSize = 'Please enter maximum fileSize';
  }
  return errors;
};

export default validate;
