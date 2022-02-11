import React from 'react';
import 'react-phone-number-input/style.css';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';

import styles from './styles.scss';

const PhoneInputComponent = (props) => {
  const { input, meta, country, label, propValue, disabled, handlePhoneNumberChange, inputRef } = props;
  const { error, submitFailed } = meta;
  return (
    <Grid className={styles.wrapper} container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12}>
            {label}
          </Grid>
        )}
      <Grid item={true} xs={12} sm={12}>
        <Grid className={styles.inputWrapper} item={true} xs={12}>
          <PhoneInput
            international={true}
            type="phone"
            className={disabled ? styles.disabled : styles.input}
            country={country}
            value={propValue}
            ref={inputRef}
            onChange={(phoneValue) => {
              if (phoneValue) {
                input.onChange(phoneValue);
                handlePhoneNumberChange(phoneValue);
              } else {
                input.onChange('');
                handlePhoneNumberChange('');
              }
            }}
            disabled={disabled}
          />
        </Grid>
        {((error && submitFailed))
          && (
            <Grid className={styles.warning} item={true} xs={12}>
              {error}
            </Grid>
          )}
      </Grid>
    </Grid>
  );
};

PhoneInputComponent.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  country: PropTypes.string,
  propValue: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),

  handlePhoneNumberChange: PropTypes.func
};

PhoneInputComponent.defaultProps = {
  disabled: false,
  label: '',
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => { },
    value: ''
  },
  country: 'IN',
  propValue: null,
  handlePhoneNumberChange: () => {}
};

export default PhoneInputComponent;
