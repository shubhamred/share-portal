import { connect } from 'react-redux';
import Documents from './document';

import { getApplicantList } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  brandDetail: brandReducer.brandDetail,
  applicantList: brandReducer.applicantList
});

const mapDispatchToProps = () => ({
  getApplicantList
});

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
