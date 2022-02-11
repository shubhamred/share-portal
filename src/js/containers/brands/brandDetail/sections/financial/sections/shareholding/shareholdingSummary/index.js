import { connect } from 'react-redux';
import ShareholdingSummary from './shareholdingSummary';
import { getFinancialShareholdingType } from '../../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialShareholdingSummary: brandReducer.financialShareholdingSummary,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialShareholdingType
});

export default connect(mapStateToProps, mapDispatchToProps)(ShareholdingSummary);
