import Immutable from 'seamless-immutable';

const defaultState = Immutable.flatMap({
  docConfig: null
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'REPAYMENT_DOCUMENT_CONFIG_FETCH_SUCCESS':
      return Immutable.merge(state, {
        docConfig: action.data.data
      });
    case 'REPAYMENT_DOCUMENT_CONFIG_FETCH_INIT':
      return Immutable.merge(state, {
        docConfig: null
      });
    default:
      return state;
  }
};
