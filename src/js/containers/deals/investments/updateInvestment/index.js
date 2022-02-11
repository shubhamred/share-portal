import { connect } from 'react-redux';
import UpdateInvestment from './updateInvestment';
import { getInvestmentDetail, updateInvestment } from '../../saga';

const mapStateToProps = ({ dealReducer }) => ({
  updateInvestmentStatus: dealReducer.updateInvestmentStatus,
  investmentDetail: dealReducer.investmentDetail
});

const mapDispatchToProps = () => ({
  getInvestmentDetail,
  updateInvestment
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInvestment);
