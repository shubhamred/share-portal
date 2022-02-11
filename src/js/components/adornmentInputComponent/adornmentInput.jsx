import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { Grid, InputAdornment } from '@material-ui/core';
import HideButton from '../hideButton/hideButton';
import CloseButton from '../closeButton/closeButton';
import styles from './styles.scss';

const AdornmentInput = (props) => {
  const { label, meta, input, hideButton, visible, onHideBtnClick, placeholder,
    closeButton, onCloseButtonClick, disabled } = props;
  const { onChange, value } = input;
  const { error, submitFailed } = meta || {};
  return (
    <Grid className={styles.container} item={true} justify="space-between" direction="row" container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} justify="space-between">
            {label}
            <div className={styles.buttons}>
              {hideButton && <HideButton visible={visible} onHideBtnClick={onHideBtnClick} />}
              {closeButton && <CloseButton onCloseButtonClick={onCloseButtonClick} />}
            </div>
          </Grid>
        )}
      <Grid item={true} xs={12} sm={12}>
        <Grid className={styles.inputWrapper} item={true} xs={12} sm={12}>
          <Input
            type="number"
            placeholder={placeholder}
            value={value}
            className={disabled ? styles.disabled : styles.input}
            disabled={disabled}
            onChange={(event) => {
              onChange(event.target.value && event.target.value !== '' && Number(event.target.value));
              // onValueChange(event.target.value);
            }}
            disableUnderline={true}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            inputProps={{ min: '0', max: '100', step: '.1' }}
          />
        </Grid>
        {((meta && error && submitFailed))
          && (
            <Grid className={styles.warning} item={true} xs={12}>
              {error}
            </Grid>
          )}
      </Grid>
    </Grid>
  );
};

AdornmentInput.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  closeButton: PropTypes.bool,
  hideButton: PropTypes.bool,
  visible: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  onHideBtnClick: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  })
};

AdornmentInput.defaultProps = {
  closeButton: false,
  disabled: false,
  label: '',
  placeholder: '',
  visible: false,
  hideButton: false,
  onCloseButtonClick: () => { },
  onHideBtnClick: () => { },
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => { },
    value: ''
  }
};

export default AdornmentInput;
