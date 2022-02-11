import { connect } from 'react-redux';
import Overview from './overview';
import { getFinancialOverview } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialOverview: brandReducer.financialOverview
});

const mapDispatchToProps = () => ({
  getFinancialOverview
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
