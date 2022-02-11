import { connect } from 'react-redux';
import PatronList from './patronList';
import { getPatrons, createPatron, getConfig, getPatronDocPresignedUrl, postMetaData, viewImage } from '../saga';

const mapStateToProps = ({ patronReducer }) => ({
  patronList: patronReducer.patronList,
  totalCount: patronReducer.totalCount,
  errorMsg: patronReducer.errorMsg,
  patronCreate: patronReducer.patronCreate,
  docConfig: patronReducer.docConfig
});

const mapDispatchToProps = (dispatch) => ({
  getPatrons,
  createPatron,
  getConfig,
  getPatronDocPresignedUrl,
  postMetaData,
  viewImage,
  onCancel: () => {
    dispatch({ type: 'PATRON:CREATE_BRAND:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PatronList);
