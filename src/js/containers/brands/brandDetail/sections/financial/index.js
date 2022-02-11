import { connect } from 'react-redux';
import FinancialDetail from './financialDetail';
import { getFinancialDetail } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  brandDetail: brandReducer.brandDetail
});

const mapDispatchToProps = () => ({
  getFinancialDetail
});

export default connect(mapStateToProps, mapDispatchToProps)(FinancialDetail);
