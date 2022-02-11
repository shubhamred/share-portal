import { connect } from 'react-redux';
import CashFlow from './cashFlow';
import { getFinancialCashFlow } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialCashFlow: brandReducer.financialCashFlow
});

const mapDispatchToProps = () => ({
  getFinancialCashFlow
});

export default connect(mapStateToProps, mapDispatchToProps)(CashFlow);
