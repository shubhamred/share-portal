import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddApplication from './addApplication';
import validate from './validate';

const CreateApplicationFormWrapper = reduxForm({
  form: 'addApplication',
  validate
})(AddApplication);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addApplication')(state)
});

export default connect(mapStateToProps, null)(CreateApplicationFormWrapper);
