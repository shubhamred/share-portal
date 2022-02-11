import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import CreatePatron from './createPatron';
import validate from './validate';

const CreatePatronFormWrapper = reduxForm({
  form: 'createPatron',
  validate
})(CreatePatron);

const mapStateToProps = ({ patronReducer }) => ({
  errorMsg: patronReducer.errorMsg,
  patronCreate: patronReducer.patronCreate
});

export default connect(mapStateToProps)(CreatePatronFormWrapper);
