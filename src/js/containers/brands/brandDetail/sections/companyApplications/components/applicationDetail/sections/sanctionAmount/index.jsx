import { reduxForm } from 'redux-form';
import SanctionAmount from './sanctionAmount';
import validate from './validate';

const SanctionAmountForm = reduxForm({
  form: 'sanctionAmountForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  validate
})(SanctionAmount);

export default SanctionAmountForm;
