import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddDocType from './addDocType';
import validate from './validate';

const AddAccountFormWrapper = reduxForm({
  form: 'addDocType',
  enableReinitialize: true,
  validate
})(AddDocType);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addDocType')(state)
});

export default connect(mapStateToProps)(AddAccountFormWrapper);
