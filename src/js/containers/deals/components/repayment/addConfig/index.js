import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddConfig from './addConfig';
import validate from './validate';

const CreateDealFormWrapper = reduxForm({
  form: 'AddConfig',
  validate
})(AddConfig);

const mapStateToProps = (state) => ({
  initialValues: {
  },
  formValues: getFormValues('AddConfig')(state)
});

export default connect(mapStateToProps, null)(CreateDealFormWrapper);
