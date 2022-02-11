import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Grid } from '@material-ui/core';
import { Button, Input, Switch } from 'app/components';
import styles from './styles.scss';

const AddPartnersAccounts = (props) => {
  const { onSubmit, onClose, editData } = props;
  const [selectedStatus, setSelectedStatus] = useState(editData?.innerIsActive || false);
  const [split, setSplit] = useState(editData?.split || '');

  const handleFormSubmit = () => {
    if (split) {
      onSubmit({
        split: +split,
        isActive: selectedStatus ? 1 : 0,
        dealCode: editData?.dealCode
      });
    }
  };

  return (
    <Grid className={styles.inviteForm} container={true}>
      <form className={styles.form}>
        <Grid className={styles.formLabelStyle} container={true} justify="space-between">
          <Grid className={styles.childDivWidth} item={true} xs={12}>
            <Input
              isFieldValue={false}
              inputType="number"
              propValue={split}
              onValueChange={(inputValue) => {
                setSplit(inputValue);
              }}
              label="Split %"
            />
          </Grid>
        </Grid>
        <Grid className={styles.formLabelStyle} container={true} justify="space-between">
          <div className={styles.label}>Status</div>
          <FormControlLabel
            control={
              <Switch
                checked={selectedStatus}
                onChange={({ target }) => {
                  setSelectedStatus(target.checked);
                }}
              />
            }
          />
        </Grid>
        <Grid container={true} className={styles.buttonStyle} alignItems="center">
          <Grid onClick={onClose} className={styles.cancelButtonDiv}>
            <Grid className={styles.cancelButtonStyle}>Cancel</Grid>
          </Grid>
          <Button
            type="button"
            onClick={handleFormSubmit}
            label="Save"
          />
        </Grid>
      </form>
    </Grid>
  );
};

AddPartnersAccounts.propTypes = {
  onSubmit: PropTypes.func
};

AddPartnersAccounts.defaultProps = {
  onSubmit: () => {}
};

export default AddPartnersAccounts;
