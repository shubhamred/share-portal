import React, { useState } from 'react';
import {
  Grid,
  IconButton,
  DialogContent,
  Dialog
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styles from './styles.scss';
import Button from '../../../components/button/button';

const FileList = (props) => {
  const [fileItem, setFileItem] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { uploadedDocs, viewImage, removeFile, resourceType, bankIdString, resourceId } = props;
  const [open, setOpen] = useState(false);

  const handleDialogClose = (id, resourceIdParam, resourceTypeParam, bankIdStringParam) => {
    removeFile(id, resourceIdParam, resourceTypeParam, bankIdStringParam);
    setDialogOpen(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <Grid container={true} direction="row" justify="space-between">
        <Grid item={true} className={styles.wrapper}>
          Files
          <IconButton onClick={() => setOpen(!open)}>
            {/* <img */}
            {/*  src="assets/down.svg" */}
            {/*  alt="alt" */}
            {/*  width={10} */}
            {/*  height={6} */}
            {/* /> */}
            {
              open ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }

          </IconButton>
        </Grid>
      </Grid>
      <Grid container={true}>
        <Grid className={styles.dropDownWrapper}>
          {open && uploadedDocs.map((doc) => (
            <Grid key={doc.id} container={true} direction="row" item={true} className={styles.fileContainer} justify="space-between">
              <Grid item={true}>{doc.fileName}</Grid>
              <Grid item={true}>
                <IconButton onClick={() => viewImage(doc.id)}>
                  <img
                    src="assets/view.svg"
                    alt="alt"
                    width={25}
                    height={16}
                    className={styles.viewIcon}
                  />
                </IconButton>
                <IconButton onClick={() => {
                  setDialogOpen(true);
                  setFileItem(doc);
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
              {dialogOpen && (
                <Dialog open={true} onClose={() => setDialogOpen(false)}>
                  <DialogContent>
                    {`Are you sure you want to delete this file - ${fileItem.fileName}?`}
                    <Grid style={{ paddingTop: '15px' }} container={true} justify="space-around">
                      <Grid className={styles.cancelButtonStyle} item={true}>
                        <Button type="button" label="Cancel" onClick={() => setDialogOpen(false)} />
                      </Grid>
                      <Grid className={styles.deleteButtonStyle} item={true}>
                        <Button type="button" label="Delete" onClick={() => handleDialogClose(fileItem.id, resourceId, resourceType, bankIdString)} />
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              )}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

FileList.propTypes = {
};

FileList.defaultProps = {
};

export default FileList;
