import { connect } from 'react-redux';
import { submit } from 'redux-form';
import DealForm from './dealForm';

const mapStateToProps = ({ dealReducer }) => ({
  dealConfig: dealReducer.dealConfig,
  dealFormError: dealReducer.formErrors,
  showDealError: dealReducer.showDealError,
  currentSectionDataUpdated: dealReducer.currentSectionDataUpdated,
  isUsingOldConfig: dealReducer.isUsingOldConfig
});

const mapDispatchToProps = (dispatch) => ({
  submitSection: (sectionName, formValues, visibilityValues) => {
    dispatch({ type: 'SECTION:SUBMIT', sectionName, formValues, visibilityValues });
  },
  addField: (sectionName, selectedFieldName, selectedFieldLabel) => {
    dispatch({ type: 'SECTION:FIELD:ADD', sectionName, fieldType: selectedFieldName, fieldLabel: selectedFieldLabel });
  },
  deleteField: (sectionName, fieldKey) => {
    dispatch({ type: 'SECTION:FIELD:DELETE', sectionName, fieldKey });
  },
  deleteSubFieldValue: (sectionName, fieldKey, newValues) => {
    dispatch({ type: 'SECTION:SUB_FIELD_VALUE:DELETE', sectionName, fieldKey, newValues });
  },
  changeVisibility: (fieldKey, sectionName, visibilityValue) => {
    dispatch({ type: 'DEAL_FIELD_VISIBILITY:CHANGE', fieldKey, sectionName, visibilityValue });
  },
  remoteSubmit: () => {
    dispatch(submit('DealForm'));
  },
  resetNextTab: () => {
    dispatch({ type: 'NEXTAB_RESET' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DealForm);
