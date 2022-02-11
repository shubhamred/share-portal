import React from 'react';
import { Grid, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';
import { viewImage } from 'app/containers/patrons/saga';
import DialogComponent from '../dialogComponent/dialogComponent';
import styles from '../../containers/deals/components/DocumentsTab/styles.scss';

const Document = (props) => {
  const { name, id, onDeleteClick, onlyDownload = false, icon, signedCopy } = props;
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <Grid container={true} alignItems="center">
      <Grid item={true} xs={10} onClick={() => viewImage(id, true, signedCopy)} title={name}>
        <div className={styles.fileContainer}>
          {!onlyDownload
          && (
            <>
              <img
                src={icon || '/assets/file.svg'}
                alt="Document"
                className={styles.fileImage}
              />
              <p className={styles.fileName}>{name}</p>
            </>
          )}
          <IconButton
            aria-label="Download"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              viewImage(id, true, signedCopy);
            }}
          >
            <img src="/assets/downloadIcon.svg" alt="Download" height={17} />
          </IconButton>
        </div>
      </Grid>
      {openDialog && (
        <DialogComponent
          onClose={() => setOpenDialog(false)}
          title=""
          closeButton={false}
        >
          <Grid container="true" className={styles.messageContainer}>
            <Grid item={true} md={12} className={styles.message}>
              Are you sure you want to delete the file?
            </Grid>
            <Grid item={true} md={12}>
              <Grid
                container={true}
                justify="flex-end"
              >
                <Grid item={true}>
                  <Button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                  >
                    No
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenDialog(false);
                      onDeleteClick(id);
                    }}
                  >
                    Yes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
      {onDeleteClick && (
        <Grid item={true}>
          <Tooltip title="Delete">
            <IconButton
              aria-label="Delete"
              size="small"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default React.memo(Document);
