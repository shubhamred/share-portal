import apiCall from 'app/sagas/api';

export default async function apiCallV1Integration(payload) {
  return apiCall(payload, 'integrations/v1');
}
