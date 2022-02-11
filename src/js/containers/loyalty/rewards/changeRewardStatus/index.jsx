// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import ChangeRewardStatus from './changeRewardStatus';
// import validate from './validate';
import { changeRewardStatus } from '../../saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  rewardStatusUpdateStatus: loyaltyReducer.rewardStatusUpdateStatus
});

const mapDispatchToProps = () => ({
  changeRewardStatus
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeRewardStatus);
