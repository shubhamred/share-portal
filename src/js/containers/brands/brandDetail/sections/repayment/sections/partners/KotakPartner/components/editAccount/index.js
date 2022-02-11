import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import EditAccount from './editAccount';
import validate from './validate';

const EditAccountFormWrapper = reduxForm({
  form: 'editAccount',
  validate
})(EditAccount);

const mapStateToProps = (state) => ({
  formValues: getFormValues('editAccount')(state)
});

export default connect(mapStateToProps, null)(EditAccountFormWrapper);
