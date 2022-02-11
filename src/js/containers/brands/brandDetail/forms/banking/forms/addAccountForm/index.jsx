import { reduxForm } from 'redux-form';
import AddAccountForm from './addAccountForm';
import validate from './validate';

const AddAccountFormWrapper = reduxForm({
  form: 'accountForm',
  validate
})(AddAccountForm);

export default AddAccountFormWrapper;
