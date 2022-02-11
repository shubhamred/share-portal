import { reduxForm } from 'redux-form';
import EditAddressForm from './editAddressForm';
import validate from './validate';

const EditAddressFormWrapper = reduxForm({
  form: 'editAddressForm',
  destroyOnUnmount: true,
  validate
})(EditAddressForm);

export default EditAddressFormWrapper;
