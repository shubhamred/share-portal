import { connect } from 'react-redux';
import Shareholding from './shareholding';
import { getFinancialShareholding } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialShareholding: brandReducer.financialShareholding,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialShareholding
});

export default connect(mapStateToProps, mapDispatchToProps)(Shareholding);
