import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Dialog, DialogContent } from '@material-ui/core';
import styles from './styles.scss';
import FileList from '../fileList/fileList';
import Button from '../../../components/button/button';

const UploadedDocumentElement = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileItem, setFileItem] = useState();
  const { uploadedDocument, viewImage, removeFile, resourceType, resourceId, bankIdString } = props;
  let documentFiles = [];
  if (uploadedDocument && uploadedDocument.files) {
    const { files } = uploadedDocument;
    documentFiles = files.filter((file) => !file.archived);
  }
  return (
    <Grid className={styles.container} item={true} direction="row" container={true}>
      {uploadedDocument && uploadedDocument.files && uploadedDocument.files.length < 1 && documentFiles.map((file) => (
        <Grid className={styles.fileName} item={true}>
          {file.fileName}
          <IconButton onClick={() => viewImage(file.id)}>
            <img
              src="assets/view.svg"
              alt="alt"
              width={25}
              height={16}
              className={styles.navIcons}
            />
          </IconButton>
          <IconButton onClick={() => {
            setDialogOpen(true);
            setFileItem(file);
          }}
          >
            <img
              src="assets/delete.svg"
              alt="alt"
              width={16}
              height={16}
              className={styles.navIcons}
            />
          </IconButton>
        </Grid>
      ))}
      {dialogOpen && (
        <Dialog open={true} onClose={() => setDialogOpen(false)}>
          <DialogContent>
            {`Are you sure you want to delete this file - ${fileItem.fileName}?`}
            <Grid className={styles.dialogButtonContainer} container={true} xs={12} justify="space-around">
              <Grid className={styles.cancelButtonStyle} item={true}>
                <Button type="button" label="Cancel" onClick={() => setDialogOpen(false)} />
              </Grid>
              <Grid className={styles.deleteButtonStyle} item={true}>
                <Button
                  type="button"
                  label="Delete"
                  onClick={() => {
                    removeFile(fileItem.id, resourceId, resourceType);
                    setDialogOpen(false);
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
      {uploadedDocument && uploadedDocument.files && documentFiles.length > 0 && (
        <Grid container={true} item={true}>
          <FileList
            uploadedDocs={documentFiles}
            bankIdString={bankIdString}
            viewImage={viewImage}
            removeFile={removeFile}
            resourceType={resourceType}
            resourceId={resourceId}
          />
        </Grid>
      )}
    </Grid>
  );
};

UploadedDocumentElement.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  })
};

UploadedDocumentElement.defaultProps = {
  input: {
    onChange: () => { },
    value: ''
  }
};

export default UploadedDocumentElement;
