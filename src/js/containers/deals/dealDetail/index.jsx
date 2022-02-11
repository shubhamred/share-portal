import { connect } from 'react-redux';
import { submit } from 'redux-form';
import DealDetail from './dealDetail';
import { getConfig, getDealDetail, updateDealDetailForm, updateDealStatus,
  filterDealList, getAllSections } from '../saga';

const mapStateToProps = ({ dealReducer, form }) => ({
  sectionList: dealReducer.sectionList,
  sectionConfig: dealReducer.sectionConfig,
  deal: dealReducer.deal,
  dealStatus: dealReducer.deal.data.status,
  nextTab: dealReducer.nextTab,
  formSubmitted: dealReducer.formSubmitted,
  headerForm: form.dealHeaderForm,
  dealSaveStatus: dealReducer.dealSaveStatus,
  dealDocValidation: dealReducer.dealDocValidation

});

const mapDispatchToProps = (dispatch) => ({
  getConfig,
  getDealDetail,
  updateDealDetailForm,
  updateDealStatus,
  filterDealList,
  getAllSections,
  remoteSubmit: () => {
    dispatch(submit('DealForm'));
  },
  headerFormSubmit: () => {
    dispatch(submit('dealHeaderForm'));
  },
  saveDealProperty: (values) => {
    dispatch({ type: 'DEAL:PROPERTY:SUBMIT', values });
  },
  setNextTab: (tab) => {
    dispatch({ type: 'NEXTAB_SET', tab });
  },
  resetFormSubmitted: () => {
    dispatch({ type: 'RESET_FORMSUBMITTED' });
  },
  resetNextTab: () => {
    dispatch({ type: 'NEXTAB_RESET' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DealDetail);
