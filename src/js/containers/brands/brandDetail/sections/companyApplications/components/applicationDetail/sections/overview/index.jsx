import { reduxForm } from 'redux-form';
import Overview from './overview';
import validate from './validate';

const OverviewForm = reduxForm({
  form: 'overviewForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  validate
})(Overview);

export default OverviewForm;
