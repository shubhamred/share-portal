import { connect } from 'react-redux';
import { getAddresses, saveAddAddress, updateAddress, clearAddresses } from '../../../../../saga';
import AddressTabContent from './addressTabContent';

const mapStateToProps = ({ patronReducer }) => ({
  communicationDetailsUpdate: patronReducer.communicationDetailsUpdate,
  formData: patronReducer.formData,
  addresses: patronReducer.addresses,
  addressesFetchInProgress: patronReducer.addressesFetchInProgress
});

const mapDispatchToProps = () => ({
  getAddresses, saveAddAddress, updateAddress, clearAddresses
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressTabContent);
