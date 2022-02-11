import { connect } from 'react-redux';
import { postMetaData, updateDocumentStatus,
  viewImage, removeFile } from 'app/containers/patrons/saga';
import { getAccounts, getBankDocs, getBankPreSignedURL, getDocType, parseAccount } from '../../../../saga';
import BankingdocList from './bankingDocList';

const mapStateToProps = ({ brandReducer, patronReducer }) => ({
  brandDetail: brandReducer.brandDetail,
  bankData: brandReducer.accounts,
  bankDocs: brandReducer.bankDocs,
  docType: brandReducer.docType,
  metaData: patronReducer.metaData,
  messageType: brandReducer.messageType
});

const mapDispatchToProps = (dispatch) => ({
  getAccounts,
  getDocType,
  getBankDocs,
  viewImage,
  removeFile,
  updateDocumentStatus,
  parseAccount,
  postMetaData,
  getBankPreSignedURL,
  // saveMetaData: (resourceId, resourceType, name, type, size, docType, docCategory, key) => {
  //   dispatch({
  //     type: 'PATRON_LEAD:META_DATA:SAVE',
  //     metaData: { resourceId, resourceType, name, type, size, docType, docCategory, key }
  //   });
  // },
  saveMetaData: (metaData) => {
    dispatch({
      type: 'PATRON_LEAD:META_DATA:SAVE',
      metaData
    });
  },
  cancelMetaData: () => {
    dispatch({ type: 'PATRON_LEAD:META_DATA:CANCEL' });
  },
  clearError: () => {
    dispatch({ type: 'BRAND:CLEAR_ERROR' });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BankingdocList);
