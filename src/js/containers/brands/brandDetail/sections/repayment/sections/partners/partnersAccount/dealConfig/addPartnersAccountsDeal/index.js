import { reduxForm } from 'redux-form';
import AddPartnersAccounts from './addPartnersAccounts';
import validate from './validate';

const CreateDealFormWrapper = reduxForm({
  form: 'addPartnersAccounts',
  validate
})(AddPartnersAccounts);

export default CreateDealFormWrapper;
