import { connect } from 'react-redux';
import SecurityAllotment from './securityAllotment';
import { getFinancialSecurityAllotment } from '../../../../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  financialSecuritiesAllotment: brandReducer.financialSecuritiesAllotment,
  totalCount: brandReducer.totalCount
});

const mapDispatchToProps = () => ({
  getFinancialSecurityAllotment
});

export default connect(mapStateToProps, mapDispatchToProps)(SecurityAllotment);
