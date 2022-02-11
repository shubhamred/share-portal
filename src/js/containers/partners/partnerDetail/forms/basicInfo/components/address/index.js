import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getAddresses } from 'app/containers/patrons/saga';
import Address from './address';
import validate from './validate';

const AddressFormWrapper = reduxForm({
  form: 'addressForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true,
  validate
})(Address);

const mapStateToProps = ({ brandReducer, patronReducer }) => ({
  partnerDetail: brandReducer.brandDetail,
  addresses: patronReducer?.addresses[0],
  initialValues: {
    id: patronReducer?.addresses[0]?.id,
    line1: patronReducer?.addresses[0]?.line1,
    line2: patronReducer?.addresses[0]?.line2,
    line3: patronReducer?.addresses[0]?.line3,
    city: patronReducer?.addresses[0]?.city,
    state: patronReducer?.addresses[0]?.state,
    country: patronReducer?.addresses[0]?.country,
    pincode: patronReducer?.addresses[0]?.pincode
  }
});

const mapDispatchToProps = () => ({
  getAddresses
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressFormWrapper);
