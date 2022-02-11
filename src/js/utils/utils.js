/* eslint-disable react/jsx-filename-extension */
import React, { lazy, Suspense } from 'react';
import Immutable from 'seamless-immutable';
import parse from 'html-react-parser';
import { dealTags } from './constants';
import DealPerformanceStatus from './enums';
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
export const validateEmail = (email) => {
  // eslint-disable-next-line max-len
  // const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  //   return re.test(email);
  // const testEmail = email ? email.split('@', 2) : [];
  // const gmail = testEmail && testEmail[1].split('.', 1);
  // if (gmail[0] === 'gmail') {
  //   const result = testE mail && !(testEmail[0].length < 6);
  //   return result;
  // }

  const validator = require('email-validator');
  return validator.validate(email);
};

export const validatePincode = (pincode) => {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
};

export const validateMobile = (val) => {
  const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
  let valid = false;
  try {
    const number = phoneUtil.parseAndKeepRawInput(val);
    valid = phoneUtil.isValidNumber(number);
  } catch (e) {
    valid = false;
  }
  return valid;
};

export const validateBusinessPAN = (pan) => {
  const re = /[a-zA-Z]{5}\d{4}[a-zA-Z]{1}/;
  return re.test(pan);
};

export const validateIndividualPAN = (pan) => {
  const re = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  return re.test(pan);
};

export const validateGSTIN = (gstin) => {
  const re = /\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[Z]{1}[a-zA-Z\d]{1}/;
  return re.test(gstin);
};

export const validateUrl = (url) => {
  // eslint-disable-next-line max-len
  const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return re.test(url);
};

export const validateName = (name) => {
  const re = /^[a-zA-Z ]{1,30}$/;
  return re.test(name);
};

export const formatDate = (input) => {
  const datePart = input && input.match(/\d+/g);
  if (datePart && datePart.length) {
    const day = datePart[0]; // get only two digits
    const month = datePart[1];
    const year = datePart[2];
    return `${year}-${month}-${day}`;
  }
  return null;
};

export const formatDateStandard = (input) => {
  const datePart = input && input.match(/\d+/g);
  if (datePart && datePart.length) {
    const year = datePart[0];
    const month = datePart[1];
    const day = datePart[2];
    return `${day}/${month}/${year}`;
  }
  return null;
};

export const getISOFormatDate = (string = '') => {
  if (string) {
    const chunks = string.split('/');
    // eslint-disable-next-line radix
    const dateObj = new Date(parseInt(chunks[2]), parseInt(chunks[1] - 1), parseInt(chunks[0]));
    return dateObj.toISOString();
  }
  return '';
};

export const convertISO = (isoDate) => {
  const date = new Date(isoDate);
  const newDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  return newDate;
};

export const formatHashedURL = (value = '') => {
  const index = value.indexOf('#');
  if (index >= 0) {
    return value.slice(0, index);
  }
  return value;
};

export const getParameterValuesFromHash = (url) => {
  if (url) {
    let { hash } = window.location;
    hash = decodeURIComponent(hash);
    hash = hash.indexOf('?') > 0 ? hash.substring(0, hash.indexOf('?')) : hash;
    const splitHash = hash.split('/');
    const splitUrl = url.split('/');
    const parameterValues = {};

    // TODO : Implement this using ES6 Constructs
    for (let index = 1; index < splitUrl.length; index += 1) {
      let parameter = splitUrl[index];
      if (parameter.indexOf(':') >= 0) {
        parameter = parameter.substring(1);
        parameterValues[parameter] = formatHashedURL(splitHash[index]);
      }
    }
    return parameterValues;
  }
  return null;
};

export const openUrlInNewTab = (url) => {
  window.open(url, '_blank');
};

export const filterDocumentBasedOnStatus = (docList, status) => {
  const docArray = [];
  docList
    && docList.map((doc) => {
      if (doc.status === status) {
        docArray.push(doc);
      }
    });
  return docArray;
};

export const sortArrayWithKey = (array, keyName) => array
  && [...array].sort((inputA, inputB) => {
    const keyA = inputA[keyName];
    const keyB = inputB[keyName];
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  });

export const getPosMachineStatus = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '';
};
export const formatOtherArray = (values, arrayList) => {
  const list = Immutable.asMutable(values, { deep: true });
  let diff = [];
  if (list && list.length) {
    diff = values.filter((value) => !arrayList.includes(value));
    if (list.includes(diff[0])) {
      list[list.indexOf(diff[0])] = 'Other';
    }
  }
  return {
    list,
    others: diff[0]
  };
};

export const reducerTest = (reducer, defaultState) => {
  const initialState = reducer(defaultState, {});
  return {
    expect: (action) => {
      const newState = reducer(initialState, action);
      return {
        toReturn: (expected) => {
          expect(newState).toEqual(expected);
        }
      };
    }
  };
};

// eslint-disable-next-line max-len
export const formatCurrency = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency,
  minimumFractionDigits: 0
}).format(amount);

export const loadable = (
  importFunc,
  { fallback = null } = { fallback: <div>Loading...</div> }
) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    // eslint-disable-next-line react/jsx-filename-extension
    <Suspense fallback={fallback}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const Context = React.createContext({});

export const getVerifiedImage = (item, key) => (item[key] ? (
  <img
    style={{ width: '100%', height: '100%', maxWidth: '20px', padding: '0 5px' }}
    src="assets/ApprovedIcon.svg"
    alt="verified"
  />
) : '');

// formats the status strings
export const formatPerformanceText = (performance = '') => {
  switch (performance) {
    case DealPerformanceStatus.ON_TRACK:
      return 'On Track';
    case DealPerformanceStatus.ON_TRACK_50:
      return 'On Track 50%';
    default:
      return performance;
  }
};

// decode Params from the query string
export const decodeParams = () => {
  const mSearch = window.location.hash.split('?')[1];
  let mData = {};
  if (mSearch) {
    mData = JSON.parse(
      `{"${decodeURI(mSearch).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
    );
  }
  return mData;
};

// get Hash value from the position
export const getHashPositionValue = (position) => {
  const decodedURL = decodeURIComponent(window?.location?.hash || '');
  const hash = decodedURL ? decodedURL.split('#')[2] : '';
  const listOfHash = hash?.split('-') || [];
  return listOfHash[position] || '';
};

export const updateObject = (oldProp, newProps) => ({
  ...oldProp,
  ...newProps
});

export const handleTagSelection = (tag = '') => {
  if (!tag) { return dealTags.NO_TAG; }

  const tags = Object.values(dealTags);
  if (!tags.includes(tag)) {
    return dealTags.OTHERS;
  }
  return tag;
};

export const getImageByFormat = (format = '') => {
  switch (true) {
    case format.includes('pdf'):
      return '/assets/pdf.svg';
    case format.includes('xl') || format.includes('excel') || format.includes('spreadsheet'):
      return '/assets/excel.svg';
    case format.includes('csv'):
      return '/assets/csv.svg';
    default:
      return '/assets/file.svg';
  }
};

export const parseHTML = (html) => (Array.isArray(parse(html || '')) ? null : parse(html || ''));
