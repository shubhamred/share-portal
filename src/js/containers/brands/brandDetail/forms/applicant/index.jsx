import { connect } from 'react-redux';
import Applicant from './applicant';
import { addNewApplicant, getApplicantList } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  applicantList: brandReducer.applicantList
});

const mapDispatchToProps = (dispatch) => ({
  addNewApplicant,
  getApplicantList,
  setApplicantBasicInfo: (id) => {
    dispatch({ type: 'BRANDS:APPLICANT_INFO:STORE', id });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Applicant);
