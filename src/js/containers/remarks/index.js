import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { onSubmitRemarks, getRemarks } from './sagas';
import {
  GENERIC_REMARKS_SET_OFFSET
} from '../../actions';
import Remarks from './remarks';
import validate from './validate';

const RemarksFormWrapper = reduxForm({
  form: 'remarksForm',
  validate
})(Remarks);
const mapStateToProps = ({ brandReducer, patronReducer, remarksReducer }) => ({
  isProcessing: remarksReducer.isProcessing,
  patronDetail: patronReducer.patronDetail,
  brandDetail: brandReducer.brandDetail,
  data: remarksReducer.data || [],
  totalCount: remarksReducer.totalCount,
  isEditSuccess: remarksReducer.isEditSuccess,
  initalValues: {
    remarks: ''
  }
});

const mapDispatchToProps = (dispatch) => ({
  onSubmitRemarks,
  getRemarks,
  setOffsetValue: (offset) => {
    dispatch({ type: GENERIC_REMARKS_SET_OFFSET, offset });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemarksFormWrapper);
