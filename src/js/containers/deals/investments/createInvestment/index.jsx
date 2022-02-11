// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import CreateInvestment from './createInvestment';
// import validate from './validate';
import { getDeals, createInvestment } from '../../saga';
import { getCustomers } from '../../../patrons/saga';

const mapStateToProps = ({ dealReducer }) => ({
  createInvestmentStatus: dealReducer.createInvestmentStatus,
  investmentDetail: dealReducer.investmentDetail
});

const mapDispatchToProps = () => ({
  createInvestment,
  getCustomers,
  getDeals
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateInvestment);
