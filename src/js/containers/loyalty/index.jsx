import { connect } from 'react-redux';
import LoyaltyDashboard from './loyaltyDashboard';
import { getRewards, createReward } from './saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  rewardList: loyaltyReducer.rewardList,
  totalCount: loyaltyReducer.totalCount,
  rewardStatus: loyaltyReducer.rewardStatus
});

const mapDispatchToProps = (dispatch) => ({
  getRewards,
  createReward,
  onCancel: () => {
    dispatch({ type: 'LOYALTY:CREATE_BRAND:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoyaltyDashboard);
