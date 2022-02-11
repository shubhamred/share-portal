/* eslint-disable no-case-declarations */
import Immutable from 'seamless-immutable';

import {
  // PATRON_LEAD_LIST_FETCH_SUCCESS,
  // PATRON_LEAD_LIST_FETCH_FAIL,
  GENERIC_ADD_NUMBER_SUCCESS,
  GENERIC_ADD_NUMBER_FAIL,
  GENERIC_ADD_EMAIL_SUCCESS,
  GENERIC_ADD_EMAIL_FAIL,
  GENERIC_ADD_ADDRESS_SUCCESS,
  GENERIC_ADD_ADDRESS_FAIL,
  GENERIC_GET_PHONES_INIT,
  GENERIC_GET_PHONES_SUCCESS,
  GENERIC_GET_PHONES_FAIL,
  GENERIC_GET_EMAILS_INIT,
  GENERIC_GET_EMAILS_SUCCESS,
  GENERIC_GET_EMAILS_FAIL,
  GENERIC_GET_ADDRESSES_INIT,
  GENERIC_UPDATE_NUMBER_INIT,
  GENERIC_UPDATE_NUMBER_SUCCESS,
  GENERIC_UPDATE_NUMBER_FAIL,
  GENERIC_UPDATE_EMAIL_INIT,
  GENERIC_UPDATE_EMAIL_SUCCESS,
  GENERIC_UPDATE_EMAIL_FAIL,
  GENERIC_GET_ADDRESSES_SUCCESS,
  GENERIC_GET_ADDRESSES_FAIL,
  GENERIC_UPDATE_ADDRESS_INIT,
  GENERIC_UPDATE_ADDRESS_SUCCESS,
  GENERIC_UPDATE_ADDRESS_FAIL,
  PATRON_LEAD_LIST_FETCH_SUCCESS,
  PATRON_LEAD_LIST_FETCH_FAIL,
  PATRON_LEAD_DETAIL_FETCH_INIT,
  PATRON_LEAD_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_DETAIL_FETCH_FAIL,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_INIT,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_CUSTOMER_DETAIL_FETCH_FAIL,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_INIT,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_INVESTOR_DETAIL_FETCH_FAIL,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS,
  PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_INIT,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_SUCCESS,
  PATRON_LEAD_DOCUMENT_CONFIG_FETCH_FAIL,
  PATRON_LEAD_DOCUMENT_METADATA_POST_INIT,
  PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS,
  PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_INIT,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_SUCCESS,
  PATRON_LEAD_DOCUMENT_LIST_FETCH_FAIL,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_INIT,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_FAIL,
  PATRON_LEAD_CUSTOMER_DETAIL_SAVE_SUCCESS,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_INIT,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_SUCCESS,
  PATRON_LEAD_INVESTOR_DETAIL_SAVE_FAIL,
  PATRON_STATUS_UPDATE_SUCCESS,
  PATRON_CREATE_PATRON_SUCCESS,
  PATRON_CREATE_PATRON_FAIL,
  GENERIC_CLEAR_PHONES,
  GENERIC_CLEAR_EMAILS,
  GENERIC_CLEAR_ADDRESSES,
  PATRON_BANK_DETAILS_INIT,
  PATRON_BANK_DETAILS_SUCCESS,
  PATRON_BANK_DETAILS_FAIL,

  // Customers
  CUSTOMER_LIST_FETCH_INIT,
  CUSTOMER_LIST_FETCH_SUCCESS,
  CUSTOMER_LIST_FETCH_FAIL,

  // Patrons
  PATRON_LIST_FETCH_INIT,
  PATRON_LIST_FETCH_SUCCESS,
  PATRON_LIST_FETCH_FAIL
} from 'app/actions';

const defaultState = Immutable.flatMap({
  customerList: null,
  patronList: null,
  patronCreate: null,
  errorMsg: null,
  communicationDetailsUpdate: null,
  basicInfoUpdate: null,
  fundingInfoUpdate: null,
  leadData: null,
  numbers: [],
  emails: [],
  addresses: [],
  patronDetail: null,
  formData: {
    data: {}
  },
  docConfig: null,
  phonesFetchInProgress: false,
  emailsFetchInProgress: false,
  addressesFetchInProgress: false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case GENERIC_ADD_NUMBER_SUCCESS:
      const numbers = [...state.numbers];
      numbers.push(action.data.data);
      return Immutable.merge(state, { numbers });

    case GENERIC_ADD_NUMBER_FAIL:
      return Immutable.merge(state, { numbers: [...state.numbers] });

    case GENERIC_ADD_EMAIL_SUCCESS:
      const emails = [...state.emails, action.data.data];
      return Immutable.merge(state, { emails });

    case GENERIC_ADD_EMAIL_FAIL:
      return Immutable.merge(state, { addresses: [...state.emails] });

    case GENERIC_ADD_ADDRESS_SUCCESS:
      const addresses = [...state.addresses, action.data.data];
      return Immutable.merge(state, { addresses });

    case GENERIC_ADD_ADDRESS_FAIL:
      return Immutable.merge(state, { addresses: [...state.addresses] });
    case PATRON_LEAD_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, { leadData: action.data.data,
        totalCount: action.data.meta.total,
        patronDetail: null,
        formData: { data: {} } });

    case PATRON_LEAD_LIST_FETCH_FAIL:
      return Immutable.merge(state, { leadData: null, totalCount: 0 });

    case PATRON_LEAD_DETAIL_FETCH_INIT:
      return Immutable.merge(state, { patronDetail: null });

    case PATRON_LEAD_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, { patronDetail: action.data.data });

    case PATRON_LEAD_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { patronDetail: null });
    case PATRON_LEAD_CUSTOMER_DETAIL_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case PATRON_LEAD_CUSTOMER_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case PATRON_LEAD_CUSTOMER_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case PATRON_LEAD_COMMUNICATIONS_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case PATRON_LEAD_INVESTOR_DETAIL_FETCH_INIT:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });
    case PATRON_LEAD_INVESTOR_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, {
        formData: {
          data: action.data.data
        }
      });

    case PATRON_LEAD_INVESTOR_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, {
        formData: {
          data: {}
        }
      });

    case GENERIC_GET_PHONES_INIT:
      return Immutable.merge(state, { numbers: [], phonesFetchInProgress: true });

    case GENERIC_GET_PHONES_SUCCESS:
      return Immutable.merge(state, { numbers: action.data.data, phonesFetchInProgress: false });

    case GENERIC_GET_PHONES_FAIL:
      return Immutable.merge(state, { numbers: [], phonesFetchInProgress: false });

    case GENERIC_GET_EMAILS_INIT:
      return Immutable.merge(state, { emails: [], emailsFetchInProgress: true });

    case GENERIC_GET_EMAILS_SUCCESS:
      return Immutable.merge(state, { emails: action.data.data, emailsFetchInProgress: false });

    case GENERIC_GET_EMAILS_FAIL:
      return Immutable.merge(state, { emails: [], emailsFetchInProgress: false });

    case GENERIC_GET_ADDRESSES_INIT:
      return Immutable.merge(state, { addresses: [], addressesFetchInProgress: true });

    case GENERIC_GET_ADDRESSES_SUCCESS:
      return Immutable.merge(state, { addresses: action.data.data, addressesFetchInProgress: false });

    case GENERIC_GET_ADDRESSES_FAIL:
      return Immutable.merge(state, { addresses: [], addressesFetchInProgress: false });

    case GENERIC_UPDATE_NUMBER_INIT:
      return Immutable.merge(state, { communicationDetailsUpdate: null });

    case GENERIC_UPDATE_NUMBER_SUCCESS:
      const updatedNumbers = state.numbers.map(
        (content) => (content.id === action.data.data.id ? action.data.data : content)
      );
      return Immutable.merge(state, { numbers: updatedNumbers, communicationDetailsUpdate: 'success' });

    case GENERIC_UPDATE_NUMBER_FAIL:
      return Immutable.merge(state, { numbers: [...state.numbers], communicationDetailsUpdate: 'failed' });

    case GENERIC_UPDATE_EMAIL_INIT:
      return Immutable.merge(state, { communicationDetailsUpdate: null });

    case GENERIC_UPDATE_EMAIL_SUCCESS:
      const updatedEmails = state.emails.map(
        (content) => (content.id === action.data.data.id ? action.data.data : content)
      );
      return Immutable.merge(state, { emails: updatedEmails, communicationDetailsUpdate: 'success' });

    case GENERIC_UPDATE_EMAIL_FAIL:
      return Immutable.merge(state, { emails: [...state.emails], communicationDetailsUpdate: 'failed' });

    case GENERIC_UPDATE_ADDRESS_INIT:
      return Immutable.merge(state, { communicationDetailsUpdate: null });

    case GENERIC_UPDATE_ADDRESS_SUCCESS:
      const updatedAdresses = state.addresses.map(
        (content) => (content.id === action.data.data.id ? action.data.data : content)
      );
      return Immutable.merge(state, { addresses: updatedAdresses, communicationDetailsUpdate: 'success' });

    case GENERIC_UPDATE_ADDRESS_FAIL:
      return Immutable.merge(state, { addresses: [...state.addresses], communicationDetailsUpdate: 'failed' });

    case 'PATRON_LEAD:CUSTOMER_DETAIL:UPDATE_STATUS:CLEAR':
      return Immutable.merge(state, { basicInfoUpdate: null });

    case PATRON_LEAD_CUSTOMER_DETAIL_SAVE_INIT:
      return Immutable.merge(state, { basicInfoUpdate: null });

    case PATRON_LEAD_CUSTOMER_DETAIL_SAVE_SUCCESS:
      return Immutable.merge(state, { basicInfoUpdate: 'success' });

    case PATRON_LEAD_CUSTOMER_DETAIL_SAVE_FAIL:
      return Immutable.merge(state, { basicInfoUpdate: 'failed' });

    case PATRON_LEAD_INVESTOR_DETAIL_SAVE_INIT:
      return Immutable.merge(state, { fundingInfoUpdate: null });

    case PATRON_LEAD_INVESTOR_DETAIL_SAVE_SUCCESS:
      return Immutable.merge(state, { fundingInfoUpdate: 'success' });

    case PATRON_LEAD_INVESTOR_DETAIL_SAVE_FAIL:
      return Immutable.merge(state, { fundingInfoUpdate: 'failed' });

    case 'PATRON_LEAD:INVESTOR_DETAIL:UPDATE_STATUS:CLEAR':
      return Immutable.merge(state, { fundingInfoUpdate: null });

    case PATRON_STATUS_UPDATE_SUCCESS:
      return Immutable.merge(state, { patronDetail: action.data.data });

    case PATRON_CREATE_PATRON_FAIL:
      return Immutable.merge(state, { patronCreate: 'failed', errorMsg: action.error });

    case PATRON_CREATE_PATRON_SUCCESS:
      return Immutable.merge(state, { patronCreate: 'success' });

    case 'PATRON:CREATE_BRAND:CANCEL':
      return Immutable.merge(state, { patronCreate: null, errorMsg: null });

    case PATRON_LEAD_DOCUMENT_CONFIG_FETCH_INIT:
      return Immutable.merge(state, { docConfig: null });

    case PATRON_LEAD_DOCUMENT_CONFIG_FETCH_SUCCESS:
      return Immutable.merge(state, { docConfig: action.data.data });

    case PATRON_LEAD_DOCUMENT_CONFIG_FETCH_FAIL:
      return Immutable.merge(state, { docConfig: null });
    case PATRON_LEAD_DOCUMENT_METADATA_POST_INIT:
      return Immutable.merge(state, { postSuccess: false, metaData: null });

    case PATRON_LEAD_DOCUMENT_METADATA_POST_SUCCESS:
      return Immutable.merge(state, { postSuccess: true });

    case PATRON_LEAD_DOCUMENT_METADATA_POST_FAIL:
      return Immutable.merge(state, { postSuccess: false });

    case PATRON_LEAD_DOCUMENT_LIST_FETCH_INIT:
      return Immutable.merge(state, { dataDocs: null });

    case PATRON_LEAD_DOCUMENT_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        dataDocs: action && action.data && action.data.data
      });
    case PATRON_LEAD_DOCUMENT_LIST_FETCH_FAIL:
      return Immutable.merge(state, {
        dataDocs: null
      });
    case 'PATRON_LEAD:META_DATA:SAVE':
      return Immutable.merge(state, { metaData: action.metaData });
    case 'PATRON_LEAD:META_DATA:CANCEL':
      return Immutable.merge(state, { metaData: null });

    case PATRON_BANK_DETAILS_INIT:
      return Immutable.merge(state, { bankDetails: {} });

    case PATRON_BANK_DETAILS_SUCCESS:
      return Immutable.merge(state, { bankDetails: action.data.data });

    case PATRON_BANK_DETAILS_FAIL:
      return Immutable.merge(state, { bankDetails: {} });

    case GENERIC_CLEAR_PHONES:
      return Immutable.merge(state, { numbers: [] });

    case GENERIC_CLEAR_EMAILS:
      return Immutable.merge(state, { emails: [] });

    case GENERIC_CLEAR_ADDRESSES:
      return Immutable.merge(state, { addresses: [] });

    case CUSTOMER_LIST_FETCH_INIT:
      return Immutable.merge(state, { customerList: null });

    case CUSTOMER_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        customerList: action.data.data,
        totalCount: action.data.meta.total
      });

    case CUSTOMER_LIST_FETCH_FAIL:
      return Immutable.merge(state, { customerList: null, totalCount: 0 });

    case PATRON_LIST_FETCH_INIT:
      return Immutable.merge(state, { patronList: null });

    case PATRON_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        patronList: action.data.data,
        totalCount: action.data.meta.total
      });

    case PATRON_LIST_FETCH_FAIL:
      return Immutable.merge(state, { patronList: null, totalCount: 0 });

    default:
      return state;
  }
};
