import { reduxForm } from 'redux-form';
import PatronsListDialog from './patronsListDialog';

const PatronsListFormWrapper = reduxForm({
  form: 'patronsListForm'
})(PatronsListDialog);

export default PatronsListFormWrapper;
