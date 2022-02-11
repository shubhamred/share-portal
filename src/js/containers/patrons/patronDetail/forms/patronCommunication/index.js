import { connect } from 'react-redux';
import PatronCommunication from './patronCommunication';
import { getCommunicationsDetail } from '../../../saga';

const mapStateToProps = ({ patronReducer }) => ({
  patronDetail: patronReducer.patronDetail,
  formData: patronReducer.formData
});

const mapDispatchToProps = () => ({
  getCommunicationsDetail
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatronCommunication);
