import { connect } from 'react-redux';
import numberTabContent from './numberTabContent';
import { getPhones, saveAddNumber, updateNumber, clearPhones } from '../../../../../saga';

const mapStateToProps = ({ patronReducer }) => ({
  communicationDetailsUpdate: patronReducer.communicationDetailsUpdate,
  formData: patronReducer.formData,
  numbers: patronReducer.numbers,
  phonesFetchInProgress: patronReducer.phonesFetchInProgress
});

const mapDispatchToProps = () => ({
  getPhones, saveAddNumber, updateNumber, clearPhones
});

export default connect(mapStateToProps, mapDispatchToProps)(numberTabContent);
