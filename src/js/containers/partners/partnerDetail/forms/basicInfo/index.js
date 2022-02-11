import { connect } from 'react-redux';
import { saveAddAddress, updateAddress } from 'app/containers/patrons/saga';
import BasicInfo from './basicInfo';

const mapStateToProps = ({ brandReducer }) => ({
  partnerDetail: brandReducer.brandDetail,
  formData: brandReducer.formData,
  addresses: brandReducer.addresses
});

const mapDispatchToProps = () => ({
  saveAddAddress, updateAddress
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicInfo);
