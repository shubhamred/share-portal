// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import ChangeInvestmentStatus from './changeInvestmentStatus';
// import validate from './validate';
import { changeInvestmentStatus, changeMultiInvestmentStatus } from '../../saga';

const mapStateToProps = ({ dealReducer }) => ({
  investmentStatusUpdateStatus: dealReducer.investmentStatusUpdateStatus,
  investmentStatuses: dealReducer.investmentStatuses
});

const mapDispatchToProps = () => ({
  changeInvestmentStatus,
  changeMultiInvestmentStatus
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeInvestmentStatus);
