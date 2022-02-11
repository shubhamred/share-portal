import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddCategory from './addCategory';
import validate from './validate';

const AddAccountFormWrapper = reduxForm({
  form: 'addCategory',
  enableReinitialize: true,
  validate
})(AddCategory);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addCategory')(state)
});

export default connect(mapStateToProps)(AddAccountFormWrapper);
