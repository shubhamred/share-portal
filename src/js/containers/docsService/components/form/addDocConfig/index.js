import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddDocConfig from './addDocConfig';
import validate from './validate';

const AddAccountFormWrapper = reduxForm({
  form: 'addDocConfig',
  enableReinitialize: true,
  validate
})(AddDocConfig);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addDocConfig')(state)
});

export default connect(mapStateToProps)(AddAccountFormWrapper);
