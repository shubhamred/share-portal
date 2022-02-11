import Immutable from 'seamless-immutable';
import {
  BRAND_LEAD_DETAIL_FORM_UPDATE_INIT,
  BRAND_LEAD_DETAIL_FORM_UPDATE_SUCCESS,
  BRAND_LEAD_DETAIL_FORM_UPDATE_FAIL,
  BRAND_LEAD_APPLICANT_DETAIL_INIT,
  BRAND_LEAD_APPLICANT_DETAIL_SUCCESS,
  BRAND_LEAD_APPLICANT_DETAIL_FAIL,
  BRAND_LEAD_LIST_FETCH_FAIL,
  BRAND_LEAD_LIST_FETCH_SUCCESS,
  // BRAND_LEAD_DETAIL_FETCH_INIT,
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
  BRAND_APPLICANT_LIST_FETCH_SUCCESS,
  BRAND_APPLICANT_LIST_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_FETCH_SUCCESS,
  BRAND_BUSINESS_DETAILS_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_FETCH_INIT,
  BRAND_APPLICANT_BASIC_INFO_FETCH_INIT,
  BRAND_APPLICANT_BASIC_INFO_FETCH_SUCCESS,
  BRAND_APPLICANT_BASIC_INFO_FETCH_FAIL,
  BRAND_BUSINESS_DETAILS_UPDATE_INIT,
  BRAND_BUSINESS_DETAILS_UPDATE_SUCCESS,
  BRAND_BUSINESS_DETAILS_UPDATE_FAIL,
  BRAND_LEAD_PERFORMANCE_UPDATE_INIT,
  BRAND_LEAD_PERFORMANCE_UPDATE_SUCCESS,
  BRAND_LEAD_PERFORMANCE_UPDATE_FAIL,
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
  BRAND_STATUS_UPDATE_SUCCESS,
  BRAND_CREATE_BRAND_SUCCESS,
  BRAND_CREATE_BRAND_FAIL,
  BRAND_BANKING_DOCUMENT_FETCH_INIT,
  BRAND_BANKING_DOCUMENT_FETCH_SUCCESS,
  BRAND_BANKING_DOCUMENT_FETCH_FAIL,
  BRAND_BANKING_DOCUMENT_TYPE_FETCH_SUCCESS,
  BRAND_BANKING_DOCUMENT_TYPE_FETCH_FAIL,
  BRAND_APPLICANT_INFO_STORE,
  BRAND_BANKING_CLEAR_ACCOUNTS,
  BRAND_APPLICANT_LIST_FETCH_INIT,

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

  BRAND_BANKING_DOCUMENT_PARSE_INIT,
  BRAND_BANKING_DOCUMENT_PARSE_SUCCESS,
  BRAND_BANKING_DOCUMENT_PARSE_FAIL,

  BRAND_BANKING_BANKS_FETCH_INIT,
  // Brands
  BRAND_LIST_FETCH_INIT,
  BRAND_LIST_FETCH_SUCCESS,
  BRAND_LIST_FETCH_FAIL
} from '../../actions';

const defaultState = Immutable.flatMap({
  brandCreate: null,
  applicantList: null,
  leadData: null,
  totalCount: 0,
  brandList: null,
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

const getApplicantInfo = (applicantList, id) => {
  const result = (applicantList && id && applicantList.filter((applicant) => applicant.customer.id === id)) || [];
  return result.length ? result[0] : {};
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case BRAND_LEAD_DETAIL_FORM_UPDATE_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      }, { deep: true });

    case BRAND_LEAD_DETAIL_FORM_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      }, { deep: true });

    case BRAND_LEAD_DETAIL_FORM_UPDATE_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      }, { deep: true });
    case BRAND_LEAD_APPLICANT_DETAIL_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        },
        applicantDetailsUpdate: null
      }, { deep: true });

    case BRAND_LEAD_APPLICANT_DETAIL_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        },
        applicantDetailsUpdate: 'success'
      }, { deep: true });

    case BRAND_LEAD_APPLICANT_DETAIL_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        },
        applicantDetailsUpdate: 'failed'
      }, { deep: true });

    case 'BRAND_LEAD:APPLICANT_DETAIL:UPDATE_STATUS:CLEAR':
      return Immutable.merge(state, { applicantDetailsUpdate: null });

    case BRAND_LEAD_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        leadData: action.data.data,
        totalCount: action.data.meta.total,
        formData: { data: {} },
        brandDetail: null,
        applicantList: {}
      });

    case BRAND_LEAD_LIST_FETCH_FAIL:
      return Immutable.merge(state, { leadData: null, totalCount: 0 });

    case BRAND_LEAD_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, { brandDetail: action.data.data });

    case BRAND_LEAD_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { brandDetail: null });

    case BRAND_LEAD_PERFORMANCE_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case BRAND_LEAD_PERFORMANCE_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case BRAND_LEAD_PERFORMANCE_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case BRAND_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case BRAND_COMMUNICATION_GET_ADDRESSES_INIT:
      return Immutable.merge(state, { addresses: [] });

    case BRAND_COMMUNICATION_GET_ADDRESSES_SUCCESS:
      return Immutable.merge(state, { addresses: action.data.data });

    case BRAND_COMMUNICATION_GET_ADDRESSES_FAIL:
      return Immutable.merge(state, { addresses: [] });

    case BRAND_APPLICANT_LIST_FETCH_INIT:
      return Immutable.merge(state, { applicantList: null });

    case BRAND_APPLICANT_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        applicantList: action.data.data,
        applicantInfo: getApplicantInfo(action.data.data, action.data.data.length ? action.data.data[0].customer.id : null)
      });

    case BRAND_APPLICANT_LIST_FETCH_FAIL:
      return Immutable.merge(state, { applicantList: null });

    case BRAND_BUSINESS_DETAILS_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case BRAND_BUSINESS_DETAILS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case BRAND_BUSINESS_DETAILS_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case BRAND_APPLICANT_BASIC_INFO_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case BRAND_APPLICANT_BASIC_INFO_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case BRAND_APPLICANT_BASIC_INFO_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case BRAND_LEAD_PERFORMANCE_UPDATE_INIT:
      return Immutable.merge(state, { performanceInfoUpdate: null });

    case BRAND_LEAD_PERFORMANCE_UPDATE_SUCCESS:
      return Immutable.merge(state, { performanceInfoUpdate: 'success' });

    case BRAND_LEAD_PERFORMANCE_UPDATE_FAIL:
      return Immutable.merge(state, { performanceInfoUpdate: 'failed' });

    case 'BRAND_LEAD:PERFORMANCE_DETAIL:UPDATE_STATUS:CLEAR':
      return Immutable.merge(state, { performanceInfoUpdate: null });

    case BRAND_BUSINESS_DETAILS_UPDATE_INIT:
      return Immutable.merge(state, { businessDetailsUpdate: null });

    case BRAND_BUSINESS_DETAILS_UPDATE_SUCCESS:
      return Immutable.merge(state, { businessDetailsUpdate: 'success' });

    case BRAND_BUSINESS_DETAILS_UPDATE_FAIL:
      return Immutable.merge(state, { businessDetailsUpdate: 'failed' });

    case 'BRAND_LEAD:BUSINESS_DETAIL:UPDATE_STATUS:CLEAR':
      return Immutable.merge(state, { businessDetailsUpdate: null });

    case BRAND_BANKING_BANKS_FETCH_INIT:
      return Immutable.merge(state, {
        banks: []
      });

    case BRAND_BANKING_BANKS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        banks: action.data.data
      });

    case BRAND_BANKING_BANKS_FETCH_FAIL:
      return Immutable.merge(state, {
        banks: []
      });

    case BRAND_BANKING_ACCOUNTS_FETCH_INIT:
      return Immutable.merge(state, {
        accounts: [],
        accountsFetchInProgress: true
      });

    case BRAND_BANKING_ACCOUNTS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        accounts: action.data.data,
        accountsFetchInProgress: false
      });

    case BRAND_BANKING_ACCOUNTS_FETCH_FAIL:
      return Immutable.merge(state, {
        accounts: [],
        accountsFetchInProgress: false
      });

    case BRAND_BANKING_ADD_ACCOUNT_INIT:
      return Immutable.merge(state, { accountDetailsUpdate: null });

    case BRAND_BANKING_ADD_ACCOUNT_SUCCESS: {
      const accounts = [...state.accounts, action.data.data];
      return Immutable.merge(state, { accounts, accountDetailsUpdate: 'success' });
    }

    case BRAND_BANKING_ADD_ACCOUNT_FAIL:
      return Immutable.merge(state, { accountDetailsUpdate: 'failed' });

    case BRAND_BANKING_UPDATE_ACCOUNT_INIT:
      return Immutable.merge(state, { accountDetailsUpdate: null });

    case BRAND_BANKING_UPDATE_ACCOUNT_SUCCESS: {
      const updatedAccounts = state.accounts.map(
        (account) => (account.id === action.data.data.id ? action.data.data : account)
      );
      return Immutable.merge(state, { accounts: updatedAccounts, accountDetailsUpdate: 'success' });
    }

    case BRAND_BANKING_UPDATE_ACCOUNT_FAIL:
      return Immutable.merge(state, { accountDetailsUpdate: 'failed' });

    case BRAND_BANKING_CLEAR_ACCOUNTS:
      return Immutable.merge(state, { accounts: [] });

    case BRAND_STATUS_UPDATE_SUCCESS:
      return Immutable.merge(state, { brandDetail: action.data.data });

    case BRAND_CREATE_BRAND_FAIL:
      return Immutable.merge(state, { brandCreate: 'failed' });

    case BRAND_CREATE_BRAND_SUCCESS:
      return Immutable.merge(state, { brandCreate: 'success' });

    case 'BRAND:CREATE_BRAND:CANCEL':
      return Immutable.merge(state, { brandCreate: null });

    case BRAND_BANKING_DOCUMENT_FETCH_INIT:
      return Immutable.merge(state, {
        bankDocs: [],
        docsFetchInProgress: true
      });

    case BRAND_BANKING_DOCUMENT_FETCH_SUCCESS:
      return Immutable.merge(state, {
        bankDocs: action.data.data,
        docsFetchInProgress: false
      });

    case BRAND_BANKING_DOCUMENT_FETCH_FAIL:
      return Immutable.merge(state, {
        bankDocs: [],
        docsFetchInProgress: false
      });

    case BRAND_BANKING_DOCUMENT_TYPE_FETCH_SUCCESS:
      return Immutable.merge(state, {
        docType: action.data.data
      });

    case BRAND_BANKING_DOCUMENT_TYPE_FETCH_FAIL:
      return Immutable.merge(state, {
        docType: null
      });
    case BRAND_APPLICANT_INFO_STORE:
      return Immutable.merge(state, { applicantInfo: getApplicantInfo(state.applicantList, action.id) });

    case BRAND_FINANCIAL_OVERVIEW_FETCH_INIT:
      return Immutable.merge(state, { financialOverview: null });

    case BRAND_FINANCIAL_OVERVIEW_FETCH_SUCCESS:
      return Immutable.merge(state, { financialOverview: action.data.data });

    case BRAND_FINANCIAL_OVERVIEW_FETCH_FAIL:
      return Immutable.merge(state, { financialOverview: null });

    case BRAND_FINANCIAL_SHAREHOLDING_FETCH_INIT:
      return Immutable.merge(state, { financialShareholding: null, totalCount: 0 });

    case BRAND_FINANCIAL_SHAREHOLDING_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialShareholding: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_SHAREHOLDING_FETCH_FAIL:
      return Immutable.merge(state, { financialShareholding: null, totalCount: 0 });

    case BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_INIT:
      return Immutable.merge(state, { financialShareholdingSummary: null, totalCount: 0 });

    case BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialShareholdingSummary: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_SHAREHOLDING_SUMMARY_FETCH_FAIL:
      return Immutable.merge(state, { financialShareholdingSummary: null, totalCount: 0 });

    case BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_INIT:
      return Immutable.merge(state, { financialSecuritiesAllotment: null, totalCount: 0 });

    case BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialSecuritiesAllotment: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_SECURITIES_ALLOTMENT_FETCH_FAIL:
      return Immutable.merge(state, { financialSecuritiesAllotment: null, totalCount: 0 });

    case BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_INIT:
      return Immutable.merge(state, { financialProfitAndLoss: null, totalCount: 0 });

    case BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialProfitAndLoss: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_PROFIT_AND_LOSS_FETCH_FAIL:
      return Immutable.merge(state, { financialProfitAndLoss: null, totalCount: 0 });

    case BRAND_FINANCIAL_BALANCE_SHEET_FETCH_INIT:
      return Immutable.merge(state, { financialBalanceSheet: null, totalCount: 0 });

    case BRAND_FINANCIAL_BALANCE_SHEET_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialBalanceSheet: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_BALANCE_SHEET_FETCH_FAIL:
      return Immutable.merge(state, { financialBalanceSheet: null, totalCount: 0 });

    case BRAND_FINANCIAL_CASH_FLOW_FETCH_INIT:
      return Immutable.merge(state, { financialCashFlow: null, totalCount: 0 });

    case BRAND_FINANCIAL_CASH_FLOW_FETCH_SUCCESS:
      return Immutable.merge(state, { financialCashFlow: action.data, totalCount: 0 });

    case BRAND_FINANCIAL_CASH_FLOW_FETCH_FAIL:
      return Immutable.merge(state, { financialCashFlow: null, totalCount: 0 });

    case BRAND_FINANCIAL_CHARGES_FETCH_INIT:
      return Immutable.merge(state, { financialCharges: null, totalCount: 0 });

    case BRAND_FINANCIAL_CHARGES_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialCharges: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_CHARGES_FETCH_FAIL:
      return Immutable.merge(state, { financialCharges: null, totalCount: 0 });

    case BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_INIT:
      return Immutable.merge(state, { financialLegalHistory: null, totalCount: 0 });

    case BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_SUCCESS:
      return Immutable.merge(state, {
        financialLegalHistory: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_FINANCIAL_LEGAL_HISTORY_FETCH_FAIL:
      return Immutable.merge(state, { financialLegalHistory: null, totalCount: 0 });

    case 'FORM_DATA_CLEAR':
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case BRANDS_FETCH_FINANCIALS_INIT:
      return state.merge({
        messageType: ''
      });
    case BRANDS_FETCH_FINANCIALS_SUCCESS:
      return state.merge({
        formData: {
          data: action.data.data
        },
        messageType: 'success'
      });
    case BRANDS_FETCH_FINANCIALS_FAIL:
      return state.merge({
        messageType: 'error'
      });
    case BRAND_BANKING_DOCUMENT_PARSE_INIT:
      return state.merge({
        messageType: ''
      });
    case BRAND_BANKING_DOCUMENT_PARSE_SUCCESS:
      return state.merge({
        formData: {
          data: action.data.data
        },
        messageType: 'success'
      });
    case BRAND_BANKING_DOCUMENT_PARSE_FAIL:
      return state.merge({
        messageType: 'error'
      });
    case 'BRAND:CLEAR_ERROR':
      return state.merge({
        messageType: ''
      });

    case BRAND_LIST_FETCH_INIT:
      return Immutable.merge(state, { brandList: null });

    case BRAND_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        brandList: action.data.data,
        totalCount: action.data.meta.total
      });

    case BRAND_LIST_FETCH_FAIL:
      return Immutable.merge(state, { brandList: null, totalCount: 0 });
    default:
      return state;
  }
};
