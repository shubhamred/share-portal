import apiCall from 'app/sagas/api';

export async function getRepayments(queryParam) {
  const url = `/patron-payments`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url
    // TYPES: {
    //   requestType: LOYALTY_REWARD_FETCH_INIT,
    //   successType: LOYALTY_REWARD_FETCH_SUCCESS,
    //   failureType: LOYALTY_REWARD_FETCH_FAIL
    // }
  };
  return apiCall(apiArgs);
}

export async function getConfig(resourceType) {
  const url = `/configured-document-types/${resourceType}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_INIT',
      successType: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_SUCCESS',
      failureType: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_FAIL'
    },
    isErrorRequired: false
  };
  return apiCall(apiArgs);
}

export async function uploadPayments(csvFileLink) {
  const url = `/patron-payments/import`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      csvFileLink
    },
    url
  };
  return apiCall(apiArgs);
}

export async function uploadProjections(csvFileLink) {
  const url = `/brand-revenue-projections/import`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      csvFileLink
    },
    url
  };
  return apiCall(apiArgs);
}

export async function getRevenueProjections(queryParam) {
  const url = `/brand-revenue-projections`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url
  };
  return apiCall(apiArgs);
}
