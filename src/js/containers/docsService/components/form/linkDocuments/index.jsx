import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
// import validate from './validate';
import LinkDocuments from './linkDocuments';

const LinkTypeFormWrapper = reduxForm({
  form: 'addDocType',
  enableReinitialize: true
})(LinkDocuments);

const mapStateToProps = (state) => ({
  formValues: getFormValues('addDocType')(state)
});

export default connect(mapStateToProps)(LinkTypeFormWrapper);
