import { reduxForm } from 'redux-form';
import AddEmailForm from './addEmailForm';
import validate from './validate';

const AddEmailFormWrapper = reduxForm({
  form: 'addEmailForm',
  validate
})(AddEmailForm);

export default AddEmailFormWrapper;
