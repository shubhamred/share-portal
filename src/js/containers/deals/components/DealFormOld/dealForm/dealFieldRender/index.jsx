import { connect } from 'react-redux';
import DynamicForm from './dealFieldRender';
import { viewImage, removeFile, getDealDocPresignedUrl, getDocs,
  getDocTypeConfig, postMetaData, getDocsbyId } from '../../../../saga';

const mapStateToProps = ({ dealReducer }) => ({
  sectionList: dealReducer.sectionList,
  sectionConfig: dealReducer.sectionConfig,
  uploadedDocument: dealReducer.dealDocumentList,
  metaData: dealReducer.metaData,
  postedMetaData: dealReducer.postedMetaData,
  docTypeConfig: dealReducer.docTypeConfig
});

const mapDispatchToProps = (dispatch) => ({
  viewImage,
  removeFile,
  getDealDocPresignedUrl,
  getDocTypeConfig,
  getDocs,
  getDocsbyId,
  postMetaData,
  saveMetaData: (resourceId, resourceType, name, type, size, docType, docCategory, key) => {
    dispatch({
      type: 'DEAL_DOCUMENT:META_DATA:SAVE',
      metaData: { resourceId, resourceType, name, type, size, docType, docCategory, key }
    });
  },
  cancelMetaData: () => {
    dispatch({ type: 'DEAL_DOCUMENT:META_DATA:CANCEL' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicForm);
