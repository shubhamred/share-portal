import { reduxForm } from 'redux-form';
import EditNumberForm from './editNumberForm';
import validate from './validate';

const EditNumberFormWrapper = reduxForm({
  form: 'editNumberForm',
  destroyOnUnmount: false,
  validate
})(EditNumberForm);

export default EditNumberFormWrapper;
