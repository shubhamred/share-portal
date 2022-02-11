import { connect } from 'react-redux';
import PatronDetail from './patronDetail';
import { getPatronDetail, updateInvestorStatus } from '../saga';

const mapStateToProps = ({ patronReducer }) => ({
  patronDetail: patronReducer.patronDetail
});

const mapDispatchToProps = () => ({
  getPatronDetail,
  updateInvestorStatus
});

export default connect(mapStateToProps, mapDispatchToProps)(PatronDetail);
