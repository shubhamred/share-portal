import { reduxForm } from 'redux-form';
import EditEmailForm from './editEmailForm';
import validate from './validate';

const EditEmailFormWrapper = reduxForm({
  form: 'editEmailForm',
  destroyOnUnmount: false,
  validate
})(EditEmailForm);

export default EditEmailFormWrapper;
