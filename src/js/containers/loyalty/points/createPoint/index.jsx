// import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import CreatePoint from './createPoint';
// import validate from './validate';
import { createPoint } from '../../saga';
import { getBrands } from '../../../brands/saga';
import { getCustomers } from '../../../patrons/saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  pointStatus: loyaltyReducer.pointStatus,
  pointDetail: loyaltyReducer.pointDetail
});

const mapDispatchToProps = (dispatch) => ({
  createPoint,
  getBrands,
  getCustomers,
  onCancel: () => {
    dispatch({ type: 'LOYALTY:CREATE_REWARD:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoint);
