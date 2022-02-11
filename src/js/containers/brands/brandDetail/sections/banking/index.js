import { connect } from 'react-redux';
import BankingDetail from './bankingDetail';
import { getBankingDetail } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  bankingDetail: brandReducer.brandDetail
});

const mapDispatchToProps = () => ({
  getBankingDetail
});

export default connect(mapStateToProps, mapDispatchToProps)(BankingDetail);
