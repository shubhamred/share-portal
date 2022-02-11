import React, { useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  TextField
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';
import { FileUploader, SingleDocument } from 'app/components';
import { saveFile } from 'app/containers/applications/saga';
import { getPatronDocPresignedUrl, removeFile } from 'app/containers/patrons/saga';
import { parseHTML } from 'app/utils/utils';
import styles from '../../styles.scss';

const DocType = (props) => {
  const { docs, type: docConfig, handleOptionChange, handleDelete, handleEdit, isLastDocType, config, getDocuments } = props;
  const { id: configTypeId } = docConfig || {};

  useEffect(() => {
    getDocuments(docConfig);
  }, []);

  const handleDeleteDoc = (fileId) => {
    removeFile(fileId).then((res) => {
      if (res.data) {
        getDocuments(docConfig);
      }
    });
  };

  const saveMetaData = (resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key) => {
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
      if (res.data) {
        getDocuments(docConfig);
      }
    });
  };

  return (
    <Grid
      container={true}
      alignItems="flex-end"
      className={styles.mb1rem}
      justify="space-between"
    >
      <Grid item={true} xs={2}>
        <TextField
          type="text"
          disabled={true}
          label="Document Types"
          value={docConfig.documentType.name}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item={true} xs={2}>
        <TextField
          type="text"
          disabled={true}
          label="Allowed Content Types"
          value={
            docConfig?.documentType?.allowedContentTypes
              ? docConfig.documentType.allowedContentTypes.toString()
              : ''
          }
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item={true} xs={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={docConfig.isMandatory}
              onChange={({ target: { checked } }) => handleOptionChange('isMandatory', checked, docConfig)}
              name="mandatory"
              color="primary"
            />
          }
          label="Mark Mandatory"
        />
      </Grid>
      <Grid item={true} xs={1}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={true}
              checked={docConfig.isMultiple}
              onChange={({ target: { checked } }) => handleOptionChange('isMultiple', checked, docConfig)}
              name="multiple"
              color="primary"
            />
          }
          label="Multiple"
        />
      </Grid>
      {docConfig?.isMultiple ? (
        <Grid item={true} xs={2}>
          <TextField
            type="number"
            disabled={true}
            label="Max no of Files"
            onChange={({ target: { value } }) => handleOptionChange('noOfFiles', value, docConfig)}
            value={docConfig.noOfFiles}
            style={{ width: '100%' }}
          />
        </Grid>
      ) : (
        <Grid item={true} xs={2} />
      )}
      <Grid container={true} item={true} xs={1} justify="space-between">
        <Grid item={true}>
          <IconButton
            color="primary"
            aria-label="Delete file"
            component="span"
            onClick={() => handleEdit(docConfig)}
            style={{ color: '#000000DE' }}
          >
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item={true}>
          <IconButton
            color="primary"
            aria-label="Delete file"
            component="span"
            onClick={() => handleDelete(docConfig.id)}
            style={{ color: 'rgba(176, 0, 32, 0.87)' }}
          >
            <HighlightOffIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container={true} style={{ paddingTop: '14px' }}>
        {docConfig?.applicationStatus && (
          <Grid item={true} xs={3}>
            <TextField
              type="text"
              disabled={true}
              label="Application Status"
              value={docConfig?.applicationStatus}
              style={{ width: '100%' }}
            />
          </Grid>
        )}
        {docConfig?.resource && (
          <Grid item={true} xs={3}>
            <TextField
              type="text"
              disabled={true}
              label="Resource"
              value={docConfig?.resource}
              style={{ width: '100%' }}
            />
          </Grid>
        )}

      </Grid>

      <Grid item={true} xs={12} className={styles.templateContainer}>
        {docConfig?.isTemplateRequired && (
          <Grid container={true} className={styles.mt10}>
            <Grid item={true} xs={12} className={styles.fileContainer}>
              {docs?.[configTypeId]?.length ? docs[configTypeId]?.map((file) => (
                file.files?.map((data) => (
                  <Grid item={true} xs={4} key={data.id} className={styles.mb10}>
                    <SingleDocument name={data.fileName} id={data.id} onDeleteClick={() => handleDeleteDoc(data.id)} />
                  </Grid>
                ))
              )) : null}
              <FileUploader
                getPreSignedUrl={getPatronDocPresignedUrl}
                uploadedDocumentCount={null}
                resourceType={docConfig?.resource}
                docCategory={config?.documentCategory?.key}
                resourceId={docConfig?.id}
                minNumberOfFiles={1}
                docType={docConfig?.documentType}
                handleSaveMetaData={saveMetaData}
                btnLabel="Upload Templates"
              />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item={true} xs={12} className={isLastDocType ? styles.descriptionContainerLast : styles.descriptionContainer}>
        <p style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.38)' }}>Description:</p>
        {parseHTML(docConfig?.description)}
      </Grid>
    </Grid>
  );
};

export default React.memo(DocType);
