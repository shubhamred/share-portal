import Immutable from 'seamless-immutable';
import {
  GENERIC_REMARK_CREATE_INIT,
  GENERIC_REMARK_CREATE_SUCCESS,
  GENERIC_REMARK_CREATE_FAIL,
  GENERIC_REMARKS_GET_INIT,
  GENERIC_REMARKS_GET_SUCCESS,
  GENERIC_REMARKS_GET_FAIL,
  GENERIC_REMARKS_SET_OFFSET
} from '../../actions';

const defaultState = Immutable.flatMap({
  isProcessing: false,
  data: [],
  currentOffset: 0,
  totalCount: 0,
  isEditSuccess: false
});

const formatDataForTable = (data, state) => {
  const previousData = state.data;
  const { currentOffset } = state;
  const latestData = Immutable.asMutable(previousData, { deep: true });
  data.forEach((element, index) => {
    latestData[currentOffset + index] = element;
  });
  return latestData;
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GENERIC_REMARK_CREATE_INIT:
      return Immutable.merge(state, { isProcessing: true, isEditSuccess: false });

    case GENERIC_REMARK_CREATE_SUCCESS:
      return Immutable.merge(state, { isProcessing: false, data: [], isEditSuccess: true });

    case GENERIC_REMARK_CREATE_FAIL:
      return Immutable.merge(state, { isProcessing: false, isEditSuccess: false });

    case GENERIC_REMARKS_SET_OFFSET:
      return Immutable.merge(state, { currentOffset: (action.offset) || 0, data: !action.offset ? [] : state.data });

    case GENERIC_REMARKS_GET_INIT:
      return Immutable.merge(state, { isProcessing: true, isEditSuccess: false });

    case GENERIC_REMARKS_GET_SUCCESS:
      return Immutable.merge(state, { isProcessing: false,
        data: formatDataForTable(action.data.data, state),
        totalCount: action.data.meta.total });

    case GENERIC_REMARKS_GET_FAIL:
      return Immutable.merge(state, { isProcessing: false, data: [] });
    default:
      return state;
  }
};
