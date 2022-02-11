import apiCall from 'app/sagas/api';

export default async function apiCallV2(payload) {
  return apiCall(payload, 'v2');
}
