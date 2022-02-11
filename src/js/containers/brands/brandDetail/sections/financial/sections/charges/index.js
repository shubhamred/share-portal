import { connect } from 'react-redux';
import Charges from './charges';
import { getFinancialCharges } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialCharges: brandReducer.financialCharges,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialCharges
});

export default connect(mapStateToProps, mapDispatchToProps)(Charges);
