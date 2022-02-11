import { reduxForm } from 'redux-form';
import AddNumberForm from './addNumberForm';
import validate from './validate';

const AddNumberFormWrapper = reduxForm({
  form: 'addNumberForm',
  validate
})(AddNumberForm);

export default AddNumberFormWrapper;
