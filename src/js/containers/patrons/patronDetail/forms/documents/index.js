import { connect } from 'react-redux';
import Documents from './documents';

import { getConfig, getPatronDocPresignedUrl, postMetaData, getDocs } from '../../../saga';

const mapStateToProps = ({ patronReducer }) => ({
  patronDetail: patronReducer.patronDetail
});

const mapDispatchToProps = (dispatch) => ({
  getConfig,
  getDocs,
  postMetaData,
  getPatronDocPresignedUrl,
  saveMetaData: (resourceId, resourceType, name, type, size, docType, docCategory, key) => {
    dispatch({
      type: 'PATRON_LEAD:META_DATA:SAVE',
      metaData: { resourceId, resourceType, name, type, size, docType, docCategory, key }
    });
  }
  // postMetaData
});

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
