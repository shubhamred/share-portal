/* eslint-disable global-require,react/jsx-props-no-spreading,prefer-destructuring */
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import React, { useEffect, useRef, useState } from 'react';
import AwsS3 from '@uppy/aws-s3';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import PropTypes from 'prop-types';
import { Grid, IconButton, makeStyles, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import registry from 'app-registry';

const useStyles = makeStyles(() => ({
  paper: {
    overflow: 'visible'
  }
}));

const DealFileUploader = (props) => {
  const classes = useStyles(props);
  const {
    maxNumberOfFiles,
    minNumberOfFiles,
    imageType,
    docType,
    handleSave,
    resourceCode,
    resourceType,
    uploadedDocumentCount,
    getPreSignedUrl,
    isMetaPending,
    btnLabel,
    onBtnClick,
    btnProps,
    allowedFileTypes,
    maxFileSize,
    uploadedURL,
    fieldName,
    currentFieldName,
    input
  } = props;

  let fieldType;
  let fieldId;
  if (currentFieldName) {
    const temp = currentFieldName.split('.')[0].split('_');
    fieldType = temp[0];
    fieldId = temp[1].split('[')[0];
  }

  const { assetsUrl } = registry.get('config');

  const [modalOpen, setModalOpen] = useState(false);
  const [previewModal, togglePreviewModal] = useState(false);

  const uppy = useRef(
    Uppy({
      restrictions: {
        maxNumberOfFiles,
        minNumberOfFiles,
        maxFileSize,
        allowedFileTypes
      }
    })
      .use(AwsS3, {
        async getUploadParameters(file) {
          const params = {
            resourceType,
            resourceCode: resourceCode || fieldId,
            imageType: imageType || fieldType
          };
          if (fieldType) params.name = `${fieldType} ${props.field.key}`;
          const uploadConfig = await getPreSignedUrl(params);
          return {
            method: 'PUT',
            url: uploadConfig.data.url,
            headers: {
              'Content-Type': file.data.type
            }
          };
        }
      })
      .on('complete', async (result) => {
        const AmazonS3URI = require('amazon-s3-uri');
        if (result.successful.length) {
          const { uploadURL } = result.successful[0];
          const { key } = AmazonS3URI(uploadURL);
          if (input && input.onChange) {
            input.onChange(`${assetsUrl}${key}`);
          } else {
            handleSave(fieldName, `${assetsUrl}${key}`);
          }
        }
        uppy.current.reset();
      })
  );

  useEffect(
    () => () => {
      document.body.classList.remove('uppy-Dashboard-isFixed');
      uppy.current.close();
    },
    []
  );

  const handleClose = (val) => {
    onBtnClick(val);
    // eslint-disable-next-line no-unused-expressions
    val ? null : document.body.classList.remove('uppy-Dashboard-isFixed');
    setModalOpen(val);
  };

  const handleInputChange = (event) => {
    const { target } = event;
    if (input && input.onChange) {
      input.onChange(target.value);
    }
  };

  return (
    <Grid container={true} item={true}>
      {input && (
        <TextField
          error={!!props.meta.error}
          helperText={props.meta.error}
          onChange={handleInputChange}
          value={input?.value}
          label={props?.field?.label}
        />
      )}
      {uploadedURL || input?.value ? (
        <Button
          startIcon={<VisibilityIcon />}
          style={{ marginRight: '15px' }}
          onClick={() => togglePreviewModal(true)}
        >
          Preview
        </Button>
      ) : null}
      <Button
        disabled={
          uploadedDocumentCount
            ? uploadedDocumentCount >= (docType && docType.maximumFiles)
            : !!isMetaPending
        }
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => handleClose(true)}
        {...btnProps}
      >
        {btnLabel || 'Upload Image'}
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
      <Dialog
        classes={{ paper: classes.paper }}
        onClose={() => togglePreviewModal(false)}
        open={previewModal}
      >
        <Grid container={true}>
          <Grid item={true}>
            <IconButton
              onClick={() => togglePreviewModal(false)}
              style={{ position: 'absolute', right: '-30px', top: '-35px' }}
            >
              <CancelIcon />
            </IconButton>
          </Grid>
          <Grid item={true} xs={12} style={{ overflow: 'auto', maxHeight: '80vh' }}>
            <img
              style={{ width: '100%', height: 'auto' }}
              src={uploadedURL || input?.value}
              alt="Preview"
            />
          </Grid>
        </Grid>
      </Dialog>
    </Grid>
  );
};

DealFileUploader.propTypes = {
  maxNumberOfFiles: Number,
  minNumberOfFiles: Number,
  isMetaPending: PropTypes.bool,
  onBtnClick: PropTypes.func,
  btnProps: PropTypes.object,
  docType: PropTypes.object,
  imageType: PropTypes.string,
  getPreSignedUrl: PropTypes.func,
  handleSave: PropTypes.func,
  maxFileSize: PropTypes.string,
  allowedFileTypes: PropTypes.array,
  resourceType: PropTypes.string,
  resourceCode: PropTypes.string,
  fieldName: PropTypes.string,
  uploadedURL: PropTypes.string
};

DealFileUploader.defaultProps = {
  maxNumberOfFiles: 1,
  minNumberOfFiles: 1,
  isMetaPending: false,
  onBtnClick: () => {},
  handleSave: () => {},
  btnProps: {},
  docType: {},
  imageType: '',
  maxFileSize: '',
  getPreSignedUrl: () => {},
  allowedFileTypes: ['image/*'],
  resourceType: '',
  resourceCode: '',
  uploadedURL: '',
  fieldName: ''
};

export default React.memo(DealFileUploader);
