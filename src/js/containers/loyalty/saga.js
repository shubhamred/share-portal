import registry from 'app-registry';
import { replace as replaceRouter } from 'react-router-redux';

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
  LOYALTY_POINT_UPDATE_INIT,
  LOYALTY_POINT_UPDATE_SUCCESS,
  LOYALTY_POINT_UPDATE_FAIL
} from 'app/actions';
import apiCall from 'app/sagas/api';
// import { DMS_SERVICE } from 'app/constants';

// Loyalty Rewards
export async function getRewards(queryParam) {
  const url = `/loyalty/rewards`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url,
    TYPES: {
      requestType: LOYALTY_REWARD_FETCH_INIT,
      successType: LOYALTY_REWARD_FETCH_SUCCESS,
      failureType: LOYALTY_REWARD_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function createReward(rewardFormData) {
  const url = `/loyalty/rewards`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: rewardFormData,
    url,
    TYPES: {
      requestType: LOYALTY_REWARD_CREATE_INIT,
      successType: LOYALTY_REWARD_CREATE_SUCCESS,
      failureType: LOYALTY_REWARD_CREATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export function getRewardDetail(rewardId) {
  const url = `/loyalty/rewards/${rewardId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: LOYALTY_REWARD_DETAIL_FETCH_INIT,
      successType: LOYALTY_REWARD_DETAIL_FETCH_SUCCESS,
      failureType: LOYALTY_REWARD_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function updateReward(rewardId, rewardData) {
  const url = `/loyalty/rewards/${rewardId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: rewardData,
    url,
    TYPES: {
      requestType: LOYALTY_REWARD_UPDATE_INIT,
      successType: LOYALTY_REWARD_UPDATE_SUCCESS,
      failureType: LOYALTY_REWARD_UPDATE_FAIL
    }
  };
  const response = await apiCall(apiArgs);
  const store = registry.get('store');
  if (response.data && response.message === 'OK') {
    // getBrandLeadPool();
    store.dispatch(replaceRouter(`/loyalty/rewards`));
  }
}

export async function changeRewardStatus(rewardId, rewardStatusData) {
  const url = `/loyalty/rewards/${rewardId}/status`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: rewardStatusData,
    url,
    TYPES: {
      requestType: LOYALTY_REWARD_STATUS_UPDATE_INIT,
      successType: LOYALTY_REWARD_STATUS_UPDATE_SUCCESS,
      failureType: LOYALTY_REWARD_STATUS_UPDATE_FAIL
    }
  };
  await apiCall(apiArgs);
}

// Loyalty Points
export async function getPoints(queryParam) {
  const url = `/loyalty/points`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url,
    TYPES: {
      requestType: LOYALTY_POINT_FETCH_INIT,
      successType: LOYALTY_POINT_FETCH_SUCCESS,
      failureType: LOYALTY_POINT_FETCH_FAIL
    }
  };
  return apiCall(apiArgs);
}

export async function createPoint(pointData) {
  const url = `/loyalty/points`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: pointData,
    url,
    TYPES: {
      requestType: LOYALTY_POINT_CREATE_INIT,
      successType: LOYALTY_POINT_CREATE_SUCCESS,
      failureType: LOYALTY_POINT_CREATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export function getPointDetail(pointId) {
  const url = `/loyalty/points/${pointId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: LOYALTY_POINT_DETAIL_FETCH_INIT,
      successType: LOYALTY_POINT_DETAIL_FETCH_SUCCESS,
      failureType: LOYALTY_POINT_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function updatePoint(pointId, pointData) {
  const url = `/loyalty/points/${pointId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      amount: Number(pointData.fundingAmount)
    },
    url,
    TYPES: {
      requestType: LOYALTY_POINT_UPDATE_INIT,
      successType: LOYALTY_POINT_UPDATE_SUCCESS,
      failureType: LOYALTY_POINT_UPDATE_FAIL
    }
  };
  const response = await apiCall(apiArgs);
  const store = registry.get('store');
  if (response.data && response.message === 'OK') {
    // getBrandLeadPool();
    store.dispatch(replaceRouter(`/loyalty/points`));
  }
}

export async function redeemReward(rewardId, customerId) {
  const url = `/loyalty/rewards/${rewardId}/redeem`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: { customerId },
    url,
    TYPES: {
      requestType: LOYALTY_POINT_CREATE_INIT,
      successType: LOYALTY_POINT_CREATE_SUCCESS,
      failureType: LOYALTY_POINT_CREATE_FAIL
    }
  };
  return apiCall(apiArgs);
}
