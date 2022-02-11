import apiCall from 'app/sagas/api';
import {
  BRAND_BUSINESS_DETAILS_UPDATE_INIT,
  BRAND_BUSINESS_DETAILS_UPDATE_SUCCESS,
  BRAND_BUSINESS_DETAILS_UPDATE_FAIL
} from 'app/actions';
import { getBusinessDetails } from 'app/containers/brands/saga';

export function createCompany(data) {
  const url = `/companies`;
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

export async function updateCompanyDetails(values, id) {
  const url = `/companies/${id}`;
  const payload = {
    businessName: values.nbfcName,
    website: values.nbfcWebsite ? values.nbfcWebsite : null,
    legalName: values.nbfcLegalName,
    nachData: {
      corporateUtilityCode: values.corporateUtilityCode || undefined,
      corporateConfigurationId: values.corporateConfigurationId || undefined
    }
  };
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: payload,
    url,
    TYPES: {
      requestType: BRAND_BUSINESS_DETAILS_UPDATE_INIT,
      successType: BRAND_BUSINESS_DETAILS_UPDATE_SUCCESS,
      failureType: BRAND_BUSINESS_DETAILS_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await

  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    getBusinessDetails(id);
  }
}
