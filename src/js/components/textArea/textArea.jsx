/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import CloseButton from '../closeButton/closeButton';
import HideButton from '../hideButton/hideButton';
import styles from './styles.scss';

const TextArea = (props) => {
  const {
    label,
    meta,
    input,
    visible,
    onHideBtnClick,
    hideButton,
    placeholder,
    closeButton,
    onCloseButtonClick,
    disabled,
    maxLength,
    minLength,
    isRequiredField
  } = props;
  const { onChange, value } = input;
  const { error, submitFailed, invalid } = meta;
  const handleTextChange = (textValue) => {
    onChange(textValue);
  };
  return (
    <Grid
      className={styles.container}
      item={true}
      justifyContent="space-between"
      direction="row"
      container={true}
    >
      {label && (
        <Grid className={styles.label} item={true} xs={12} sm={12}>
          {label}
          {' '}
          {isRequiredField ? (
            <span className={styles.requiredStar}>*</span>
          ) : null}
          <div className={styles.buttons}>
            {hideButton && (
              <HideButton visible={visible} onHideBtnClick={onHideBtnClick} />
            )}
            {closeButton && (
              <CloseButton onCloseButtonClick={onCloseButtonClick} />
            )}
          </div>
        </Grid>
      )}
      <Grid item={true} xs={12} sm={12}>
        <Grid className={styles.inputWrapper} item={true} xs={12} sm={12}>
          <TextField
            error={meta.dirty && invalid}
            helperText={!submitFailed && meta.dirty && invalid ? error : null}
            multiline={true}
            placeholder={placeholder}
            maxRows="4"
            value={value}
            disabled={disabled}
            className={disabled ? styles.disabled : styles.input}
            onChange={(event) => {
              handleTextChange(event.target.value);
            }}
            inputProps={{
              maxLength,
              minLength
            }}
            // InputProps={{ disableUnderline: true }}
          />
        </Grid>
        <Grid className={styles.floatRight}>
          {minLength && minLength > 1 ? (
            <small className={styles.minLength}>
              Minimum Characters:
              {minLength}
            </small>
          ) : null}
          {(value && value.length) || 0}
          {' '}
          {maxLength ? (
            <>
              /
              {maxLength}
            </>) : null}
        </Grid>
        {meta && error && submitFailed && (
          <Grid className={styles.warning} item={true} xs={12}>
            {error}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  hideButton: PropTypes.bool,
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
  onHideBtnClick: PropTypes.func,
  closeButton: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  maxLength: PropTypes.number,
  minLength: PropTypes.number
};

TextArea.defaultProps = {
  placeholder: '',
  label: '',
  visible: false,
  hideButton: false,
  closeButton: false,
  disabled: false,
  onCloseButtonClick: () => {},
  onHideBtnClick: () => {},
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => {},
    value: ''
  },
  maxLength: null,
  minLength: 0
};

export default TextArea;
