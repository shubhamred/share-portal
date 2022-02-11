import { connect } from 'react-redux';
import BusinessInfo from './businessInfoForm';

const mapStateToProps = ({ brandReducer }) => ({
  brandDetail: brandReducer.brandDetail,
  formData: brandReducer.formData,
  numbers: brandReducer.numbers,
  emails: brandReducer.emails,
  addresses: brandReducer.addresses
});

export default connect(
  mapStateToProps
)(BusinessInfo);
