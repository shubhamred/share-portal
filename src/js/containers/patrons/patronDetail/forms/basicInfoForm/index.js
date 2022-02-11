import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { formatDateStandard } from 'app/utils/utils';
import BasicInfo from './basicInfo';
import validate from './validate';
import { getCustomerDetail, saveBasicInfo } from '../../../saga';

const BasicInfoFormWrapper = reduxForm({
  form: 'patronBasicInfoForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(BasicInfo);
// eslint-disable-next-line no-nested-ternary
const booleanValueGetter = (value) => (value === '' || value === null ? null : value ? 'Yes' : 'No');
// eslint-disable-next-line no-nested-ternary
const nonTaxResidentGetter = (value) => (value === '' || value === null ? null : value ? 'No' : 'Yes');

const mapStateToProps = ({ patronReducer }) => ({
  basicInfoUpdate: patronReducer.basicInfoUpdate,
  patronDetail: patronReducer.patronDetail,
  formData: patronReducer.formData,
  initialValues: {
    firstName: patronReducer.formData.data.firstName,
    lastName: patronReducer.formData.data.lastName,
    middleName: patronReducer.formData.data.middleName,
    mobile: patronReducer.formData.data.mobile,
    email: patronReducer.formData.data.email,
    loginType: patronReducer.formData.data.loginType,
    linkedInUrl: patronReducer.formData.data.linkedInUrl,
    education: patronReducer.formData.data.education,
    designation: patronReducer.formData.data.designation,
    totalWorkExp: patronReducer.formData.data.totalWorkExperience,
    dateOfBirth: patronReducer.formData.data.dateOfBirth
    && formatDateStandard(patronReducer.formData.data.dateOfBirth),
    gender: patronReducer.formData.data.gender,
    panNumber: patronReducer.formData.data.pan,
    employerName: patronReducer.formData.data.employerName,
    fatherOrSpouseName: patronReducer.formData.data.fatherOrSpouseName,
    address: patronReducer.formData.data.address,
    correspondenceAddress: patronReducer.formData.data.correspondenceAddress,
    isAadhaarPresent: patronReducer.formData.data.isAadhaarPresent,
    investorProfileOption: patronReducer.formData.data.investorProfileOption,
    eligibleInvestor: booleanValueGetter(patronReducer.formData.data.eligibleInvestor),
    country: patronReducer.formData.data.country,
    tin: patronReducer.formData.data.tin,
    birthPlace: patronReducer.formData.data.birthPlace,
    nonTaxResident: nonTaxResidentGetter(patronReducer.formData.data.nonTaxResident),
    hasNriAccount: booleanValueGetter(patronReducer.formData.data.hasNriAccount)
  }
});

const mapDispatchToProps = (dispatch) => ({
  getCustomerDetail,
  saveBasicInfo,
  clearUpdateStatus: () => {
    dispatch({ type: 'PATRON_LEAD:CUSTOMER_DETAIL:UPDATE_STATUS:CLEAR' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfoFormWrapper);
