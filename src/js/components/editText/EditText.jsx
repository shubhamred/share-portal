import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { IconButton, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const EditTextComponent = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { value, textStyles, onSave } = props;
  const [isEditable, toggleEditable] = useState(false);
  const [textValue, setTextValue] = useState(value);
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleSave = () => {
    toggleEditable(false);
    onSave(textValue);
  };

  const handleCancel = () => {
    toggleEditable(false);
    setTextValue(value);
  };

  return (
    <Grid container={true} className={styles.container}>
      <Grid item={true} xs={12}>
        {
          isEditable ? (
            <Grid container={true} alignItems="center">
              <Grid item={true} style={{ marginRight: '15px' }}>
                <TextField
                  // defaultValue={value}
                  value={textValue}
                  // onChange={(event) => setTextValue(event.target.value)}
                  onChange={(event) => onSave(event.target.value)}
                />
              </Grid>
              <Grid item={true} style={{ display: 'none' }}>
                <IconButton className="saveBtn" size="small" onClick={handleSave} disabled={!textValue.trim().length}>
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton className="cancelBtn" size="small" onClick={handleCancel}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          )
            : (
              <Grid container={true} alignItems="center">
                <Grid item={true} style={{ marginRight: '15px' }}>
                  <span className={`${styles.label}`}>{value}</span>
                </Grid>
                <Grid item={true}>
                  <IconButton size="small" onClick={() => toggleEditable(true)} className={styles.editBtn}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            )
        }
      </Grid>
    </Grid>
  );
};

EditTextComponent.propTypes = {
  value: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  textStyles: PropTypes.object,
  onSave: PropTypes.func
};

EditTextComponent.defaultProps = {
  value: '',
  textStyles: {},
  onSave: () => {}
};

export default EditTextComponent;
