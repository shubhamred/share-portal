import registry from 'app-registry';
import Immutable from 'seamless-immutable';
import { replace as replaceRouter } from 'react-router-redux';

import {
  BRAND_LEAD_PERFORMANCE_UPDATE_INIT,
  BRAND_LEAD_PERFORMANCE_UPDATE_SUCCESS,
  BRAND_LEAD_PERFORMANCE_UPDATE_FAIL,
  BRAND_LEAD_APPLICANT_DETAIL_INIT,
  BRAND_LEAD_APPLICANT_DETAIL_SUCCESS,
  BRAND_LEAD_APPLICANT_DETAIL_FAIL,
  BRAND_LEAD_LIST_FETCH_FAIL,
  BRAND_LEAD_LIST_FETCH_INIT,
  BRAND_CREATE_BRAND_INIT,
  BRAND_CREATE_BRAND_SUCCESS,
  BRAND_CREATE_BRAND_FAIL,
  BRAND_LEAD_DETAIL_FETCH_INIT,
  BRAND_LEAD_DETAIL_FETCH_SUCCESS,
  BRAND_LEAD_DETAIL_FETCH_FAIL,
  BRAND_LEAD_PERFORMANCE_FETCH_INIT,
  BRAND_LEAD_PERFORMANCE_FETCH_SUCCESS,
  BRAND_LEAD_PERFORMANCE_FETCH_FAIL,
  BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT,
  BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS,
  BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL,
  BRAND_COMMUNICATION_GET_ADDRESSES_INIT,
  BRAND_COMMUNICATION_GET_ADDRESSES_SUCCESS,
  BRAND_COMMUNICATION_GET_ADDRESSES_FAIL,
  BRAND_APPLICANT_LIST_FETCH_INIT,
  BRAND_APPLICANT_LIST_FETCH_SUCCESS,
  BRAND_APPLICANT_LIST_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_FETCH_INIT,
  BRAND_BUSINESS_DETAILS_FETCH_SUCCESS,
  BRAND_BUSINESS_DETAILS_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_UPDATE_INIT,
  BRAND_BUSINESS_DETAILS_UPDATE_SUCCESS,
  BRAND_BUSINESS_DETAILS_UPDATE_FAIL,
  BRAND_APPLICANT_BASIC_INFO_FETCH_INIT,
  BRAND_APPLICANT_BASIC_INFO_FETCH_SUCCESS,
  BRAND_APPLICANT_BASIC_INFO_FETCH_FAIL,
  BRAND_STATUS_UPDATE_INIT,
  BRAND_STATUS_UPDATE_SUCCESS,
  BRAND_STATUS_UPDATE__FAIL,
  BRAND_BANKING_BANKS_FETCH_INIT,
  BRAND_BANKING_BANKS_FETCH_SUCCESS,
  BRAND_BANKING_BANKS_FETCH_FAIL,
  BRAND_BANKING_ACCOUNTS_FETCH_INIT,
  BRAND_BANKING_ACCOUNTS_FETCH_SUCCESS,
  BRAND_BANKING_ACCOUNTS_FETCH_FAIL,
  BRAND_BANKING_ADD_ACCOUNT_INIT,
  BRAND_BANKING_ADD_ACCOUNT_SUCCESS,
  BRAND_BANKING_ADD_ACCOUNT_FAIL,
  BRAND_BANKING_UPDATE_ACCOUNT_INIT,
  BRAND_BANKING_UPDATE_ACCOUNT_SUCCESS,
  BRAND_BANKING_UPDATE_ACCOUNT_FAIL,
  BRAND_BANKING_DOCUMENT_FETCH_INIT,
  BRAND_BANKING_DOCUMENT_FETCH_SUCCESS,
  BRAND_BANKING_DOCUMENT_FETCH_FAIL,
  BRAND_BANKING_DOCUMENT_TYPE_FETCH_INIT,
  BRAND_BANKING_DOCUMENT_TYPE_FETCH_SUCCESS,
  BRAND_BANKING_DOCUMENT_TYPE_FETCH_FAIL,
  BRAND_BANKING_CLEAR_ACCOUNTS,
  BRAND_BANKING_DOCUMENT_PARSE_INIT,
  BRAND_BANKING_DOCUMENT_PARSE_SUCCESS,
  BRAND_BANKING_DOCUMENT_PARSE_FAIL,

  // Brand Financial
  BRAND_FINANCIAL_OVERVIEW_FETCH_INIT,
  BRAND_FINANCIAL_OVERVIEW_FETCH_SUCCESS,
  BRAND_FINANCIAL_OVERVIEW_FETCH_FAIL,
  BRAND_FINANCIAL_SHAREHOLDING_FETCH_INIT,
  BRAND_FINANCIAL_SHAREHOLDING_FETCH_SUCCESS,
  BRAND_FINANCIAL_SHAREHOLDING_FETCH_FAIL,
  BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_INIT,
  BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_SUCCESS,
  BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_FAIL,
  BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_INIT,
  BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_SUCCESS,
  BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_FAIL,
  BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_INIT,
  BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_SUCCESS,
  BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_FAIL,
  BRAND_FINANCIAL_BALANCE_SHEET_FETCH_INIT,
  BRAND_FINANCIAL_BALANCE_SHEET_FETCH_SUCCESS,
  BRAND_FINANCIAL_BALANCE_SHEET_FETCH_FAIL,
  BRAND_FINANCIAL_CASH_FLOW_FETCH_INIT,
  BRAND_FINANCIAL_CASH_FLOW_FETCH_SUCCESS,
  BRAND_FINANCIAL_CASH_FLOW_FETCH_FAIL,
  BRAND_FINANCIAL_CHARGES_FETCH_INIT,
  BRAND_FINANCIAL_CHARGES_FETCH_SUCCESS,
  BRAND_FINANCIAL_CHARGES_FETCH_FAIL,
  BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_INIT,
  BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_SUCCESS,
  BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_FAIL,
  BRANDS_FETCH_FINANCIALS_INIT,
  BRANDS_FETCH_FINANCIALS_SUCCESS,
  BRANDS_FETCH_FINANCIALS_FAIL,

  // Brands
  BRAND_LIST_FETCH_INIT,
  BRAND_LIST_FETCH_SUCCESS,
  BRAND_LIST_FETCH_FAIL
} from 'app/actions';
import apiCall from 'app/sagas/api';
import apiCallV2 from 'app/sagas/v2';
import { formatDate } from 'app/utils/utils';
import apiCallV1Integration from 'app/sagas/integrations';
// import { DMS_SERVICE } from 'app/constants';

// Brands
export async function getBrands(limit, offset, keyword, status, date, fields) {
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
      where: { businessName: { keyword } },
      fields
    },
    url,
    TYPES: {
      requestType: BRAND_LIST_FETCH_INIT,
      successType: BRAND_LIST_FETCH_SUCCESS,
      failureType: BRAND_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

// Applications
export function getBrandLeadPool(limit, offset, keyword, status, date, order, isBrand = false) {
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
      where: {
        status: { in: status && status.length ? status.split(',') : null }
      },
      includes: [
        'brandProfile',
        'customerCompanies',
        'customerCompanies.customer'
      ],
      order
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_LIST_FETCH_INIT,
      // successType: BRAND_LEAD_LIST_FETCH_SUCCESS,
      failureType: BRAND_LEAD_LIST_FETCH_FAIL
    }
  };
  if (!status || !status.length) {
    delete apiArgs.params.where.status;
  }
  if (keyword) {
    apiArgs.params.where.businessName = { keyword };
  }
  if (isBrand) {
    apiArgs.params.where.companyType = 'Brand';
  }
  // eslint-disable-next-line no-unused-expressions
  !order ? delete apiArgs.params.order : null;
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getBrandLeadPoolNew(query = {}) {
  const { fields, limit, offset, keyword, status, date, order, isBrand = false, includes, whereQuery = {} } = query;
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
      fields,
      where: {
        status: { in: status && status.length ? status.split(',') : null },
        ...whereQuery
      },
      includes: includes || [],
      order
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_LIST_FETCH_INIT,
      // successType: BRAND_LEAD_LIST_FETCH_SUCCESS,
      failureType: BRAND_LEAD_LIST_FETCH_FAIL
    }
  };
  if (!status || !status.length) {
    delete apiArgs.params.where.status;
  }
  if (keyword) {
    apiArgs.params.where.businessName = { keyword };
  }
  if (isBrand) {
    apiArgs.params.where.companyType = 'Brand';
  }
  // eslint-disable-next-line no-unused-expressions
  !order ? delete apiArgs.params.order : null;
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export async function createBrand(data) {
  const url = `/brand-profile`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {
      requestType: BRAND_CREATE_BRAND_INIT,
      successType: BRAND_CREATE_BRAND_SUCCESS,
      failureType: BRAND_CREATE_BRAND_FAIL
    }
  };
  const response = await apiCall(apiArgs);
  const store = registry.get('store');
  if (response.data && response.message === 'OK') {
    // getBrandLeadPool();
    store.dispatch(replaceRouter(`/brands/${response.data.id}`));
  }
  return response;
}

export function getBrandDetail(id) {
  const url = `/brand-profile/${id}`;
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
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getPerformanceDetail(id) {
  const url = `/brand-profile/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_PERFORMANCE_FETCH_INIT,
      successType: BRAND_LEAD_PERFORMANCE_FETCH_SUCCESS,
      failureType: BRAND_LEAD_PERFORMANCE_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function submitPerformanceInfo(values, id) {
  const posMachineList = (values.posMachines
      && Immutable.asMutable(values.posMachines, { deep: true }))
    || [];
  if (posMachineList && posMachineList.includes('Other')) {
    posMachineList.splice(posMachineList.indexOf('Other'), 1);
    if (values.otherPOSMachines) posMachineList.push(values.otherPOSMachines);
  }
  const locations = (values.geographicalPresence
      && Immutable.asMutable(values.geographicalPresence, { deep: true }))
    || [];
  if (locations && locations.includes('Other')) {
    locations.splice(locations.indexOf('Other'), 1);
    if (values.otherLocation) locations.push(values.otherLocation);
  }
  const paymentGateways = (values.paymentGateWayList
      && Immutable.asMutable(values.paymentGateWayList, { deep: true }))
    || [];
  if (paymentGateways && paymentGateways.includes('Other')) {
    paymentGateways.splice(paymentGateways.indexOf('Other'), 1);
    if (values.otherPaymentGateWay) paymentGateways.push(values.otherPaymentGateWay);
  }
  const url = `/brand-profile/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      channelsOfBusiness: values.channelsOfSale,
      onlineChannels: values.platformsOfSale,
      hasPosMachines: !!(
        values.posMachineAvailability && values.posMachineAvailability === 'Yes'
      ),
      posMachines:
        values.posMachineAvailability && values.posMachineAvailability === 'Yes'
          ? posMachineList
          : [],
      lastAuditedTurnover: values.latesAuditedTO,
      currentYearTurnover: values.currentYearTO,
      ebitdaPercent: Number(values.ebitda),
      lastMonthRevenue: Number(values.lastMonthRevenue),
      grossMargin: Number(values.grossMargin),
      tenure: Number(values.tenure),
      detailedBusinessNote: values.detailedBusinessNote,
      outletCities: locations,
      paymentGateways,
      noOfOutlets: values.numberOfOutlets ? values.numberOfOutlets : null
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_PERFORMANCE_UPDATE_INIT,
      successType: BRAND_LEAD_PERFORMANCE_UPDATE_SUCCESS,
      failureType: BRAND_LEAD_PERFORMANCE_UPDATE_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    getPerformanceDetail(id);
  }
  return response;
}

export async function submitApplicantInfo(
  values,
  companyId,
  customerId,
  mobNumber,
  gender
) {
  const url = `/companies/${companyId}/customers/${customerId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      customer: {
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        middleName: values.middleName || null,
        email: values.primaryEmail || null,
        mobile: mobNumber || null,
        loginType: values.loginCred || null,
        dateOfBirth: values.DOB ? formatDate(values.DOB) : null,
        gender: gender || null,
        pan: values.PAN || null,
        din: values.DIN || null,
        linkedInUrl: values.linkedInUrl || null
      },
      percentageHolding: Number(values.shareholding),
      associationType: 'Partner'
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_APPLICANT_DETAIL_INIT,
      successType: BRAND_LEAD_APPLICANT_DETAIL_SUCCESS,
      failureType: BRAND_LEAD_APPLICANT_DETAIL_FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    getApplicantList(companyId);
  }
}

export function getCommunicationsDetail(id) {
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT,
      successType: BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS,
      failureType: BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getAddresses(id) {
  const url = `/addresses/resources/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_COMMUNICATION_GET_ADDRESSES_INIT,
      successType: BRAND_COMMUNICATION_GET_ADDRESSES_SUCCESS,
      failureType: BRAND_COMMUNICATION_GET_ADDRESSES_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function addNewApplicant(values, companyId) {
  const url = `/companies/${companyId}/customers`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      associationType: values.associationType
    },
    url,
    TYPES: {
      requestType: BRAND_CREATE_BRAND_INIT,
      successType: BRAND_CREATE_BRAND_SUCCESS,
      failureType: BRAND_CREATE_BRAND_FAIL
    }
  };
  const response = await apiCall(apiArgs);
  if (response.data && response.message === 'OK') {
    getApplicantList(companyId);
  }
}

export function getApplicantList(id) {
  const url = `/companies/${id}/customers`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: {
      requestType: BRAND_APPLICANT_LIST_FETCH_INIT,
      successType: BRAND_APPLICANT_LIST_FETCH_SUCCESS,
      failureType: BRAND_APPLICANT_LIST_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
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
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function updateBusinessDetails(values, id) {
  const operatingSectorList = (values.operatingSectors
      && Immutable.asMutable(values.operatingSectors, { deep: true }))
    || [];
  if (operatingSectorList && operatingSectorList.includes('Other')) {
    operatingSectorList.splice(operatingSectorList.indexOf('Other'), 1);
    if (values.otherSectors) operatingSectorList.push(values.otherSectors);
  }
  const url = `/companies/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      businessName: values.brandName,
      officialEmail: values.workEmail,
      website: values.websiteUrl ? values.websiteUrl : null,
      legalName: values.legalName,
      pan: values.businessPAN ? values.businessPAN : null,
      legalConstitution: values.legalConstitution,
      incorporationDate:
        values.dateOfIncorportation && formatDate(values.dateOfIncorportation),
      cin: values.cin ? values.cin : null,
      gstin: values.gstin ? values.gstin : null,
      brandBusinessCategory: operatingSectorList,
      companyLogo: values.companyLogo,
      description: values.description
    },
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

export function getCustomerInfo(id) {
  const url = `/customers/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_APPLICANT_BASIC_INFO_FETCH_INIT,
      successType: BRAND_APPLICANT_BASIC_INFO_FETCH_SUCCESS,
      failureType: BRAND_APPLICANT_BASIC_INFO_FETCH_FAIL
    }
  };
  apiCall(apiArgs);
}

export async function updateBrandStatus(values, id) {
  const url = `/brand-profile/${id}/status`;
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
      requestType: BRAND_STATUS_UPDATE_INIT,
      successType: BRAND_STATUS_UPDATE_SUCCESS,
      failureType: BRAND_STATUS_UPDATE__FAIL
    }
  };
  // Accept response if necessary with await
  const response = await apiCall(apiArgs);
  return response;
}

export function getBanks(name = '') {
  const url = `/banks`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        name: { keyword: name }
      },
      page: 1,
      take: 100
    },
    url,
    TYPES: {
      requestType: BRAND_BANKING_BANKS_FETCH_INIT,
      successType: BRAND_BANKING_BANKS_FETCH_SUCCESS,
      failureType: BRAND_BANKING_BANKS_FETCH_FAIL
    }
  };
  apiCall(apiArgs);
}

// TODO : Change v2 call everywhere to fetch bank accounts.
// export function getAccountsV2(resourceCode) {
//   const url = `/banks/accounts/resources/${resourceCode}`;
//   const apiArgs = {
//     API_CALL: {
//       method: 'GET'
//     },
//     url,
//     TYPES: {
//       requestType: BRAND_BANKING_BANKS_FETCH_INIT,
//       successType: BRAND_BANKING_BANKS_FETCH_SUCCESS,
//       failureType: BRAND_BANKING_BANKS_FETCH_FAIL
//     }
//   };
//   return apiCallV2(apiArgs);
// }

export function getAccounts(code) {
  const url = `/banks/accounts/resources/${code}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_BANKING_ACCOUNTS_FETCH_INIT,
      successType: BRAND_BANKING_ACCOUNTS_FETCH_SUCCESS,
      failureType: BRAND_BANKING_ACCOUNTS_FETCH_FAIL
    }
  };
  return apiCallV2(apiArgs);
}

export async function addAccount(values) {
  const url = `/banks/accounts`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: values,
    url,
    TYPES: {
      requestType: BRAND_BANKING_ADD_ACCOUNT_INIT,
      successType: BRAND_BANKING_ADD_ACCOUNT_SUCCESS,
      failureType: BRAND_BANKING_ADD_ACCOUNT_FAIL
    }
  };
  apiCallV2(apiArgs);
}

export async function updateAccount(values) {
  const url = `/banks/accounts/${values.id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data: {
      accountType: values.accountType,
      accountNumber: values.accountNumber,
      statementPassword: values.statementPassword,
      bankId: values.bankId,
      companyId: values.companyId,
      isPrimary: values.isPrimary,
      address: values.address,
      accountHolder: values.accountHolder,
      ifsc: values.ifsc
    },
    url,
    TYPES: {
      requestType: BRAND_BANKING_UPDATE_ACCOUNT_INIT,
      successType: BRAND_BANKING_UPDATE_ACCOUNT_SUCCESS,
      failureType: BRAND_BANKING_UPDATE_ACCOUNT_FAIL
    }
  };
  apiCall(apiArgs);
}
export function getBankDocs(resourceCategory, bankIdString) {
  const url = `/documents`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      page: 1,
      take: 50,
      // resourceCategory,
      includes: ['files'],
      where: {
        resourceId: { in: bankIdString && bankIdString.split(',') },
        archived: false
      }
      // resourceId: bankIdString
    },
    serviceName: 'doc',
    url,
    TYPES: {
      requestType: BRAND_BANKING_DOCUMENT_FETCH_INIT,
      successType: BRAND_BANKING_DOCUMENT_FETCH_SUCCESS,
      failureType: BRAND_BANKING_DOCUMENT_FETCH_FAIL
    }
  };
  apiCall(apiArgs);
}
export function getDocType() {
  const url = `/document-types/BANK_STATEMENT`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },

    serviceName: 'doc',
    url,
    TYPES: {
      requestType: BRAND_BANKING_DOCUMENT_TYPE_FETCH_INIT,
      successType: BRAND_BANKING_DOCUMENT_TYPE_FETCH_SUCCESS,
      failureType: BRAND_BANKING_DOCUMENT_TYPE_FETCH_FAIL
    }
  };
  apiCall(apiArgs);
}
export async function getBankPreSignedURL(resourceId, resourceType, docType) {
  const url = `/documents/upload-url-generator`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      docType,
      resourceCategory: resourceType,
      resourceId
    },
    serviceName: 'doc',
    url,
    TYPES: {
      requestType: BRAND_BANKING_UPDATE_ACCOUNT_INIT,
      successType: BRAND_BANKING_UPDATE_ACCOUNT_SUCCESS,
      failureType: BRAND_BANKING_UPDATE_ACCOUNT_FAIL
    }
  };
  const response = await apiCall(apiArgs);
  return response;
}

export function clearAccounts() {
  const store = registry.get('store');
  store.dispatch({ type: BRAND_BANKING_CLEAR_ACCOUNTS });
}

export function setBanksList(data) {
  const store = registry.get('store');
  store.dispatch({ type: BRAND_BANKING_BANKS_FETCH_SUCCESS, data });
}

export async function parseAccount(values) {
  const url = `/banks/accounts/parse-requests`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      accountId: values
    },
    url,
    TYPES: {
      requestType: BRAND_BANKING_DOCUMENT_PARSE_INIT,
      successType: BRAND_BANKING_DOCUMENT_PARSE_SUCCESS,
      failureType: BRAND_BANKING_DOCUMENT_PARSE_FAIL
    }
  };
  return apiCall(apiArgs);
}

// Financial Section Functions
export function getFinancialDetail(companyId) {
  const url = `/companies/${companyId}`;
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
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getFinancialOverview(companyId) {
  const url = `/companies/${companyId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_OVERVIEW_FETCH_INIT,
      successType: BRAND_FINANCIAL_OVERVIEW_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_OVERVIEW_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getFinancialShareholding(
  companyId,
  take,
  page,
  keyword,
  status,
  date
) {
  const url = `/shareholdings`;
  const createdAt = date && formatDate(date);
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      createdAt,
      status,
      keyword
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_SHAREHOLDING_FETCH_INIT,
      successType: BRAND_FINANCIAL_SHAREHOLDING_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_SHAREHOLDING_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialShareholdingType(companyId, take, page) {
  const url = `/shareholding-types`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_INIT,
      successType: BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialSecurityAllotment(
  companyId,
  take,
  page,
  keyword,
  status,
  date
) {
  const url = `/securities-allotments`;
  const createdAt = date && formatDate(date);
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      createdAt,
      status,
      keyword
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_INIT,
      successType: BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialProfitAndLoss(companyId, take, page) {
  const url = `/financials`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      includes: ['profitAndLoss']
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_INIT,
      successType: BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialBalanceSheet(companyId, take, page) {
  const url = `/financials`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      includes: ['asset', 'liability']
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_BALANCE_SHEET_FETCH_INIT,
      successType: BRAND_FINANCIAL_BALANCE_SHEET_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_BALANCE_SHEET_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialCashFlow() {
  const url = `/company/shareholding.json`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_CASH_FLOW_FETCH_INIT,
      successType: BRAND_FINANCIAL_CASH_FLOW_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_CASH_FLOW_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export function getFinancialCharges(
  companyId,
  take,
  page,
  keyword,
  status,
  date
) {
  const url = `/charges`;
  const createdAt = date && formatDate(date);
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      createdAt,
      status,
      keyword
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_CHARGES_FETCH_INIT,
      successType: BRAND_FINANCIAL_CHARGES_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_CHARGES_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getFinancialLegalHistory(
  companyId,
  take,
  page,
  keyword,
  status,
  date
) {
  const url = `/legal-histories`;
  const createdAt = date && formatDate(date);
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      where: {
        companyId
      },
      take,
      page,
      createdAt,
      status,
      keyword
    },
    url,
    TYPES: {
      requestType: BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_INIT,
      successType: BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_SUCCESS,
      failureType: BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export function getBankingDetail(id) {
  const url = `/brand-profile/${id}`;
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
  // Accept response if necessary with await
  apiCall(apiArgs);
}

export async function updateFinancials(companyId) {
  const url = `/companies/financial-requests`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      companyId
    },
    url,
    TYPES: {
      requestType: BRANDS_FETCH_FINANCIALS_INIT,
      successType: BRANDS_FETCH_FINANCIALS_SUCCESS,
      failureType: BRANDS_FETCH_FINANCIALS_FAIL
    }
  };
  apiCall(apiArgs);
}

export function getAccountSummaries (params) {
  const url = `/account-summaries`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

export function getMonthlyAccountSummaries (params) {
  const url = `/monthly-account-summaries`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

export const getAccountTransactions = (params) => {
  const url = `/transactions`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
};

export async function editAssociatedCustomer(
  companyId,
  customerId,
  data
) {
  const url = `/companies/${companyId}/customers/${customerId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

/**
 * @description Portal: Get a list of all Companies GST Details in array of objects
 * @param params
 * @returns {Promise<null|any>}
 */
export const getCompanyGstDetails = (params) => {
  const url = `/company-gst-details`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Get a single Company GST Details using its UUID
 * @param gstId
 * @returns {Promise<null|any>}
 */
export const getSingleCompanyGstDetails = (gstId) => {
  const url = `/company-gst-details/${gstId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Create a new Company GST Details data entity
 * @param data
 * @returns {Promise<null|any>}
 */
export async function postCompanyGst(data) {
  const url = `/company-gst-details`;
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
 * @description Edit a single Company GSTIN using its UUID
 * @param gstId
 * @returns {Promise<null|any>}
 */
export const updateSingleCompanyGst = (gstId, data) => {
  const url = `/company-gst-details/${gstId}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Get a list of GST Transactions in array of objects
 * @param params
 * @returns {Promise<null|any>}
 */
export const getCompanyGstTransactions = (params) => {
  const url = `/gst-transactions`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    isErrorRequired: false,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Create company gst accounts parse request
 * @param values
 * @returns {Promise<null|any>}
 */
export async function parseGstAccounts(values) {
  const url = `/company-gst-details/parse-requests`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: {
      companyGstDetailIds: values
    },
    url,
    TYPES: { }
  };
  return apiCall(apiArgs);
}

/**
 * @description Get a list of Consolidated GST Transactions in array of objects
 * @param params
 * @returns {Promise<null|*>}
 */
export const getConsolidatedGstTransactions = (params) => {
  const url = `/consolidated-gst-transactions`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Get Integration Data
 * @returns {Promise<null|*>}
 * @param brandCode
 */
export const getIntegrationData = (brandCode) => {
  const url = `/integrations/brand/${brandCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {},
    isLoaderRequired: true
  };
  return apiCallV1Integration(apiArgs);
};

export const fetchBrandConfig = (brandCode) => {
  const url = `/brand-configs/${brandCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const fetchPayout = (queryParam, brandCode) => {
  const url = `/brand-configs/${brandCode}/payouts`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params: queryParam,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const fetchTransactions = (queryParam, brandCode) => {
  const url = `/brand-configs/${brandCode}/transactions`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params: queryParam,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const fetchBrandConfigInsights = (brandCode) => {
  const url = `/brand-configs/${brandCode}/insights`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const createBrandConfig = (data) => {
  const url = `/brand-configs`;
  const endPoint = `admin/split-payments/${data.vendor === 'kotak' ? `v2` : `v1`}`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, endPoint);
};

export const createAccount = (brandCode, vendor, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/accounts`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, `admin/split-payments/v2`);
};

export const createBrandAccount = (brandCode, vendor, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/brandAccount`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, `admin/split-payments/v2`);
};

export const fetchAccount = (brandCode, vendor) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/accounts`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, `admin/split-payments/v2`);
};

export const updateAccountConfig = (brandCode, vendor, accountNumber, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/account/${accountNumber}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const updateBrandAccount = (brandCode, vendor, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/brandAccount`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const getRevenueSources = () => {
  const url = `/revenue-source`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const createApplication = (brandCode, vendor, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/applications`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, `admin/split-payments/v2`);
};

export const getApplications = (brandCode, vendor) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/applications`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const updateApplication = (brandCode, vendor, applicationCode, data) => {
  const url = `/brand-configs/${brandCode}/vendor/${vendor}/application/${applicationCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v2');
};

export const createDealConfig = (brandCode, vendors, data) => {
  const url = `/brand-configs/${brandCode}/vendors/${vendors}/deals`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const fetchDealConfig = (brandCode, vendors, dealCode) => {
  const url = `/brand-configs/${brandCode}/vendors/${vendors}/deals/${dealCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const updateDealConfig = (brandCode, vendors, dealCode, accountId, data) => {
  const url = `/brand-configs/${brandCode}/vendors/${vendors}/deals/${dealCode}/splits/${accountId}`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const updateToggleDealConfig = (brandCode, vendors, dealCode, data) => {
  const url = `/brand-configs/${brandCode}/vendors/${vendors}/deals/${dealCode}/toggleStatus`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const updateToggleAccountConfig = (brandCode, vendors, accountsId, data) => {
  const url = `/brand-configs/${brandCode}/vendors/${vendors}/accounts/${accountsId}`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    isLoaderRequired: true,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const AddBrandConfigAccount = (data, brandCode) => {
  const url = `/brand-configs/${brandCode}/accounts`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { }
  };
  return apiCall(apiArgs, 'admin/split-payments/v1');
};

export const addBrandIntegrations = (brandCode, category, type, data) => {
  const url = `/brand/${brandCode}/${category}/${type}`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1/integrations');
};

export const updateBrandIntegrations = (brandCode, category, type, data) => {
  const url = `/brand/${brandCode}/${category}/${type}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1/integrations');
};

export const getBrandIntegrations = (brandCode, type) => {
  const url = `/brand/${brandCode}/${type}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1/integrations');
};

export const getApplicationIntegrations = (brandCode, applicationCode) => {
  const url = `/brand-application?brandCode=${brandCode}&applicationCode=${applicationCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1');
};

export const addApplicationIntegrations = (data) => {
  const url = `/brand-application`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    url,
    data,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1');
};

export const getDealIntegrations = (brandCode, applicationCode, dealCode) => {
  const url = `/brand-application?brandCode=${brandCode}&applicationCode=${applicationCode}&dealCode=${dealCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs, 'internal-integrations/v1');
};

export async function uploadShareHoldingCSV(data) {
  const url = `/upload/company-shareholding`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {
      // requestType: DEAL_DATA_CONFIG_FETCH_INIT,
      // successType: DEAL_DATA_CONFIG_FETCH_SUCCESS,
      // failureType: DEAL_DATA_CONFIG_FETCH_FAIL
    }
  };
  // Accept response if necessary with await
  return apiCall(apiArgs);
}

export const updateDocumentStatus = (data) => {
  const url = `/files/status/batch`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs);
};

export const moveFilePosition = (data) => {
  const url = `/files/move-files/batch`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: { },
    isLoaderRequired: true
  };
  return apiCall(apiArgs);
};
