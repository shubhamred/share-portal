import registry from 'app-registry';
import apiCall from 'app/sagas/api';
import apiCallV2 from 'app/sagas/v2';
import {
  DEAL_CREATE_DEAL_INIT,
  DEAL_CREATE_DEAL_SUCCESS,
  DEAL_CREATE_DEAL_FAIL,
  DEAL_DATA_GENERIC_CONFIG_FETCH_INIT,
  DEAL_DATA_GENERIC_CONFIG_FETCH_SUCCESS,
  DEAL_DATA_GENERIC_CONFIG_FETCH_FAIL,
  DEAL_DATA_CONFIG_FETCH_INIT,
  DEAL_DATA_CONFIG_FETCH_SUCCESS,
  DEAL_DATA_CONFIG_FETCH_FAIL,
  DEAL_LIST_FETCH_INIT,
  DEAL_LIST_FETCH_SUCCESS,
  DEAL_LIST_FETCH_FAIL,
  DEAL_DETAIL_UPDATE_INIT,
  DEAL_DETAIL_UPDATE_SUCCESS,
  DEAL_DETAIL_UPDATE_FAIL,
  DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_INIT,
  DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_SUCCESS,
  DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_FAIL,
  DEAL_CREATE_DOCUMENT_METADATA_POST_INIT,
  DEAL_CREATE_DOCUMENT_METADATA_POST_SUCCESS,
  DEAL_CREATE_DOCUMENT_METADATA_POST_FAIL,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_INIT,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_SUCCESS,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_FAIL,
  DEAL_CREATE_DOCUMENT_FILE_VIEW_INIT,
  DEAL_CREATE_DOCUMENT_FILE_VIEW_SUCCESS,
  DEAL_CREATE_DOCUMENT_FILE_VIEW_FAIL,
  DEAL_CREATE_DOCUMENT_FILE_DELETE_INIT,
  DEAL_CREATE_DOCUMENT_FILE_DELETE_SUCCESS,
  DEAL_CREATE_DOCUMENT_FILE_DELETE_FAIL,
  DEAL_DETAIL_FETCH_INIT,
  DEAL_DETAIL_FETCH_SUCCESS,
  DEAL_DETAIL_FETCH_FAIL,
  DEAL_STATUS_UPDATE_INIT,
  DEAL_STATUS_UPDATE_SUCCESS,
  DEAL_STATUS_UPDATE_FAIL,
  DEAL_DOCUMENT_FETCH_INIT,
  DEAL_DOCUMENT_FETCH_SUCCESS,
  DEAL_DOCUMENT_FETCH_FAIL,
  DEAL_DOCUMENT_TYPE_FETCH_INIT,
  DEAL_DOCUMENT_TYPE_FETCH_SUCCESS,
  DEAL_DOCUMENT_TYPE_FETCH_FAIL,

  // Deal investment
  DEAL_INVESTMENT_CREATE_INIT,
  DEAL_INVESTMENT_CREATE_SUCCESS,
  DEAL_INVESTMENT_CREATE_FAIL,
  DEAL_INVESTMENT_DETAIL_FETCH_INIT,
  DEAL_INVESTMENT_DETAIL_FETCH_SUCCESS,
  DEAL_INVESTMENT_DETAIL_FETCH_FAIL,
  DEAL_INVESTMENT_UPDATE_INIT,
  DEAL_INVESTMENT_UPDATE_SUCCESS,
  DEAL_INVESTMENT_UPDATE_FAIL,
  DEAL_INVESTMENT_STATUS_UPDATE_INIT,
  DEAL_INVESTMENT_STATUS_UPDATE_SUCCESS,
  DEAL_INVESTMENT_STATUS_UPDATE_FAIL,
  DEAL_DOC_CONFIG_INIT,
  DEAL_DOC_CONFIG_SUCCESS,
  DEAL_DOC_CONFIG_FAIL,

  DEAL_INVESTMENT_FETCH_INIT,
  DEAL_INVESTMENT_FETCH_SUCCESS,
  DEAL_INVESTMENT_FETCH_FAIL,
  DEAL_SINGLE_SECTION_UPDATE_INIT,
  DEAL_SINGLE_SECTION_UPDATE_SUCCESS,
  DEAL_SINGLE_SECTION_UPDATE_FAIL,
  DEAL_SECTIONS_FETCH_SUCCESS,
  DEAL_SECTIONS_FETCH_FAIL, DEAL_GROUP_FETCH_SUCCESS, DEAL_GROUP_FETCH_FAIL, DEAL_SINGLE_FIELD_UPDATE,
  DEAL_DOCUMENT_VALIDATION_UPDATE
} from 'app/actions';

import { replace as replaceRouter } from 'react-router-redux';
import { openUrlInNewTab, formatDate } from 'app/utils/utils';
import { DEALS_SERVICE, DMS_SERVICE } from 'app/constants';

// Brands
export async function getDeals(limit, offset, keyword, status, date) {
  const createdAt = date && formatDate(date);
  const url = `/deals`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      limit,
      offset,
      createdAt,
      status,
      keyword
    },
    url,
    TYPES: {
      requestType: DEAL_LIST_FETCH_INIT,
      successType: DEAL_LIST_FETCH_SUCCESS,
      failureType: DEAL_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  const result = await apiCall(apiArgs);
  return result;
}

// eslint-disable-next-line import/prefer-default-export
export async function createDealForm(values, brandName, brandId, brandApplicationId, brandApplicationCode, brandCode) {
  const url = `/deals`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      name: values.dealName,
      brandId,
      brandCode,
      brandApplicationId,
      applicationCode: values.applicationCode,
      brandName,
      dealAmount: values.dealAmount && Number(values.dealAmount),
      maxReturn: values.maxReturn,
      minReturn: values.minReturn,
      returnType: values.returnType,
      dealAmountUnit: values.dealAmountUnit,
      dealCurrency: values.dealCurrency,
      brandLogo: values.brandLogo,
      dealCover: values.dealCover,
      dealBanner: values.dealBanner,
      isPrivate: values.dealType !== 'Public'
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DEAL_INIT,
      successType: DEAL_CREATE_DEAL_SUCCESS,
      failureType: DEAL_CREATE_DEAL_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  const store = registry.get('store');
  if (response.data && response.message === 'OK') {
    store.dispatch(replaceRouter(`/deals/${response.data.id}`));
  }
}

export async function getDealDetail(id) {
  const url = `/deals/${id}/sections`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DETAIL_FETCH_INIT,
      successType: DEAL_DETAIL_FETCH_SUCCESS,
      failureType: DEAL_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    const configId = response.data.configurationId;
    getDealConfigbyId(configId);
    // getConfig();
  }
}

export function getDealConfigbyId(id) {
  const url = `/deals/configs/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DATA_CONFIG_FETCH_INIT,
      successType: DEAL_DATA_CONFIG_FETCH_SUCCESS,
      failureType: DEAL_DATA_CONFIG_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function uploadPatronCSV(data) {
  const url = `/upload/deal-patron`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DATA_CONFIG_FETCH_INIT,
      successType: DEAL_DATA_CONFIG_FETCH_SUCCESS,
      failureType: DEAL_DATA_CONFIG_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function updateDealDetailForm(deal) {
  const url = `/deals/${deal.id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: deal,
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DETAIL_UPDATE_INIT,
      successType: DEAL_DETAIL_UPDATE_SUCCESS,
      failureType: DEAL_DETAIL_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function updateDealPatronList(data) {
  const url = `/deal-patron/${data.dealCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: { patronCodes: data.selectedPatronCodes },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DETAIL_UPDATE_INIT,
      successType: DEAL_DETAIL_UPDATE_SUCCESS,
      failureType: DEAL_DETAIL_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function getDealPatronsList(queryParam) {
  const url = `/deal-patron`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url,
    TYPES: {
      // requestType: PATRON_LIST_FETCH_INIT,
      // successType: PATRON_LIST_FETCH_SUCCESS,
      // failureType: PATRON_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getDealLeadPool(limit, offset, status, date, brandId, keyword) {
  const createdAt = date && formatDate(date);
  const url = '/deals';
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DEALS_SERVICE,
    url,
    params: {
      take: limit,
      page: offset,
      status,
      createdAt,
      brandId,
      keyword
    },
    TYPES: {
      requestType: DEAL_LIST_FETCH_INIT,
      successType: DEAL_LIST_FETCH_SUCCESS,
      failureType: DEAL_LIST_FETCH_FAIL
    }
  };
  if (!status) delete apiArgs.params.status;
  // Accept response if necessary with await
  return apiCall(apiArgs);
}
export function filterDealList(status, date) {
  const formattedDate = formatDate(date);
  const url = `/deals?status=${status}&createdAt=${formattedDate}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_LIST_FETCH_INIT,
      successType: DEAL_LIST_FETCH_SUCCESS,
      failureType: DEAL_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getDocConfig() {
  const url = '/configured-document-types/DEAL';
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DOC_CONFIG_INIT,
      successType: DEAL_DOC_CONFIG_SUCCESS,
      failureType: DEAL_DOC_CONFIG_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

// eslint-disable-next-line import/prefer-default-export
export function getConfig() {
  const url = '/deals/configs';
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DATA_GENERIC_CONFIG_FETCH_INIT,
      successType: DEAL_DATA_GENERIC_CONFIG_FETCH_SUCCESS,
      failureType: DEAL_DATA_GENERIC_CONFIG_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getDocTypeConfig(docType) {
  const url = `/document-types/${docType}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },

    serviceName: 'doc',
    url,
    TYPES: {
      requestType: DEAL_DOCUMENT_TYPE_FETCH_INIT,
      successType: DEAL_DOCUMENT_TYPE_FETCH_SUCCESS,
      failureType: DEAL_DOCUMENT_TYPE_FETCH_FAIL
    }
  };
  apiCall(apiArgs);
}

export async function getDealDocPresignedUrl(id, docType, docCategory) {
  const url = `/documents/DEAL/${id}/upload-url?docType=${docType}&docCategory=${docCategory}&urlType=upload`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_INIT,
      successType: DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_SUCCESS,
      failureType: DEAL_CREATE_DOCUMENT_PRESIGNED_URL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  return response;
}
export async function postMetaData(metaData) {
  const url = `/files`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      key: metaData.key,
      fileName: metaData.name,
      contentType: metaData.type,
      size: metaData.size,
      document: {
        resourceCategory: metaData.resourceCategory || 'DEAL',
        resourceId: metaData.resourceId,
        docCategory: metaData.docCategory,
        docType: metaData.docType
      }
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DOCUMENT_METADATA_POST_INIT,
      successType: DEAL_CREATE_DOCUMENT_METADATA_POST_SUCCESS,
      failureType: DEAL_CREATE_DOCUMENT_METADATA_POST_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response && metaData.resourceCategory !== 'DEAL_IMAGES') {
    getDocs(metaData.resourceId, metaData.resourceCategory);
  }
  return response;
}

export function getDocsbyId(documentId) {
  const url = `/documents/${documentId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_DOCUMENT_FETCH_INIT,
      successType: DEAL_DOCUMENT_FETCH_SUCCESS,
      failureType: DEAL_DOCUMENT_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getDocs(applicationId, resourceCategory = 'DEAL') {
  const url = `/documents/${resourceCategory}/${applicationId}?offset=0&limit=100`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DOCUMENT_LIST_FETCH_INIT,
      successType: DEAL_CREATE_DOCUMENT_LIST_FETCH_SUCCESS,
      failureType: DEAL_CREATE_DOCUMENT_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}
export function getDealImages(dealId) {
  const url = `/documents/DEAL_IMAGES/${dealId}?offset=0&limit=100`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function viewImage(fileId) {
  const url = `/files/${fileId}/preview-url`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DOCUMENT_FILE_VIEW_INIT,
      successType: DEAL_CREATE_DOCUMENT_FILE_VIEW_SUCCESS,
      failureType: DEAL_CREATE_DOCUMENT_FILE_VIEW_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    openUrlInNewTab(response.data.url);
  }
}

export async function removeFile(fileId, applicationId) {
  const url = `/files/${fileId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_CREATE_DOCUMENT_FILE_DELETE_INIT,
      successType: DEAL_CREATE_DOCUMENT_FILE_DELETE_SUCCESS,
      failureType: DEAL_CREATE_DOCUMENT_FILE_DELETE_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response) {
    getDocs(applicationId);
  }
}
export async function removeDealImage(fileId, applicationId) {
  const url = `/files/${fileId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    serviceName: DMS_SERVICE,
    url,
    TYPES: { }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response) {
    await getDealImages(applicationId);
  }
  return response;
}

export function updateDealStatus(values, dealId) {
  const url = `/deals/${dealId}/status`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    isErrorRequired: false,
    data: {
      status: values.status,
      remarks: values.remarks
    },
    serviceName: DEALS_SERVICE,
    url,
    TYPES: {
      requestType: DEAL_STATUS_UPDATE_INIT,
      successType: DEAL_STATUS_UPDATE_SUCCESS,
      failureType: DEAL_STATUS_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

// Deal Investments
export async function getInvestments(queryParam) {
  const url = `/deals/invest`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: queryParam,
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_FETCH_INIT,
      successType: DEAL_INVESTMENT_FETCH_SUCCESS,
      failureType: DEAL_INVESTMENT_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function createInvestment(dealId, investmentFormData) {
  const url = `/deals/${dealId}/invest`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: investmentFormData,
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_CREATE_INIT,
      successType: DEAL_INVESTMENT_CREATE_SUCCESS,
      failureType: DEAL_INVESTMENT_CREATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export function getInvestmentDetail(investmentId) {
  const url = `/deals/invest/${investmentId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_DETAIL_FETCH_INIT,
      successType: DEAL_INVESTMENT_DETAIL_FETCH_SUCCESS,
      failureType: DEAL_INVESTMENT_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function updateInvestment(investmentId, investmentData) {
  const url = `/deals/invest/${investmentId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: investmentData,
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_UPDATE_INIT,
      successType: DEAL_INVESTMENT_UPDATE_SUCCESS,
      failureType: DEAL_INVESTMENT_UPDATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export async function changeInvestmentStatus(investmentId, investmentStatusData, isStatus = false) {
  const url = `/deals/invest/${investmentId}${isStatus ? '/status' : ''}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: investmentStatusData,
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_STATUS_UPDATE_INIT,
      successType: DEAL_INVESTMENT_STATUS_UPDATE_SUCCESS,
      failureType: DEAL_INVESTMENT_STATUS_UPDATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export async function changeMultiInvestmentStatus(investmentStatusData) {
  const url = `/deals/invest/status/batch`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: investmentStatusData,
    url,
    TYPES: {
      requestType: DEAL_INVESTMENT_STATUS_UPDATE_INIT,
      successType: DEAL_INVESTMENT_STATUS_UPDATE_SUCCESS,
      failureType: DEAL_INVESTMENT_STATUS_UPDATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

// Clone Deal
export async function cloneDeal(dealId, formData) {
  const url = `/deals/${dealId}/clone`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: formData,
    url
  };
  return apiCall(apiArgs);
}

export async function getAllSections(dealId) {
  const url = `/deals/${dealId}/sections`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    TYPES: {
      successType: DEAL_SECTIONS_FETCH_SUCCESS,
      failureType: DEAL_SECTIONS_FETCH_FAIL
    },
    url
  };
  return apiCall(apiArgs);
}
export async function getSingleSection(dealId, sectionId) {
  const url = `/sections/${sectionId}/fields`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: {
      requestType: DEAL_SINGLE_SECTION_UPDATE_INIT,
      successType: DEAL_SINGLE_SECTION_UPDATE_SUCCESS,
      failureType: DEAL_SINGLE_SECTION_UPDATE_FAIL
    }
  };
  return apiCall(apiArgs);
}
export async function saveSingleSection(dealId, sectionId, data) {
  const url = `/sections/${sectionId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url
  };
  return apiCall(apiArgs);
}
export async function addSingleSection(data) {
  const url = `/sections`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {
      requestType: DEAL_SINGLE_SECTION_UPDATE_INIT,
      successType: DEAL_SINGLE_SECTION_UPDATE_SUCCESS,
      failureType: DEAL_SINGLE_SECTION_UPDATE_FAIL
    }
  };
  return apiCall(apiArgs);
}

export async function getAllGroup() {
  const url = `/groups`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params: {
      take: 50
    },
    TYPES: {
      successType: DEAL_GROUP_FETCH_SUCCESS,
      failureType: DEAL_GROUP_FETCH_FAIL
    }
  };
  return apiCall(apiArgs);
}

export async function postNewGroup(data) {
  const url = `/groups`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Create a new field
 * @param data
 * @returns {Promise<null|*>}
 */
export async function postNewField(data) {
  const url = `/fields`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get field data by id
 * @param fieldId
 * @returns {Promise<null|*>}
 */
export async function getSingleField(fieldId) {
  const url = `/fields/${fieldId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: {
      successType: DEAL_SINGLE_FIELD_UPDATE
    }
  };
  return apiCall(apiArgs);
}

/**
 * @description Update a field
 * @param fieldId
 * @param data
 * @returns {Promise<null|*>}
 */
export async function updateField(fieldId, data) {
  const url = `/fields/${fieldId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Delete/Archive field by id
 * @param fieldId
 * @returns {Promise<null|*>}
 */
export async function deleteField(fieldId) {
  const url = `/fields/${fieldId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Update multiple fields order
 * @param data
 * @returns {Promise<null|*>}
 */
export async function updateFieldOrder(data) {
  const url = `/fields/order`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get the Signed Url for Assets image upload
 * @param data
 * @returns {Promise<null|*>}
 */
export async function getAssetsSingedUrl(data) {
  const url = `/uploads`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get deal status graph
 * @returns {Promise<null|any>}
 */
export const getDealStatus = () => {
  const url = `/deals/status-graph`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url
  };
  return apiCall(apiArgs);
};

/**
 * @description Get Investment status graph
 * @returns {Promise<null|any>}
 */
export const getInvestmentStatuses = () => {
  const url = `/deals/invest/status-graph`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      successType: 'DEAL_INVESTMENT_STATUSES'
    }
  };
  return apiCall(apiArgs);
};

export const getBusinessDetails = (id) => {
  const url = `/companies/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
    }
  };
  return apiCall(apiArgs);
};

export const getAddresses = (id) => {
  const url = `/addresses/resources/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

export const getAddressesV2 = (code) => {
  const url = `/addresses/resources/${code}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCallV2(apiArgs);
};

export const getDealDocumentStatus = (dealCode) => {
  const url = `/deals/validation/${dealCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      successType: DEAL_DOCUMENT_VALIDATION_UPDATE
    }
  };
  return apiCall(apiArgs);
};

export const getStatusHistory = (limit, offset, dealId) => {
  const url = `/deals/${dealId}/status-history`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params: {
      take: limit,
      page: offset
    },
    TYPES: { }
  };
  return apiCall(apiArgs);
};
