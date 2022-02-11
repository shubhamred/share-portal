import { connect } from 'react-redux';
import LegalHistory from './legalHistory';
import { getFinancialLegalHistory } from '../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialLegalHistory: brandReducer.financialLegalHistory,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialLegalHistory
});

export default connect(mapStateToProps, mapDispatchToProps)(LegalHistory);
