import registry from 'app-registry';
import { replace as replaceRouter } from 'react-router-redux';

import {
  PATRON_LEAD_LIST_FETCH_INIT,
  PATRON_LEAD_LIST_FETCH_SUCCESS,
  PATRON_LEAD_LIST_FETCH_FAIL,
  PATRON_CREATE_PATRON_INIT,
  PATRON_CREATE_PATRON_SUCCESS,
  PATRON_CREATE_PATRON_FAIL,
  PATRON_LEAD_DETAIL_FETCH_INIT,
  PATRON_LEAD_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_DETAIL_FETCH_FAIL,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_INIT,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_FAIL,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_INIT,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_FAIL,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_INIT,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_SUCCESS,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_FAIL,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_INIT,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_SUCCESS,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_FAIL,
  GENERIC_ADD_NUMBER_INIT,
  GENERIC_ADD_NUMBER_SUCCESS,
  GENERIC_ADD_NUMBER_FAIL,
  GENERIC_ADD_EMAIL_INIT,
  GENERIC_ADD_EMAIL_SUCCESS,
  GENERIC_ADD_EMAIL_FAIL,
  GENERIC_ADD_ADDRESS_INIT,
  GENERIC_ADD_ADDRESS_SUCCESS,
  GENERIC_ADD_ADDRESS_FAIL,
  GENERIC_GET_PHONES_INIT,
  GENERIC_GET_PHONES_SUCCESS,
  GENERIC_GET_PHONES_FAIL,
  GENERIC_GET_EMAILS_INIT,
  GENERIC_GET_EMAILS_SUCCESS,
  GENERIC_GET_EMAILS_FAIL,
  GENERIC_UPDATE_NUMBER_INIT,
  GENERIC_UPDATE_NUMBER_SUCCESS,
  GENERIC_UPDATE_NUMBER_FAIL,
  GENERIC_UPDATE_EMAIL_INIT,
  GENERIC_UPDATE_EMAIL_SUCCESS,
  GENERIC_UPDATE_EMAIL_FAIL,
  GENERIC_GET_ADDRESSES_INIT,
  GENERIC_GET_ADDRESSES_SUCCESS,
  GENERIC_GET_ADDRESSES_FAIL,
  GENERIC_UPDATE_ADDRESS_INIT,
  GENERIC_UPDATE_ADDRESS_SUCCESS,
  GENERIC_UPDATE_ADDRESS_FAIL,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_INIT,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_SUCCESS,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_FAIL,
  PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_INIT,
  PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_SUCCESS,
  PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_FAIL,
  PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
  PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
  PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_INIT,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_SUCCESS,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_FAIL,
  PATRON_STATUS_UPDATE_INIT,
  PATRON_STATUS_UPDATE_SUCCESS,
  PATRON_STATUS_UPDATE_FAIL,
  DOCUMENT_FILE_VIEW_INIT,
  DOCUMENT_FILE_VIEW_SUCCESS,
  DOCUMENT_FILE_VIEW_FAIL,
  DOCUMENT_FILE_DELETE_INIT,
  DOCUMENT_FILE_DELETE_SUCCESS,
  DOCUMENT_FILE_DELETE_FAIL,
  GENERIC_CLEAR_PHONES,
  GENERIC_CLEAR_EMAILS,
  GENERIC_CLEAR_ADDRESSES,

  PATRON_BANK_DETAILS_INIT,
  PATRON_BANK_DETAILS_SUCCESS,
  PATRON_BANK_DETAILS_FAIL,

  // Customers
  CUSTOMER_LIST_FETCH_INIT,
  CUSTOMER_LIST_FETCH_SUCCESS,
  CUSTOMER_LIST_FETCH_FAIL
} from 'app/actions';

import apiCall from 'app/sagas/api';
import { formatDate, openUrlInNewTab } from 'app/utils/utils';
import apiCallV2 from 'app/sagas/v2';
import { getBankDocs } from '../brands/saga';

// Customers
export async function getPatrons(queryParam) {
  const url = `/customers`;
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

// Customers
export async function getCustomers(limit, offset, keyword, status, date) {
  const createdAt = date && formatDate(date);
  const url = `/customers`;
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
      requestType: CUSTOMER_LIST_FETCH_INIT,
      successType: CUSTOMER_LIST_FETCH_SUCCESS,
      failureType: CUSTOMER_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function saveAddNumber(values) {
  const url = '/contacts';
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      resource: values.resource,
      resourceId: values.id,
      contact: values.contact,
      isCommunication: values.contactType ? values.contactType.indexOf('Communication') > -1 : false,
      isWhatsapp: values.contactType ? values.contactType.indexOf('Whatsapp') > -1 : false,
      phoneType: values.phoneType,
      contactType: 'Phone'
    },
    url,
    TYPES: {
      requestType: GENERIC_ADD_NUMBER_INIT,
      successType: GENERIC_ADD_NUMBER_SUCCESS,
      failureType: GENERIC_ADD_NUMBER_FAIL
    }
  };

  apiCall(apiArgs);
}

export function saveAddEmail(values) {
  const url = '/contacts';
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      resource: values.resource,
      resourceId: values.id,
      contact: values.contact,
      isCommunication: values.contactType ? values.contactType.indexOf('Communication') > -1 : false,
      emailType: values.emailType,
      contactType: 'Email'
    },
    url,
    TYPES: {
      requestType: GENERIC_ADD_EMAIL_INIT,
      successType: GENERIC_ADD_EMAIL_SUCCESS,
      failureType: GENERIC_ADD_EMAIL_FAIL
    }
  };

  apiCall(apiArgs);
}

export function saveAddAddress(values) {
  const url = '/addresses';
  const payload = {
    resourceCode: values.resourceCode,
    resourceId: values.id,
    addressType: values.addressType,
    pincode: values.pincode,
    city: values.city,
    state: values.state,
    premiseOwnership: values.premiseOwnership,
    line1: values.line1,
    line2: values.line2,
    country: values.country
  };
  if (values.premiseOwnership) { payload.premiseOwnership = values.premiseOwnership; }
  if (values.line3) { payload.line3 = values.line3; }

  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: payload,
    url,
    TYPES: {
      requestType: GENERIC_ADD_ADDRESS_INIT,
      successType: GENERIC_ADD_ADDRESS_SUCCESS,
      failureType: GENERIC_ADD_ADDRESS_FAIL
    }
  };

  apiCallV2(apiArgs);
}

export function getPatronLeadPool(limit, offset, keyword, status, date) {
  const createdAt = date && formatDate(date);
  const url = `/investor-profile`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      limit,
      offset,
      createdAt,
      status,
      keyword,
      includes: ['customer']
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_LIST_FETCH_INIT,
      successType: PATRON_LEAD_LIST_FETCH_SUCCESS,
      failureType: PATRON_LEAD_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getPhones(id) {
  const url = `/contacts/resources/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: { contactType: 'Phone' }
    },
    url,
    TYPES: {
      requestType: GENERIC_GET_PHONES_INIT,
      successType: GENERIC_GET_PHONES_SUCCESS,
      failureType: GENERIC_GET_PHONES_FAIL

    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getPatronDetail(id) {
  // const url = `/investor-profile/${id}`;
  // const apiArgs = {
  //   API_CALL: {
  //     method: 'GET'
  //   },
  //   url,
  //   TYPES: {
  //     requestType: PATRON_LEAD_DETAIL_FETCH_INIT,
  //     successType: PATRON_LEAD_DETAIL_FETCH_SUCCESS,
  //     failureType: PATRON_LEAD_DETAIL_FETCH_FAIL
  //   }
  // };
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      includes: ['investorProfile']
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DETAIL_FETCH_INIT,
      successType: PATRON_LEAD_DETAIL_FETCH_SUCCESS,
      failureType: PATRON_LEAD_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getEmails(id) {
  const url = `/contacts/resources/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: { contactType: 'Email' }
    },
    url,
    TYPES: {
      requestType: GENERIC_GET_EMAILS_INIT,
      successType: GENERIC_GET_EMAILS_SUCCESS,
      failureType: GENERIC_GET_EMAILS_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}
export function getInvestorProfileDetail(id) {
  const url = `/investor-profile/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_INVESTOR_DETAIL_FETCH_INIT,
      successType: PATRON_LEAD_INVESTOR_DETAIL_FETCH_SUCCESS,
      failureType: PATRON_LEAD_INVESTOR_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getAddresses(code) {
  const url = `/addresses/resources/${code}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: GENERIC_GET_ADDRESSES_INIT,
      successType: GENERIC_GET_ADDRESSES_SUCCESS,
      failureType: GENERIC_GET_ADDRESSES_FAIL
    }
  };
  // Accept response if necessary with await
  apiCallV2(apiArgs);
}
export function getCustomerDetail(id) {
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_CUSTOMER_DETAIL_FETCH_INIT,
      successType: PATRON_LEAD_CUSTOMER_DETAIL_FETCH_SUCCESS,
      failureType: PATRON_LEAD_CUSTOMER_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}
export function getCommunicationsDetail(id) {
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT,
      successType: PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS,
      failureType: PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function createPatron(values) {
  const url = `/investor-profile`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: values.mobile
      }
    },
    url,
    TYPES: {
      requestType: PATRON_CREATE_PATRON_INIT,
      successType: PATRON_CREATE_PATRON_SUCCESS,
      failureType: PATRON_CREATE_PATRON_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  const store = registry.get('store');
  if (response.data && response.message === 'OK') {
    // getPatronLeadPool();
    store.dispatch(replaceRouter(`/patrons/leads/${response.data.id}`));
  }
}
export function updateNumber(values) {
  const url = `/contacts/${values.id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      resource: values.resource,
      resourceId: values.resourceId,
      contact: values.contact,
      isCommunication: values.contactType ? values.contactType.indexOf('Communication') > -1 : false,
      isWhatsapp: values.contactType ? values.contactType.indexOf('Whatsapp') > -1 : false,
      phoneType: values.phoneType,
      contactType: 'Phone'
    },
    url,
    TYPES: {
      requestType: GENERIC_UPDATE_NUMBER_INIT,
      successType: GENERIC_UPDATE_NUMBER_SUCCESS,
      failureType: GENERIC_UPDATE_NUMBER_FAIL
    }
  };

  apiCall(apiArgs);
}

export function updateEmail(values) {
  const url = `/contacts/${values.id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      resource: values.resource,
      resourceId: values.resourceId,
      contact: values.contact,
      isCommunication: values.contactType && values.contactType.indexOf('Communication') > 0,
      emailType: values.emailType,
      contactType: 'Email'
    },
    url,
    TYPES: {
      requestType: GENERIC_UPDATE_EMAIL_INIT,
      successType: GENERIC_UPDATE_EMAIL_SUCCESS,
      failureType: GENERIC_UPDATE_EMAIL_FAIL
    }
  };

  apiCall(apiArgs);
}

export function updateAddress(values) {
  const url = `/addresses/${values.id}`;
  const payload = {
    // resource: values.resource,
    resourceId: values.resourceId,
    addressType: values.addressType,
    pincode: values.pincode,
    city: values.city,
    state: values.state,
    line1: values.line1,
    line2: values.line2,
    country: values.country
  };
  if (values.line3 || values.line3 === '') { payload.line3 = values.line3; }
  if (values.premiseOwnership) { payload.premiseOwnership = values.premiseOwnership; }
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: payload,
    url,
    TYPES: {
      requestType: GENERIC_UPDATE_ADDRESS_INIT,
      successType: GENERIC_UPDATE_ADDRESS_SUCCESS,
      failureType: GENERIC_UPDATE_ADDRESS_FAIL
    }
  };

  apiCall(apiArgs);
}

export async function saveBasicInfo(values, id) {
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      email: values.email,
      mobile: values.mobile,
      loginType: values.loginType,
      linkedInUrl: values.linkedInUrl ? values.linkedInUrl : null,
      education: values.education,
      designation: values.designation,
      totalWorkExperience: values.totalWorkExp ? values.totalWorkExp : null,
      dateOfBirth: values.dateOfBirth ? formatDate(values.dateOfBirth) : null,
      gender: values.gender ? values.gender : null,
      pan: values.panNumber ? values.panNumber : null,
      isPatron: true,
      employerName: values.employerName,
      fatherOrSpouseName: values.fatherOrSpouseName,
      address: values.address,
      correspondenceAddress: values.correspondenceAddress,
      isAadhaarPresent: values.isAadhaarPresent,
      investorProfileOption: values.investorProfileOption,
      eligibleInvestor: values.eligibleInvestor,
      country: values.country,
      tin: values.tin,
      birthPlace: values.birthPlace,
      nonTaxResident: values.nonTaxResident,
      hasNriAccount: values.hasNriAccount
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_CUSTOMER_DETAIL_SAVE_INIT,
      successType: PATRON_LEAD_CUSTOMER_DETAIL_SAVE_SUCCESS,
      failureType: PATRON_LEAD_CUSTOMER_DETAIL_SAVE_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    getCustomerDetail(id);
  }
  return response;
}

export async function saveFundingInfo(values, id, isGetApiNeeded = true) {
  const url = `/investor-profile/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      amount: values.commitmentAmount && values.commitmentAmount !== '' ? Number(values.commitmentAmount) : null,
      maxAmtPerTransac: values.maxTransactionAmount ? values.maxTransactionAmount : null,
      riskAppetite: values.riskAppetite,
      roiExpectation: Number(values.roiExpectations),
      investmentExperience: Number(values.investmentExperience),
      alternateInvstmentExperience: Number(values.alternateInvestmentExperience),
      sectorsOfChoice: values.sectorsOfChoice,
      productsOfChoice: values.productsOfChoice
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_INVESTOR_DETAIL_SAVE_INIT,
      successType: PATRON_LEAD_INVESTOR_DETAIL_SAVE_SUCCESS,
      failureType: PATRON_LEAD_INVESTOR_DETAIL_SAVE_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (isGetApiNeeded && response.data && response.message === 'OK') {
    getInvestorProfileDetail(id);
  }
  return response;
}

export function getConfig(resourceType) {
  const url = `/configured-document-types/${resourceType}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_CONFIG_FETCH_INIT,
      successType: PATRON_LEAD_DOCUMENT_CONFIG_FETCH_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_CONFIG_FETCH_FAIL
    },
    isErrorRequired: false
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function getPatronDocPresignedUrl(resourceId, resourceType, docType, docCategory, contentType) {
  const url = `/documents/${resourceType}/${resourceId}/upload-url`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      docType,
      docCategory,
      contentType
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_INIT,
      successType: PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_PRESIGNED_URL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

// eslint-disable-next-line consistent-return
export async function postMetaData(action) {
  const url = `/files`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    // params: {
    //   docType,
    //   docCategory
    // },
    data: {
      key: action.key,
      fileName: action.name,
      contentType: action.type,
      size: action.size,
      document: {
        resourceCategory: action.resourceType,
        resourceId: action.resourceId,
        docCategory: action.docCategory,
        docType: action.docType
      }
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
      successType: PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if ((response && action.docType === 'BULK_PATRON_IMPORT') || (response && action.docCategory === 'INVESTMENT')) {
    return response;
  }
  if (response && action.resourceType !== 'BANK_ACCOUNT') {
    getDocs(action.resourceId, action.resourceType);
  } else getBankDocs(action.resourceType, action.bankIdString);
}

export async function postDocMetaData(action) {
  const url = `/files`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      key: action.key,
      fileName: action.name,
      contentType: action.type,
      size: action.size,
      document: {
        resourceCategory: action.resourceType,
        resourceId: action.resourceId,
        docCategory: action.docCategory,
        docType: action.docType
      }
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
      successType: PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  return response;
}

export async function postMetaDataBulk(action, bankId) {
  const payload = action.map((data) => ({
    key: data.key,
    fileName: data.name,
    contentType: data.type,
    size: data.size,
    document: {
      resourceCategory: data.resourceType,
      resourceId: data.resourceId,
      docCategory: data.docCategory,
      docType: data.docType
    }
  }));
  const url = `/files/batch`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: { files: payload },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
      successType: PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response && action.docType === 'BULK_PATRON_IMPORT') {
    return response;
  }
  if (response && action[0].resourceType !== 'BANK_ACCOUNT') {
    getDocs(action[0].resourceId, action[0].resourceType);
  } else getBankDocs(action[0].resourceType, bankId);

  return null;
}

export function getDocs(resourceId, resourceType) {
  const url = `/documents/${resourceType}/${resourceId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: 50,
      page: 1
    },
    isErrorRequired: false,
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_LIST_FETCH_INIT,
      successType: PATRON_LEAD_DOCUMENT_LIST_FETCH_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getDocsbyId(documentId, query = {}) {
  const url = `/documents/${documentId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: 2,
      page: 1,
      ...query
    },
    url,
    TYPES: {
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getAllDocsByFilter(resourceCategory, resourceIDs = [], docTypeList = []) {
  const url = `/documents`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      page: 1,
      take: 50,
      includes: ['files'],
      where: {
        resourceCategory,
        resourceId: { in: resourceIDs },
        docType: {
          in: docTypeList
        }
        // archived: false
      },
      order: {
        createdAt: 'DESC'
      }
    },
    serviceName: 'doc',
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function updateDocumentStatus(id, status, resourceId, resourceType, bankIdString) {
  const url = `/documents/${id}/status`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      status
    },
    url,
    TYPES: {
      requestType: PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
      successType: PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
      failureType: PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response && resourceType !== 'BANK_ACCOUNT') {
    getDocs(resourceId, resourceType);
  } else if (resourceType && bankIdString) {
    getBankDocs(resourceType, bankIdString);
  }
  return response;
}

export function updateInvestorStatus(values, id) {
  const url = `/customers/${id}/status`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      status: values.status,
      remarks: values.remarks
    },
    url,
    TYPES: {
      requestType: PATRON_STATUS_UPDATE_INIT,
      successType: PATRON_STATUS_UPDATE_SUCCESS,
      failureType: PATRON_STATUS_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function viewImage(fileId, openInNewTab = true, signedCopy) {
  let url = `/files/${fileId}/preview-url`;
  if (signedCopy) url += `?value=signedUrl`;

  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: DOCUMENT_FILE_VIEW_INIT,
      successType: DOCUMENT_FILE_VIEW_SUCCESS,
      failureType: DOCUMENT_FILE_VIEW_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK' && openInNewTab) {
    openUrlInNewTab(response.data.url);
  }
  return response;
}

export async function removeFile(fileId, resourceId, resourcetype, bankIdString) {
  const url = `/files/${fileId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    url,
    TYPES: {
      requestType: DOCUMENT_FILE_DELETE_INIT,
      successType: DOCUMENT_FILE_DELETE_SUCCESS,
      failureType: DOCUMENT_FILE_DELETE_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response && resourcetype !== 'BANK_ACCOUNT' && resourceId) {
    getDocs(resourceId, resourcetype);
  } else if (response && resourcetype && resourceId) {
    getBankDocs(resourcetype, bankIdString);
  }
  return response;
}

export function clearPhones() {
  const store = registry.get('store');
  store.dispatch({ type: GENERIC_CLEAR_PHONES });
}

export function clearEmails() {
  const store = registry.get('store');
  store.dispatch({ type: GENERIC_CLEAR_EMAILS });
}

export function clearAddresses() {
  const store = registry.get('store');
  store.dispatch({ type: GENERIC_CLEAR_ADDRESSES });
}

export async function uploadPatronsCsv(csvFileLink) {
  const url = `/customers/import`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      csvFileLink
    },
    url,
    TYPES: {},
    isErrorRequired: false
  };
  return apiCall(apiArgs);
}

/**
 * @description Get associated companies of a customer
 * @param customerId
 * @returns {Promise<null|*>}
 */
export async function getAssociatedCompanies(customerId) {
  const url = `/customers/${customerId}/companies`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get bank accounts using resource code
 * @param customerCode
 * @returns {Promise<null|*>}
 */
export async function getCustomerBankDetails(customerCode) {
  const url = `/banks/accounts/resources/${customerCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCallV2(apiArgs);
}

export async function updateCustomerBankAccount(bankAccountId, data) {
  const url = `/banks/accounts/${bankAccountId}`;
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

export async function getCustomerBankAccount(bankAccountId, data) {
  const url = `/banks/accounts/${bankAccountId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    data,
    url,
    TYPES: {
      requestType: PATRON_BANK_DETAILS_INIT,
      successType: PATRON_BANK_DETAILS_SUCCESS,
      failureType: PATRON_BANK_DETAILS_FAIL
    }
  };
  return apiCall(apiArgs);
}

/**
 * @description Create a new bank account using resource code
 * @param data
 * @returns {Promise<null|*>}
 */
export async function createBankAccount(data) {
  const url = `/banks/accounts`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCallV2(apiArgs);
}

export async function deleteProjections(dealId) {
  const url = `/brand-revenue-projections/batch/${dealId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    url
    // TYPES: {
    //   requestType: DOCUMENT_FILE_DELETE_INIT,
    //   successType: DOCUMENT_FILE_DELETE_SUCCESS,
    //   failureType: DOCUMENT_FILE_DELETE_FAIL
    // }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  return response;
}
