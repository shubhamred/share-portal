import { connect } from 'react-redux';
import emailTabContent from './emailTabContent';
import { getEmails, saveAddEmail, updateEmail, clearEmails } from '../../../../../saga';

const mapStateToProps = ({ patronReducer }) => ({
  communicationDetailsUpdate: patronReducer.communicationDetailsUpdate,
  formData: patronReducer.formData,
  emails: patronReducer.emails,
  emailsFetchInProgress: patronReducer.emailsFetchInProgress
});

const mapDispatchToProps = () => ({
  getEmails, saveAddEmail, updateEmail, clearEmails
});

export default connect(mapStateToProps, mapDispatchToProps)(emailTabContent);
