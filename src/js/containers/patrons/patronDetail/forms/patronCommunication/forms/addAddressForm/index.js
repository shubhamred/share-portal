import { reduxForm } from 'redux-form';
import AddEmailForm from './addAddressForm';
import validate from './validate';

const AddEmailFormWrapper = reduxForm({
  form: 'addEmailForm',
  validate,
  initialValues: {
    country: 'India'
  }
})(AddEmailForm);

export default AddEmailFormWrapper;
