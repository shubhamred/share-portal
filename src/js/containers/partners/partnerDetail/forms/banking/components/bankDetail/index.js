import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getCustomerBankAccount, updateCustomerBankAccount } from 'app/containers/patrons/saga';
import { getBanks } from 'app/containers/brands/saga';
import BankDetail from './bankDetail';

const BankDetailFormWrapper = reduxForm({
  form: 'bankDetailForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true
})(BankDetail);

const mapStateToProps = ({ brandReducer, patronReducer }) => ({
  banks: brandReducer.banks,
  bankDetails: patronReducer?.bankDetails,
  initialValues: {
    accountHolder: patronReducer?.bankDetails?.accountHolder,
    accountNumber: patronReducer?.bankDetails?.accountNumber,
    bankName: patronReducer?.bankDetails?.bank?.name,
    // bankBranch: '',
    ifsc: patronReducer?.bankDetails?.ifsc,
    isPrimary: patronReducer?.bankDetails?.isPrimary === true ? ['isPrimary'] : []
  }
});

const mapDispatchToProps = () => ({
  getCustomerBankAccount, updateCustomerBankAccount, getBanks
});

export default connect(mapStateToProps, mapDispatchToProps)(BankDetailFormWrapper);
