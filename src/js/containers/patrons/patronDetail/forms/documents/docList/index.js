import { connect } from 'react-redux';
import DocList from './docList';
import { getConfig, getPatronDocPresignedUrl, postMetaData, getDocs,
  updateDocumentStatus, viewImage, removeFile } from '../../../../saga';

const mapStateToProps = ({ patronReducer }) => ({
  docConfig: patronReducer.docConfig,
  patronDetail: patronReducer.patronDetail,
  metaData: patronReducer.metaData,
  dataDocs: patronReducer.dataDocs
});

const mapDispatchToProps = (dispatch) => ({
  getConfig,
  getDocs,
  postMetaData,
  getPatronDocPresignedUrl,
  updateDocumentStatus,
  viewImage,
  removeFile,
  saveMetaData: (resourceId, resourceType, name, type, size, docType, docCategory, key) => {
    dispatch({
      type: 'PATRON_LEAD:META_DATA:SAVE',
      metaData: { resourceId, resourceType, name, type, size, docType, docCategory, key }
    });
  },
  cancelMetaData: () => {
    dispatch({ type: 'PATRON_LEAD:META_DATA:CANCEL' });
  }
  // postMetaData
});

export default connect(mapStateToProps, mapDispatchToProps)(DocList);
