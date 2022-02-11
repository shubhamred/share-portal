import { connect } from 'react-redux';
import RewardList from './rewardList';
import { getRewards, createReward } from '../saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  rewardList: loyaltyReducer.rewardList,
  totalCount: loyaltyReducer.totalCount,
  createRewardStatus: loyaltyReducer.createRewardStatus,
  updateRewardStatus: loyaltyReducer.updateRewardStatus,
  rewardStatusUpdateStatus: loyaltyReducer.rewardStatusUpdateStatus
});

const mapDispatchToProps = (dispatch) => ({
  getRewards,
  createReward,
  onCancel: () => {
    dispatch({ type: 'LOYALTY:CREATE_BRAND:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardList);
