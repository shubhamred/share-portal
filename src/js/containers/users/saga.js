import apiCall from 'app/sagas/api';

export const getPortalUserList = async (queryParam) => {
  const url = `/users`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url
  };
  return apiCall(apiArgs);
};

export const addNewPortalUser = async (data) => {
  const url = `/users`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url
  };
  return apiCall(apiArgs);
};

export const deletePortalUser = async (userId) => {
  const url = `/users/${userId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    url
  };
  return apiCall(apiArgs);
};
