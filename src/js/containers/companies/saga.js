import apiCall from 'app/sagas/api';
import { formatDate } from 'app/utils/utils';
import {
  BRAND_BUSINESS_DETAILS_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_FETCH_INIT, BRAND_BUSINESS_DETAILS_FETCH_SUCCESS,
  BRAND_LEAD_DETAIL_FETCH_FAIL,
  BRAND_LEAD_DETAIL_FETCH_INIT,
  BRAND_LEAD_DETAIL_FETCH_SUCCESS
} from 'app/actions';

export async function getCompanies(limit, offset, keyword, status, date, fields) {
  const createdAt = date && formatDate(date);
  const url = `/companies`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: limit,
      page: offset,
      createdAt,
      status,
      keyword,
      ...fields
    },
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

export function getCompanyDetail(id) {
  const url = `/companies/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_DETAIL_FETCH_INIT,
      successType: BRAND_LEAD_DETAIL_FETCH_SUCCESS,
      failureType: BRAND_LEAD_DETAIL_FETCH_FAIL
    }
  };
  return apiCall(apiArgs);
}

export function getBusinessDetails(id) {
  const url = `/companies/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_BUSINESS_DETAILS_FETCH_INIT,
      successType: BRAND_BUSINESS_DETAILS_FETCH_SUCCESS,
      failureType: BRAND_BUSINESS_DETAILS_FETCH_FAIL
    }
  };
  return apiCall(apiArgs);
}

export function createBrand(data) {
  const url = `/investors`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

/**
 * @description Create new customer in company
 * @param companyId
 * @param data
 * @returns {Promise<null|*>}
 */
export function linkTeamToCompany(companyId, data) {
  const url = `/companies/${companyId}/customers`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

export function getCompanyCustomers(companyId) {
  const url = `/companies/${companyId}/customers`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
    }
  };
  return apiCall(apiArgs);
}
