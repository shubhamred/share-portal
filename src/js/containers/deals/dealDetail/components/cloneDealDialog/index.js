import { reduxForm } from 'redux-form';
import CloneDealForm from './cloneDealForm';
import validate from './validate';

const CloneDealFormWrapper = reduxForm({
  form: 'dealForm',
  validate
})(CloneDealForm);

export default CloneDealFormWrapper;
