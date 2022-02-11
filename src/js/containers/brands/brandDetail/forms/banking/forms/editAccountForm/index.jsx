import { reduxForm } from 'redux-form';
import EditAccountForm from './editAccountForm';
import validate from './validate';

const EditAccountFormWrapper = reduxForm({
  form: 'accountForm',
  validate
})(EditAccountForm);

export default EditAccountFormWrapper;
