import { connect } from 'react-redux';
import BrandDetail from './brandDetail';
import { getBrandDetail, updateBrandStatus } from '../saga';
import { createDealForm, getConfig } from '../../deals/saga';

const mapStateToProps = ({ brandReducer, dealReducer }) => ({
  brandDetail: brandReducer.brandDetail,
  genericConfig: dealReducer.genericConfig
});

const mapDispatchToProps = () => ({
  getBrandDetail,
  updateBrandStatus,
  createDealForm,
  getConfig
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandDetail);
