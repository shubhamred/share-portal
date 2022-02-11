import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FundingInfo from './fundingInfo';
import validate from './validate';
import { getInvestorProfileDetail, saveFundingInfo } from '../../../saga';

const FundingInfoFormWrapper = reduxForm({
  form: 'patronFundingInfoForm',
  validate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(FundingInfo);

const mapStateToProps = ({ patronReducer }) => ({
  fundingInfoUpdate: patronReducer.fundingInfoUpdate,
  patronDetail: patronReducer.patronDetail,
  formData: patronReducer.formData
});

const mapDispatchToProps = (dispatch) => ({
  getInvestorProfileDetail,
  saveFundingInfo,
  clearUpdateStatus: () => {
    dispatch({ type: 'PATRON_LEAD:INVESTOR_DETAIL:UPDATE_STATUS:CLEAR' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FundingInfoFormWrapper);
