import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { saveFile } from 'app/containers/applications/saga';
import { getPatronDocPresignedUrl, getDocs } from 'app/containers/patrons/saga';
import { SingleDocument, FileUploader, Button } from 'app/components';
import styles from '../styles.scss';

const UploadTemplate = (props) => {
  const { uploadDoc, handleCancel, isDocType, getFiles, customCancelText = '', customCTAText = '' } = props;
  const [docs, setDocs] = useState([]);
  const dispatch = useDispatch();
  const resource = uploadDoc.resource || uploadDoc.documentCategoryId;

  const saveMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    saveFile({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      if (res.error) {
        dispatch({
          type: 'show',
          payload: res?.message || 'Failed to upload!',
          msgType: 'error'
        });
        return;
      }
      if (res.data) {
        dispatch({
          type: 'show',
          payload: 'Templates uploaded successfully!',
          msgType: 'success'
        });
        getDocs(uploadDoc.id, resource).then((response) => {
          if (response.data) {
            setDocs(response?.data);
          }
        });
        if (isDocType) {
          getFiles(uploadDoc.id, resource);
        }
      }
    });
  };

  useEffect(() => {
    getDocs(uploadDoc.id, resource).then((response) => {
      if (response.data) {
        setDocs(response?.data);
      }
    });
  }, []);

  return (
    <Grid>
      <Grid container={true} xs={12}>
        <Grid item={true} className={styles.formLabelStyle1} xs={12}>
          <Grid item={true} xs={10}>
            <div className={`${styles.mainTitle}`}>
              Templates
            </div>
          </Grid>
          <Grid item={true} xs={10}>
            <div className={`${styles.lableStyle} ${styles.helpText}`}>
              Templates are the files/docs that are required for this Doc category and need to be shown on Brands app for user reference.
            </div>
          </Grid>
          {uploadDoc?.id && (
            <Grid container={true} className={styles.uploader}>
              <Grid item={true} xs={7} className={styles.pt10}>
                <FileUploader
                  getPreSignedUrl={getPatronDocPresignedUrl}
                  uploadedDocumentCount={null}
                  resourceType={resource}
                  docCategory={uploadDoc?.documentCategory?.key}
                  resourceId={uploadDoc?.id}
                  minNumberOfFiles={1}
                  docType={uploadDoc?.documentType}
                  handleSaveMetaData={saveMetaData}
                />
              </Grid>
            </Grid>
          )}
          <Grid container={true} alignItems="center">
            {docs?.length ? docs?.map((file) => (
              file.files?.map((data) => (
                <Grid item={true} xs={4} key={data.id} className={styles.mb10}>
                  <SingleDocument name={data.fileName} id={data.id} />
                </Grid>
              ))
            )) : null}
          </Grid>
        </Grid>
        <Grid
          item={true}
          xs={12}
          className={`${styles.formLabelStyle} ${styles.pt14}`}
        >
          <Grid container={true} justify="flex-end">
            <Grid item={true} xs="auto">
              <Button
                onClick={handleCancel}
                label={customCancelText || 'Cancel'}
                style={{
                  backgroundColor: '#fff',
                  color: '#4754D6',
                  minWidth: 100,
                  border: 'none',
                  width: 'fit-content',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </Grid>
            <Grid item={true} xs="auto">
              <Button
                type="submit"
                label={customCTAText || 'Done'}
                style={{
                  backgroundColor: '#4754D6',
                  minWidth: 100,
                  width: 'fit-content',
                  margin: '0 auto',
                  display: 'block'
                }}
                onClick={handleCancel}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

UploadTemplate.propTypes = {
  uploadDoc: PropTypes.shape(PropTypes.object),
  handleCancel: PropTypes.func
};

UploadTemplate.defaultProps = {
  uploadDoc: {},
  handleCancel: () => { }
};

export default UploadTemplate;
