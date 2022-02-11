import { reduxForm } from 'redux-form';
import NewApplicant from './addApplicant';
import validate from './validate';

const AddNewApplicantWrapper = reduxForm({
  form: 'addApplicant',
  validate
})(NewApplicant);

export default AddNewApplicantWrapper;
