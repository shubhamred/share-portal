const validate = (values) => {
  const errors = {};
  if (!values.bankName) {
    errors.bankName = 'Please select a bank';
  }
  if (!values.accountType) {
    errors.accountType = 'Please select a type';
  }
  // if (!values.accountNumber) {
  //   errors.accountNumber = 'Please enter account number';
  // }
  // if (!values.statementPassword) {
  //   errors.statementPassword = 'Please enter password';
  // }
  return errors;
};

export default validate;
