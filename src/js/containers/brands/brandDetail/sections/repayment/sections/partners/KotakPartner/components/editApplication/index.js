import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import EditApplication from './editApplication';
import validate from './validate';

const EditApplicationFormWrapper = reduxForm({
  form: 'editApplication',
  validate
})(EditApplication);

const mapStateToProps = (state) => ({
  formValues: getFormValues('editApplication')(state)
});

export default connect(mapStateToProps, null)(EditApplicationFormWrapper);
