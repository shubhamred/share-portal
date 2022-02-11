import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import UpdateType from './updateDocTypeConfig';
import validate from '../validate';

const AddAccountFormWrapper = reduxForm({
  form: 'addDocType',
  enableReinitialize: true,
  validate
})(UpdateType);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addDocType')(state)
});

export default connect(mapStateToProps)(AddAccountFormWrapper);
