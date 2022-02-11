import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import { DropDown, Button, Input } from 'app/components';
import styles from './styles.scss';

const FormDialog = (props) => {
  const { handleSubmit, handleClose, currentStatus, handleUpdateStatus, pristine } = props;
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const statusList = ['Active', 'Blocked'];
  if (currentStatus === 'Created') {
    statusList.unshift('Created');
  }
  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update status</DialogTitle>
        <DialogContent>
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleUpdateStatus)}
          >
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <Field
                isOtherFieldRequired={false}
                name="status"
                options={statusList}
                selectedOption={selectedStatus}
                component={DropDown}
                placeholder={currentStatus === 'Created' ? null : 'Created'}
                label="Status"
                handleSelectedOption={(value) => {
                  setSelectedStatus(value);
                }}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <Field
                name="remarks"
                isFieldValue={true}
                component={Input}
                inputType="text"
                label="Remarks"
              />
            </Grid>
            <Grid container={true} xs={12} justify="space-around">
              <Grid className={styles.cancelButtonStyle} item={true}>
                <Button type="button" label="Cancel" onClick={handleClose} />
              </Grid>
              <Grid className={styles.updateButtonStyle} item={true}>
                <Button type="submit" label="Update" disabled={pristine} />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

FormDialog.propTypes = {
  pristine: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  currentStatus: PropTypes.string,
  handleUpdateStatus: PropTypes.func
};

FormDialog.defaultProps = {
  pristine: false,
  handleClose: () => { },
  handleSubmit: () => { },
  currentStatus: 'Lead',
  handleUpdateStatus: () => { }
};

export default FormDialog;
