import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { formatDateStandard } from 'app/utils/utils';
import ApplicantForm from './applicantForm';
import validate from './validate';
import { submitApplicantInfo, getCustomerInfo } from '../../../../../saga';

const PerformanceInfoFormWrapper = reduxForm({
  form: 'applicantInfoForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate
})(ApplicantForm);

const mapStateToProps = ({ brandReducer }) => ({
  applicantDetailsUpdate: brandReducer.applicantDetailsUpdate,
  formData: brandReducer.formData,
  applicantInfo: brandReducer.applicantInfo,
  initialValues: {
    firstName: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.firstName),
    lastName: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.lastName),
    middleName: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.middleName),
    primaryEmail: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.email),
    primaryNumber: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.mobile),
    loginCred: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.loginType),
    DOB: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.dateOfBirth
    && formatDateStandard(brandReducer.applicantInfo.customer.dateOfBirth)),
    gender: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.gender),
    PAN: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.pan),
    DIN: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.din),
    linkedInUrl: (brandReducer.applicantInfo.customer && brandReducer.applicantInfo.customer.linkedInUrl),
    shareholding: (brandReducer.applicantInfo && brandReducer.applicantInfo.percentageHolding)
  }
});

const mapDispatchToProps = (dispatch) => ({

  submitApplicantInfo,
  getCustomerInfo,
  clearUpdateStatus: () => {
    dispatch({ type: 'BRAND_LEAD:APPLICANT_DETAIL:UPDATE_STATUS:CLEAR' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceInfoFormWrapper);
