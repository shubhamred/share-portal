import { reduxForm } from 'redux-form';
import CreateDealForm from './createDealForm';
import validate from './validate';

const CreateDealFormWrapper = reduxForm({
  form: 'dealForm',
  validate
})(CreateDealForm);

export default CreateDealFormWrapper;
