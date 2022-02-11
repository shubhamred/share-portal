import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import { DropDown, Input, Button } from 'app/components';
import styles from './styles.scss';

const FormDialog = (props) => {
  const { handleSubmit, handleClose, statusList } = props;
  const [selectedStatus, setSelectedStatus] = useState(statusList[0]);
  return (
    <div>
      <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update status</DialogTitle>
        <DialogContent>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <Field
                name="status"
                options={statusList}
                selectedOption={selectedStatus}
                component={DropDown}
                label="Status"
                handleSelectedOption={(value) => {
                  setSelectedStatus(value);
                }}
              />
            </Grid>
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <Field
                name="remarks"
                component={Input}
                inputType="text"
                autoFocus={true}
                label="Remarks"
                isFieldValue={true}
              />
            </Grid>
            <Grid container={true} xs={12} justify="space-around">
              <Grid className={styles.cancelButtonStyle} item={true}>
                <Button type="button" label="Cancel" onClick={handleClose} />
              </Grid>
              <Grid className={styles.updateButtonStyle} item={true}>
                <Button type="submit" label="Update" />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

FormDialog.propTypes = {
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func
};

FormDialog.defaultProps = {
  handleClose: () => { },
  handleSubmit: () => { }

};

export default FormDialog;
