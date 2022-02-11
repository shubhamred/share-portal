import { connect } from 'react-redux';
import DealList from './dealList';
import { createDealForm, getConfig, getDealLeadPool } from '../saga';
import { getBrandLeadPool } from '../../brands/saga';

const mapStateToProps = ({ brandReducer, dealReducer }) => ({
  brandList: brandReducer.leadData,
  config: dealReducer.dealConfig,
  genericConfig: dealReducer.genericConfig,
  dealList: dealReducer.dealList,
  totalCount: dealReducer.totalCount
});

const mapDispatchToProps = () => ({
  createDealForm,
  getBrandLeadPool,
  getDealLeadPool,
  getConfig
});

export default connect(mapStateToProps, mapDispatchToProps)(DealList);
