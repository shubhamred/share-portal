/* eslint-disable global-require,react/jsx-props-no-spreading */
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
// import Button from '../../../components/button/button';
import styles from './styles.scss';
import rootStyles from '../../../rootStyles.scss';

const FileUploader = (props) => {
  const { maxNumberOfFiles, minNumberOfFiles, getPreSignedUrl, docType, docCategory,
    handleSaveMetaData, resourceId, resourceType, uploadedDocumentCount, isMetaPending, btnLabel, onBtnClick, btnProps } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const uppy = useRef(Uppy({
    restrictions: {
      maxNumberOfFiles: docType.maximumFiles || maxNumberOfFiles,
      minNumberOfFiles,
      maxFileSize: docType.maximumFileSize,
      allowedFileTypes: docType.allowedContentTypes
    }
  })
    .use(AwsS3, {
      async getUploadParameters(file) {
        // TODO Pass the necessary props to get the presigned url
        const uploadConfig = await getPreSignedUrl(resourceId, resourceType, docType.key, docCategory, file.type);
        return {
          method: 'PUT', // here we send method, url, fields and headers to the AWS S3 bucket
          url: uploadConfig.data.url,
          headers: {
            'Content-Type': file.data.type
          }
        };
      }
    }).on('complete', async (result) => {
      const AmazonS3URI = require('amazon-s3-uri');
      if (result.successful.length > 0) {
        if (result.successful.length === 1 && maxNumberOfFiles === 1) {
          const { name, type, size, uploadURL } = result.successful[0];
          const { key } = AmazonS3URI(uploadURL);
          // On success update the metadata
          handleSaveMetaData(resourceId, resourceType, name, type, size,
            docType.key || docType, docCategory, key);
          handleClose(false);
        } else {
          const resultArr = result.successful.map(({ name, type, size, uploadURL }) => {
            const { key } = AmazonS3URI(uploadURL);
            return { resourceId, resourceType, name, type, size, docType: docType.key || docType, docCategory, key };
          });
          handleSaveMetaData(resultArr);
        }
      }
      uppy.current.reset();
    }));

  useEffect(() => () => {
    document.body.classList.remove('uppy-Dashboard-isFixed');
    uppy.current.close();
  }, []);

  const handleClose = (val) => {
    onBtnClick(val);
    // eslint-disable-next-line no-unused-expressions
    val ? null : document.body.classList.remove('uppy-Dashboard-isFixed');
    setModalOpen(val);
  };

  return (
    <Grid container={true} item={true}>
      <Button
        disabled={
          uploadedDocumentCount
            ? uploadedDocumentCount >= (docType && docType.maximumFiles)
            : !!isMetaPending
        }
        color="default"
        startIcon={<CloudUploadIcon className={styles.uploadBtnIcon} />}
        onClick={() => handleClose(true)}
        className={`${styles.uploadBtn} ${rootStyles.customSubtitle}`}
        {...btnProps}
      >
        {btnLabel || 'Upload'}
      </Button>
      {modalOpen && (
        <DashboardModal
          uppy={uppy.current}
          plugins={[]}
          proudlyDisplayPoweredByUppy={false}
          open={modalOpen}
          showProgressDetails={true}
          hideUploadButton={false}
          allowMultipleUploads={false}
          target="body"
          closeAfterFinish={true}
          onRequestClose={() => handleClose(false)}
          metaFields={[{ id: 'name', name: 'Name', placeholder: 'file name' }]}
          note="Choose images or PDF files"
        />
      )}
    </Grid>
  );
};
FileUploader.propTypes = {
  maxNumberOfFiles: Number,
  minNumberOfFiles: Number,
  getPreSignedUrl: PropTypes.func.isRequired,
  isMetaPending: PropTypes.bool,
  onBtnClick: PropTypes.func,
  btnProps: PropTypes.object
};

FileUploader.defaultProps = {
  maxNumberOfFiles: 1,
  minNumberOfFiles: 1,
  isMetaPending: false,
  onBtnClick: () => {},
  btnProps: {}
};

export default FileUploader;
