import { connect } from 'react-redux';
import Banking from './banking';
import { getBanks, getAccounts, addAccount, updateAccount, clearAccounts } from '../../../saga';

const mapStateToProps = ({ brandReducer }) => ({
  banks: brandReducer.banks,
  accounts: brandReducer.accounts,
  updateStatus: brandReducer.accountDetailsUpdate,
  accountsFetchInProgress: brandReducer.accountsFetchInProgress
});

const mapDispatchToProps = () => ({
  getBanks, getAccounts, addAccount, updateAccount, clearAccounts
});

export default connect(mapStateToProps, mapDispatchToProps)(Banking);
