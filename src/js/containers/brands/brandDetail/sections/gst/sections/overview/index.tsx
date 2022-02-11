/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import { Button, Grid } from '@material-ui/core';
import { DialogComponent } from 'app/components';
import AddIcon from '@material-ui/icons/Add';
import { Context } from 'app/utils/utils';
import AddGSTForm from '../addGst';
import EditGSTForm from '../editGst';
import { isVerified } from '../data';
import styles from '../../../../styles.scss';
import { getStateName } from '../addGst/gstStatesList';
import { GSTContextTS } from '../../gst.model';

type ModalCloseTS = (arg?: boolean) => void;
type EditModalTS = (arg?: any) => void;

const GstOverview: React.FC = () => {
  const { gstList, company, getGstData, tabHandler } = React.useContext<GSTContextTS>(Context);

  const [dialogueOpen, toggleDialogue] = React.useState<boolean>(false);
  const [editDialogueOpen, toggleEditDialogue] = React.useState<boolean>(false);
  const [GSTIN, setGSTIN] = React.useState(false);

  const handleModalClose: ModalCloseTS = (val) => {
    toggleDialogue(false);
    toggleEditDialogue(false);
    if (val && getGstData) {
      getGstData();
    }
  };

  const handleEditModal: EditModalTS = (gst) => {
    if (gst) {
      toggleEditDialogue(true);
      setGSTIN(gst);
    }
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} container={true} justify="flex-end">
        <Button
          variant="text"
          color="primary"
          className={styles.fontWeight600}
          startIcon={<AddIcon />}
          onClick={() => toggleDialogue(true)}
        >
          Add GST
        </Button>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true} className={styles.gstContainer}>
          {gstList && gstList?.length ? (
            gstList.map((item, index) => (
              <Grid
                item={true}
                xs={12}
                key={item.gstin}
                container={true}
                className={styles.rowContainer}
                alignItems="flex-end"
                justify="space-between"
              >
                <Grid item={true} xs={4}>
                  <Grid item={true} className={styles.lable}>
                    State
                  </Grid>
                  <Grid item={true} className={styles.textLable}>
                    {getStateName(item.stateCode)}
                  </Grid>
                </Grid>
                <Grid item={true} xs={4}>
                  <Grid item={true} className={styles.lable}>
                    GSTIN
                  </Grid>
                  <Grid
                    item={true}
                    container={true}
                    className={styles.textLable}
                  >
                    {item.gstin}
                    {isVerified(item?.status || '') ? (
                      <img
                        className={styles.editIcon}
                        src="assets/ApprovedIcon.svg"
                        alt="verified"
                      />
                    ) : (
                      <img
                        className={styles.iconButton}
                        onClick={() => handleEditModal(item)}
                        src="assets/gst_edit.svg"
                        alt="gst_edit"
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid
                  item={true}
                  container={true}
                  xs={2}
                  className={styles.linkText}
                  alignItems="center"
                  justify="flex-end"
                  onClick={() => {
                    if (tabHandler) tabHandler(index + 2);
                  }}
                >
                  View details
                  <img
                    className={styles.iconButton}
                    src="assets/gst_arrow.svg"
                    alt="alt"
                  />
                </Grid>
              </Grid>
            ))
          ) : (
            <p>No GST accounts found</p>
          )}
        </Grid>
      </Grid>
      {dialogueOpen && (
        <DialogComponent
          title="Add GST"
          onClose={() => handleModalClose(false)}
          closeButton={false}
        >
          <AddGSTForm
            onClose={handleModalClose}
            resourceCode={company?.companyCode}
          />
        </DialogComponent>
      )}
      {editDialogueOpen && (
        <DialogComponent
          title="Update GSTIN"
          onClose={() => toggleEditDialogue(false)}
          closeButton={false}
        >
          <EditGSTForm onClose={handleModalClose} GSTIN={GSTIN} />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default GstOverview;
