import { connect } from 'react-redux';
import BrandList from './brandList';
import { getBrandLeadPool, createBrand } from '../saga';

const mapStateToProps = ({ brandReducer }) => ({
  leadData: brandReducer.leadData,
  totalCount: brandReducer.totalCount,
  brandCreate: brandReducer.brandCreate
});

const mapDispatchToProps = (dispatch) => ({
  getBrandLeadPool,
  createBrand,
  onCancel: () => {
    dispatch({ type: 'BRAND:CREATE_BRAND:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandList);
