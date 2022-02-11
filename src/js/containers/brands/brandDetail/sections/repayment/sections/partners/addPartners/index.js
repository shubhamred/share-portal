import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import AddPartners from './addPartners';
import validate from './validate';

const CreateDealFormWrapper = reduxForm({
  form: 'addPartners',
  validate
})(AddPartners);

const mapStateToProps = (state) => ({
  initialValues: {
    settlementBucket: 'settlement_rp_1800'
  },
  formValues: getFormValues('addPartners')(state)
});

export default connect(mapStateToProps, null)(CreateDealFormWrapper);
