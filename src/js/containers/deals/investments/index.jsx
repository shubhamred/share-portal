import { connect } from 'react-redux';
import InvestmentList from './investmentList';
import { getInvestments, createInvestment } from '../saga';

import { getCustomers } from '../../patrons/saga';

const mapStateToProps = ({ dealReducer, patronReducer }) => ({
  customerList: patronReducer.customerList,
  investmentList: dealReducer.investmentList,
  totalCount: dealReducer.totalCount,
  createInvestmentStatus: dealReducer.createInvestmentStatus,
  updateInvestmentStatus: dealReducer.updateInvestmentStatus,
  investmentStatusUpdateStatus: dealReducer.investmentStatusUpdateStatus
});

const mapDispatchToProps = () => ({
  getCustomers,
  getInvestments,
  createInvestment
});

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentList);
