import { connect } from 'react-redux';
import BusinessInfo from './businessInfoForm';
import { getCommunicationsDetail, getAddresses } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  brandDetail: brandReducer.brandDetail,
  formData: brandReducer.formData,
  numbers: brandReducer.numbers,
  emails: brandReducer.emails,
  addresses: brandReducer.addresses
});

const mapDispatchToProps = () => ({
  getCommunicationsDetail,
  getAddresses
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessInfo);
