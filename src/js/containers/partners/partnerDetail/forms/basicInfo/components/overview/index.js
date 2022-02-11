import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getBusinessDetails } from 'app/containers/companies/saga';
import { getApplicantList } from 'app/containers/brands/saga';
import { updateCompanyDetails } from '../../../../../saga';
import Overview from './overview';

const OverviewFormWrapper = reduxForm({
  form: 'overviewForm',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  enableReinitialize: true
})(Overview);

const mapStateToProps = ({ brandReducer }) => ({
  partnerDetail: brandReducer.brandDetail,
  getCustomerList: brandReducer.applicantList,
  formData: brandReducer.formData,
  initialValues: {
    nbfcId: brandReducer.formData.data.companyCode,
    nbfcName: brandReducer.formData.data.businessName,
    nbfcWebsite: brandReducer.formData.data.website,
    nbfcLegalName: brandReducer.formData.data.legalName,
    nbfcMailId: brandReducer.formData.data.officialEmail,
    additionalData: brandReducer.formData.data.additionalData,
    corporateUtilityCode: brandReducer.formData.data.additionalData ? brandReducer.formData.data.additionalData.nachData.corporateUtilityCode : '',
    corporateConfigurationId: brandReducer.formData.data.additionalData ? brandReducer.formData.data.additionalData.nachData.corporateConfigurationId : '',
    nbfcSignatoryName: brandReducer?.applicantList?.length ? brandReducer?.applicantList[0].customer.name : '',
    nbfcMobile: brandReducer?.applicantList?.length ? brandReducer?.applicantList[0].customer.mobile : '',
    nbfcMail: brandReducer?.applicantList?.length ? brandReducer?.applicantList[0].customer.email : ''
  }
});

const mapDispatchToProps = (dispatch) => ({
  clearValues: () => {
    dispatch({ type: 'FORM_DATA_CLEAR' });
  },
  getBusinessDetails,
  getApplicantList,
  updateCompanyDetails
});

export default connect(mapStateToProps, mapDispatchToProps)(OverviewFormWrapper);
