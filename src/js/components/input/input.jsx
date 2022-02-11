/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Grid, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HideButton from '../hideButton/hideButton';
import CloseButton from '../closeButton/closeButton';
import styles from './styles.scss';

const useStyles = makeStyles({
  underline: {
    '&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  }
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: Number(values.value)
          }
        });
      }}
      thousandsGroupStyle="lakh"
      thousandSeparator={true}
      isNumericString={true}
      prefix="₹"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const Input = (props) => {
  const classes = useStyles();
  const {
    row,
    label,
    input,
    meta,
    autoFocus,
    isFieldValue,
    inputType,
    onValueChange,
    name,
    min,
    max,
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
    clearButton,
    onClearButtonClick,
    searchButton,
    underLineDisable,
    isRequiredField,
    customClass,
    isAmountFormat
  } = props;
  const { error, submitFailed, invalid } = meta;
  const { onChange, value } = input;

  // let currentSelected = selected && input && (value === '' && selected);
  // if (input && value !== '') {
  //   currentSelected = value;
  // }
  //
  // useEffect(() => {
  //   currentSelected = propValue;
  // }, []);
  // useEffect(() => {
  //   onChange && onChange(currentSelected);
  // }, [currentSelected]);

  // onChange && onChange(currentSelected);
  let InputPropsValue = {};
  if (underLineDisable) {
    InputPropsValue = { ...InputPropsValue, ...classes };
  }
  if (isAmountFormat) {
    InputPropsValue = { ...InputPropsValue, inputComponent: NumberFormatCustom };
  }
  return (
    <Grid
      className={styles.container}
      item={true}
      justifyContent="space-between"
      direction="row"
      container={true}
    >
      {label && (
        <Grid className={styles.label} item={true} xs={12} sm={row ? 6 : 12}>
          {label}
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
      <Grid item={true} xs={12} sm={row ? 6 : 12}>
        <Grid className={styles.inputWrapper} item={true} xs={12} sm={12}>
          <TextField
            // defaultValue={selected || value || propValue}
            error={meta.dirty && invalid}
            helperText={!submitFailed && meta.dirty && invalid ? error : null}
            disabled={disabled}
            name={name}
            min={min}
            autoFocus={autoFocus}
            step={step}
            max={max}
            placeholder={placeholder}
            InputProps={InputPropsValue}
            className={`${disabled ? styles.disabled : styles.input} ${
              clearButton && styles.clearButtonPadding
            } ${searchButton && styles.searchButtonPadding} ${customClass}`}
            type={inputType}
            value={selected || value || propValue}
            maxLength={maxLength}
            onChange={(event) => {
              if (isFieldValue) {
                onChange(event.target.value);
              } else onValueChange(event.target.value);
            }}
          />
          {clearButton && (
            <Grid className={styles.clearButton}>
              <IconButton
                style={{
                  padding: 0,
                  backgroundColor: 'transparent'
                }}
                onClick={onClearButtonClick}
              >
                <img
                  src="/assets/clear.svg"
                  alt="clear search"
                  width={30}
                  height={30}
                />
              </IconButton>
            </Grid>
          )}
          {searchButton && (
            <Grid className={styles.searchButton}>
              <IconButton
                style={{
                  padding: 0,
                  backgroundColor: 'transparent'
                }}
              >
                <img
                  src="/assets/search.svg"
                  alt="clear search"
                  width={20}
                  height={16}
                />
              </IconButton>
            </Grid>
          )}
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

Input.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  hideButton: PropTypes.bool,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  inputType: PropTypes.string,
  row: PropTypes.bool,
  isFieldValue: PropTypes.bool,
  name: PropTypes.string,
  closeButton: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  onValueChange: PropTypes.func,
  onHideBtnClick: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
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
  autoFocus: PropTypes.bool,
  clearButton: PropTypes.bool,
  searchButton: PropTypes.bool,
  underLineDisable: PropTypes.bool,
  onClearButtonClick: PropTypes.func,
  isAmountFormat: PropTypes.bool
};

Input.defaultProps = {
  placeholder: '',
  disabled: false,
  visible: false,
  hideButton: false,
  label: '',
  row: false,
  inputType: 'text',
  isFieldValue: true,
  name: '',
  min: 0,
  maxLength: 1000,
  selected: '',
  max: 10000000000000000,
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
  autoFocus: false,
  clearButton: false,
  searchButton: false,
  underLineDisable: true,
  onClearButtonClick: () => {},
  isAmountFormat: false
};

export default Input;
