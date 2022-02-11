import { connect } from 'react-redux';
import BalanceSheet from './balanceSheet';
import { getFinancialBalanceSheet } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialBalanceSheet: brandReducer.financialBalanceSheet,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialBalanceSheet
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceSheet);
