/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, FileUploader } from 'app/components';
import { Grid } from '@material-ui/core';
import styles from './styles.scss';
import UploadedDocumentElement from '../../../document/uploadedDocument';

const FileUpload = (props) => {
  const { docCategory, label, docType, input, getPreSignedUrl, applicationId, postMetaData, postedMetaData, getDocTypeConfig,
    viewImage, removeFile, uploadedDocument, getDocsbyId, disabled, metaData, saveMetaData, cancelMetaData, docTypeConfig } = props;
  const uploadedDocforDocType = uploadedDocument && uploadedDocument.length > 0
    && uploadedDocument.find((doc) => doc.docType === docType);

  useEffect(() => {
    if (input && input.value && input.value !== '') {
      getDocsbyId(input.value);
    }
  }, []);
  useEffect(() => {
    if (getDocTypeConfig && docType) {
      getDocTypeConfig(docType);
    }
  }, [docType]);
  if (postedMetaData) {
    const docData = postedMetaData;
    const docId = docData && docData.documentId;
    if (input) {
      input.onChange(docId);
    }
  }

  return (
    <>
      {docTypeConfig && (
        <Grid className={styles.container} item={true} justify="space-between" direction="row" container={true}>
          <Grid item={true} className={styles.category} xs={12}>
            {label}
          </Grid>
          <Grid container={true} item={true} xs={12}>
            <Grid
              container={true}
              item={true}
              xs={12}
              sm={12}
              // md={6}
              // lg={2}
              className={styles.uploadButton}
            >
              <Grid sm={2} item={true}>
                <div className={styles.uploadMessage}>Please upload your document</div>
              </Grid>

              <Grid
                xs={12}
                sm={2}
                item={true}
              >
                <FileUploader
                  maxNumberOfFiles={1}
                  minNumberOfFiles={1}
                  input={input}
                  getPreSignedUrl={getPreSignedUrl}
                  docType={docTypeConfig}
                  docCategory={docCategory}
                  resourceId={applicationId}
                  disabled={disabled}
                  uploadedDocumentCount={uploadedDocument && uploadedDocument.files && uploadedDocument.files.length}
                  resourceType="DEAL"
                  handleSaveMetaData={saveMetaData}
                />
              </Grid>
              {(metaData) && (
                <>
                  <Grid item={true} sm={4} className={styles.uploadedFile}>
                    <div style={{
                      width: '90%',
                      borderBottom: '1px solid #CAD1DF'
                    }}
                    >
                      {metaData && metaData.name}
                    </div>
                  </Grid>
                  <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                    <Button
                      type="button"
                      label="Save"
                      onClick={() => postMetaData(metaData)}
                    />
                  </Grid>
                  <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                    <Button
                      type="button"
                      label="Cancel"
                      style={{ backgroundColor: 'white', color: '#5A74ED' }}
                      onClick={() => cancelMetaData()}
                    />
                  </Grid>
                </>
              )}

            </Grid>
            {/* <Grid
          container={true}
          justify="flex-end"
          direction="row"
          xs={12}
          sm={6}
          md={6}
          lg={3}
          className={styles.statusText}
        /> */}
            <UploadedDocumentElement
              uploadedDocument={uploadedDocforDocType}
              viewImage={viewImage}
              removeFile={removeFile}
              resourceId={applicationId}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

FileUpload.propTypes = {
  disabled: PropTypes.bool,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  docType: PropTypes.string,
  docCategory: PropTypes.string,
  label: PropTypes.string,
  getDocsbyId: PropTypes.func,
  getPreSignedUrl: PropTypes.func,
  postMetaData: PropTypes.func,
  viewImage: PropTypes.func,
  removeFile: PropTypes.func,
  uploadedDocument: PropTypes.arrayOf(),
  applicationId: PropTypes.string
};

FileUpload.defaultProps = {
  disabled: false,
  input: {
    onChange: () => { },
    value: ''
  },
  docCategory: null,
  label: null,
  docType: null,
  getDocsbyId: () => { },
  getPreSignedUrl: () => { },
  postMetaData: () => { },
  viewImage: () => { },
  removeFile: () => { },
  uploadedDocument: null,
  applicationId: null
};

export default FileUpload;
