import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddAccount from './addAccount';
import validate from './validate';

const CreateAccountFormWrapper = reduxForm({
  form: 'addAccounts',
  validate
})(AddAccount);

const mapStateToProps = (state) => ({
  initialValues: {
    settlementBucket: 'settlement_rp_1800'
  },
  formValues: getFormValues('addAccounts')(state)
});

export default connect(mapStateToProps, null)(CreateAccountFormWrapper);
