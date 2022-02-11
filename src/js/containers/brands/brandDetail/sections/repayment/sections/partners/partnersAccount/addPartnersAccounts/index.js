import { reduxForm } from 'redux-form';
import AddPartnersAccounts from './addPartnersAccounts';
import validate from './validate';

const AddPartnersAccount = reduxForm({
  form: 'addPartnersAccounts',
  validate
})(AddPartnersAccounts);

export default AddPartnersAccount;
