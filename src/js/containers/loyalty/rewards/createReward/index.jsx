// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import CreateReward from './createReward';
// import validate from './validate';
import { createReward } from '../../saga';
import { getBrands } from '../../../brands/saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  createRewardStatus: loyaltyReducer.createRewardStatus,
  rewardDetail: loyaltyReducer.rewardDetail
});

const mapDispatchToProps = (dispatch) => ({
  createReward,
  getBrands,
  onCancel: () => {
    dispatch({ type: 'LOYALTY:CREATE_REWARD:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateReward);
