import { connect } from 'react-redux';
import ProfitAndLoss from './profitAndLoss';
import { getFinancialProfitAndLoss } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialProfitAndLoss: brandReducer.financialProfitAndLoss
});

const mapDispatchToProps = () => ({
  getFinancialProfitAndLoss
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfitAndLoss);
