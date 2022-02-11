import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
// import validate from './validate';
import LinkDocType from './linkDocType';

const LinkTypeFormWrapper = reduxForm({
  form: 'addDocType',
  enableReinitialize: true
})(LinkDocType);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addDocType')(state)
});

export default connect(mapStateToProps)(LinkTypeFormWrapper);
