const validate = (values) => {
  const errors = {};
  if (!values.vendor || values.vendor === '') {
    errors.vendor = 'Required field';
  }
  if (!values.payoutStratergy || values.payoutStratergy === '') {
    errors.payoutStratergy = 'Required field';
  }
  if (values?.vendor !== 'kotak' && (!values.appId || values.appId === '')) {
    errors.appId = 'Required field';
  }
  if (values?.vendor !== 'kotak' && (!values.appSecret || values.appSecret === '')) {
    errors.appSecret = 'Required field';
  }
  if (values?.vendor === 'kotak' && (!values.accountNumber || values.accountNumber === '')) {
    errors.accountNumber = 'Required field';
  }
  return errors;
};

export default validate;
