import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { formatDateStandard } from 'app/utils/utils';
import UpdateReward from './updateReward';
import { getRewardDetail, updateReward } from '../../saga';

const UpdateRewardFormWrapper = reduxForm({
  form: 'updateReward',
  enableReinitialize: true
})(UpdateReward);

const mapStateToProps = ({ loyaltyReducer }) => ({
  updateRewardStatus: loyaltyReducer.updateRewardStatus,
  rewardDetail: loyaltyReducer.rewardDetail,
  initialValues: {
    name: loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.name,
    points: loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.points,
    limitPerUser:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.limitPerUser,
    description:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.description,
    coverImage:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.coverImage,
    bannerImage:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.bannerImage,
    mobileBannerImage:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.mobileBannerImage,
    stepsToRedeem:
      loyaltyReducer.rewardDetail && loyaltyReducer.rewardDetail.stepsToRedeem,
    termsAndConditions:
      loyaltyReducer.rewardDetail
      && loyaltyReducer.rewardDetail.termsAndConditions,
    expireAt:
      loyaltyReducer.rewardDetail
      && loyaltyReducer.rewardDetail.expireAt
      && formatDateStandard(loyaltyReducer.rewardDetail.expireAt)
  }
});

const mapDispatchToProps = () => ({
  getRewardDetail,
  updateReward
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateRewardFormWrapper);
