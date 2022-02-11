import {
  GENERIC_REMARK_CREATE_INIT,
  GENERIC_REMARK_CREATE_SUCCESS,
  GENERIC_REMARK_CREATE_FAIL,
  GENERIC_REMARKS_GET_INIT,
  GENERIC_REMARKS_GET_SUCCESS,
  GENERIC_REMARKS_GET_FAIL
} from 'app/actions';
import apiCall from 'app/sagas/api';

export async function onSubmitRemarks(values) {
  const url = '/remarks';
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      resource: values.resource,
      resourceId: values.resourceId,
      remark: values.remarks
    },
    url,
    TYPES: {
      requestType: GENERIC_REMARK_CREATE_INIT,
      successType: GENERIC_REMARK_CREATE_SUCCESS,
      failureType: GENERIC_REMARK_CREATE_FAIL
    }
  };
  apiCall(apiArgs);
}

export async function getRemarks(values) {
  const url = `/remarks/resources/${values.resourceId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: values.limit || 10,
      page: values.offset || 1
    },
    url,
    TYPES: {
      requestType: GENERIC_REMARKS_GET_INIT,
      successType: GENERIC_REMARKS_GET_SUCCESS,
      failureType: GENERIC_REMARKS_GET_FAIL
    }
  };
  apiCall(apiArgs);
}
