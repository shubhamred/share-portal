import Immutable from 'seamless-immutable';
import {
  LOYALTY_REWARD_FETCH_INIT,
  LOYALTY_REWARD_FETCH_SUCCESS,
  LOYALTY_REWARD_FETCH_FAIL,

  LOYALTY_REWARD_CREATE_INIT,
  LOYALTY_REWARD_CREATE_SUCCESS,
  LOYALTY_REWARD_CREATE_FAIL,

  LOYALTY_REWARD_DETAIL_FETCH_INIT,
  LOYALTY_REWARD_DETAIL_FETCH_SUCCESS,
  LOYALTY_REWARD_DETAIL_FETCH_FAIL,

  LOYALTY_REWARD_UPDATE_INIT,
  LOYALTY_REWARD_UPDATE_SUCCESS,
  LOYALTY_REWARD_UPDATE_FAIL,

  LOYALTY_REWARD_STATUS_UPDATE_INIT,
  LOYALTY_REWARD_STATUS_UPDATE_SUCCESS,
  LOYALTY_REWARD_STATUS_UPDATE_FAIL,

  LOYALTY_POINT_FETCH_INIT,
  LOYALTY_POINT_FETCH_SUCCESS,
  LOYALTY_POINT_FETCH_FAIL,

  LOYALTY_POINT_CREATE_INIT,
  LOYALTY_POINT_CREATE_SUCCESS,
  LOYALTY_POINT_CREATE_FAIL,

  LOYALTY_POINT_DETAIL_FETCH_INIT,
  LOYALTY_POINT_DETAIL_FETCH_SUCCESS,
  LOYALTY_POINT_DETAIL_FETCH_FAIL,

  LOYALTY_POINT_UPDATE_SUCCESS,
  LOYALTY_POINT_UPDATE_FAIL

} from '../../actions';

const defaultState = Immutable.flatMap({
  createRewardStatus: null,
  updateRewardStatus: null,
  rewardStatusUpdateStatus: null,
  rewardDetail: null,
  pointCreate: null,
  rewardList: null,
  pointList: null,
  applicantList: null,
  leadData: null,
  totalCount: 0,
  formData: {
    currentFormName: '',
    data: {}
  },
  addresses: [],
  businessDetailsUpdate: null,
  performanceInfoUpdate: null,
  applicantDetailsUpdate: null,
  banks: [],
  accounts: [],
  accountDetailsUpdate: null,
  accountsFetchInProgress: false,
  applicantInfo: {},
  messageType: ''
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOYALTY_REWARD_FETCH_INIT:
      return Immutable.merge(state, { rewardList: null });

    case LOYALTY_REWARD_FETCH_SUCCESS:
      return Immutable.merge(state, {
        rewardList: action.data.data,
        totalCount: action.data.meta.total
      });

    case LOYALTY_REWARD_FETCH_FAIL:
      return Immutable.merge(state, { rewardList: null, totalCount: 0 });

    case LOYALTY_REWARD_CREATE_INIT:
      return Immutable.merge(state, { createRewardStatus: 'init' });

    case LOYALTY_REWARD_CREATE_SUCCESS:
      return Immutable.merge(state, { rewardDetail: action.data.data, createRewardStatus: 'success' });

    case LOYALTY_REWARD_CREATE_FAIL:
      return Immutable.merge(state, { createRewardStatus: 'failed' });

    case LOYALTY_REWARD_DETAIL_FETCH_INIT:
      return Immutable.merge(state, { rewardDetail: null });

    case LOYALTY_REWARD_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, { rewardDetail: action.data.data });

    case LOYALTY_REWARD_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { rewardDetail: null });

    case LOYALTY_REWARD_UPDATE_INIT:
      return Immutable.merge(state, { updateRewardStatus: 'init' });

    case LOYALTY_REWARD_UPDATE_SUCCESS:
      return Immutable.merge(state, { rewardDetail: action.data.data, updateRewardStatus: 'success' });

    case LOYALTY_REWARD_UPDATE_FAIL:
      return Immutable.merge(state, { updateRewardStatus: 'failed' });

    case LOYALTY_REWARD_STATUS_UPDATE_INIT:
      return Immutable.merge(state, { rewardStatusUpdateStatus: 'init' });

    case LOYALTY_REWARD_STATUS_UPDATE_SUCCESS:
      return Immutable.merge(state, { rewardStatusUpdateStatus: 'success' });

    case LOYALTY_REWARD_STATUS_UPDATE_FAIL:
      return Immutable.merge(state, { rewardStatusUpdateStatus: 'failed' });

    case LOYALTY_POINT_FETCH_INIT:
      return Immutable.merge(state, { pointList: null });

    case LOYALTY_POINT_FETCH_SUCCESS:
      return Immutable.merge(state, {
        pointList: action.data.data,
        totalCount: action.data.meta.total
      });

    case LOYALTY_POINT_FETCH_FAIL:
      return Immutable.merge(state, { pointList: null, totalCount: 0 });

    case LOYALTY_POINT_CREATE_INIT:
      return Immutable.merge(state, { pointStatus: 'init' });

    case LOYALTY_POINT_CREATE_SUCCESS:
      return Immutable.merge(state, { pointDetail: action.data.data, pointStatus: 'success' });

    case LOYALTY_POINT_CREATE_FAIL:
      return Immutable.merge(state, { pointStatus: 'failed' });

    case LOYALTY_POINT_DETAIL_FETCH_INIT:
      return Immutable.merge(state, { pointDetail: null });

    case LOYALTY_POINT_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, { pointDetail: action.data.data });

    case LOYALTY_POINT_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { pointDetail: null });

    case LOYALTY_POINT_UPDATE_SUCCESS:
      return Immutable.merge(state, { pointDetail: action.data.data });

    case LOYALTY_POINT_UPDATE_FAIL:
      return Immutable.merge(state, { pointUpdate: 'failed' });

    default:
      return state;
  }
};
