import { connect } from 'react-redux';
import PointList from './pointList';
import { getPoints, createPoint } from '../saga';

const mapStateToProps = ({ loyaltyReducer }) => ({
  pointList: loyaltyReducer.pointList,
  totalCount: loyaltyReducer.totalCount,
  pointStatus: loyaltyReducer.pointStatus
});

const mapDispatchToProps = (dispatch) => ({
  getPoints,
  createPoint,
  onCancel: () => {
    dispatch({ type: 'LOYALTY:CREATE_BRAND:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PointList);
