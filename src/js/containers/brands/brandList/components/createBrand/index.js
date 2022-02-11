import { connect } from 'react-redux';
import CreateBrand from './createBrand';

const mapStateToProps = ({ brandReducer }) => ({
  brandCreate: brandReducer.brandCreate
});

export default connect(mapStateToProps)(CreateBrand);
