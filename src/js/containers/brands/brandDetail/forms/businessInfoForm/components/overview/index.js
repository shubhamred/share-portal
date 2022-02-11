import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { formatDateStandard, formatOtherArray } from 'app/utils/utils';
import { operatingSectorsList } from 'app/constants/misc';
import Overview from './overview';
import validate from './validate';
import { getBusinessDetails, updateBusinessDetails, getApplicantList, updateFinancials } from '../../../../../saga';

const OverviewFormWrapper = reduxForm({
  form: 'overviewForm',
  validate,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true
})(Overview);

const mapStateToProps = ({ brandReducer }) => {
  const operatingSectorsValue = (brandReducer.formData.data && brandReducer.formData.data.brandBusinessCategory
    && formatOtherArray(brandReducer.formData.data.brandBusinessCategory, operatingSectorsList)) || { list: [], others: '' };
  return ({
    businessDetailsUpdate: brandReducer.businessDetailsUpdate,
    brandDetail: brandReducer.brandDetail,
    formData: brandReducer.formData,
    initialValues: {
      brandName: brandReducer.formData.data.businessName,
      workEmail: brandReducer.formData.data.officialEmail,
      description: brandReducer.formData.data.description,
      websiteUrl: brandReducer.formData.data.website,
      legalName: brandReducer.formData.data.legalName,
      businessPAN: brandReducer.formData.data.pan,
      legalConstitution: brandReducer.formData.data.legalConstitution,
      dateOfIncorportation: brandReducer.formData.data.incorporationDate
        && formatDateStandard(brandReducer.formData.data.incorporationDate),
      cin: brandReducer.formData.data.cin,
      gstin: brandReducer.formData.data.gstin,
      numberOfDirectors: brandReducer.applicantList && brandReducer.applicantList.length,
      operatingSectors: operatingSectorsValue.list,
      otherSectors: operatingSectorsValue.others,
      financialRequestStatus: brandReducer.formData.data.financialRequestStatus,
      lastFinancialRequestAt: brandReducer.formData.data.lastFinancialRequestAt,
      companyLogo: brandReducer.formData.data.companyLogo
    },
    messageType: brandReducer.messageType
  });
};
const mapDispatchToProps = (dispatch) => ({
  getBusinessDetails,
  updateBusinessDetails,
  getApplicantList,
  clearValues: () => {
    dispatch({ type: 'FORM_DATA_CLEAR' });
  },
  clearUpdateStatus: () => {
    dispatch({ type: 'BRAND_LEAD:BUSINESS_DETAIL:UPDATE_STATUS:CLEAR' });
  },
  updateFinancials,
  clearError: () => {
    dispatch({ type: 'BRAND:CLEAR_ERROR' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OverviewFormWrapper);
