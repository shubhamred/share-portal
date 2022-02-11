/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import HideButton from '../hideButton/hideButton';
import CloseButton from '../closeButton/closeButton';
import styles from './styles.scss';

const NumberField = (props) => {
  const {
    row,
    label,
    input,
    meta,
    autoFocus,
    isFieldValue,
    onValueChange,
    name,
    step,
    selected,
    propValue,
    maxLength,
    visible,
    onHideBtnClick,
    hideButton,
    placeholder,
    closeButton,
    onCloseButtonClick,
    disabled,
    isRequiredField
  } = props;
  const { error, submitFailed } = meta || {};
  const { onChange } = input;

  let currentSelected = selected && input && input.value === '' && selected;
  if (input && input.value !== '') {
    currentSelected = input.value;
  }
  // if (currentSelected && onChange) {
  //   onChange(currentSelected);
  // }

  return (
    <Grid
      className={styles.container}
      item={true}
      justifyContent="space-between"
      direction="row"
      container={true}
    >
      {label && (
        <Grid
          className={styles.label}
          item={true}
          xs={12}
          sm={row ? 6 : 12}
        >
          <span>
            {label}
            {' '}
            {isRequiredField ? (
              <span className={styles.requiredStar}>*</span>
            ) : null}
          </span>
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
      <Grid item={true} xs={12} sm={row ? 6 : 12}>
        <Grid className={styles.inputWrapper} item={true} xs={12} sm={12}>
          <input
            name={name}
            autoFocus={autoFocus}
            step={step}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            className={disabled ? styles.disabled : styles.input}
            type="number"
            value={
              currentSelected !== undefined && currentSelected !== ''
                ? currentSelected
                : propValue
            }
            maxLength={maxLength}
            onChange={(event) => {
              if (isFieldValue) {
                const updatedValue = event.target.value !== undefined
                  && event.target.value !== ''
                  && Number(event.target.value);
                onChange(updatedValue);
              } else onValueChange(event.target.value);
            }}
          />
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

NumberField.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  hideButton: PropTypes.bool,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  row: PropTypes.bool,
  isFieldValue: PropTypes.bool,
  name: PropTypes.string,
  closeButton: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  onValueChange: PropTypes.func,
  onHideBtnClick: PropTypes.func,
  step: PropTypes.number,
  selected: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  propValue: PropTypes.string,
  autoFocus: PropTypes.bool
};

NumberField.defaultProps = {
  placeholder: '',
  disabled: false,
  visible: false,
  hideButton: false,
  label: '',
  row: false,
  isFieldValue: true,
  name: '',
  maxLength: 1000,
  selected: '',
  step: 1,
  closeButton: false,
  onCloseButtonClick: () => {},
  onValueChange: () => {},
  onHideBtnClick: () => {},
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => {},
    value: ''
  },
  propValue: '',
  autoFocus: false
};

export default NumberField;
