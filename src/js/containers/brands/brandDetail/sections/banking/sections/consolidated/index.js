import { connect } from 'react-redux';
import Consolidated from './consolidated';
import { getFinancialOverview } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialOverview: brandReducer.financialOverview
});

const mapDispatchToProps = () => ({
  getFinancialOverview
});

export default connect(mapStateToProps, mapDispatchToProps)(Consolidated);
