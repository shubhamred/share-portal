import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';
import MomentUtils from '@material-ui/pickers/adapter/moment';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@material-ui/pickers';
import styles from './styles.scss';

const CustomDatePicker = (props) => {
  // eslint-disable-next-line max-len
  const { input, label, placeholder, onDateSelect, disabled, minDate, maxDate, isMonthFilter, disableFuture, meta: { initial }, initialValue, lableStyle = {}, meta } = props;
  const date = input && input.value ? input.value : initial || initialValue;
  // eslint-disable-next-line no-unused-expressions
  // input && input.onChange(date);
  const { error, submitFailed } = meta;
  return (
    <Grid className={styles.container} item={true} justify="space-between" direction="row" container={true}>
      {label
                && (
                <Grid className={styles.label} item={true} xs={12} sm={12} style={lableStyle}>
                  {label}
                </Grid>
                )}
      <Grid item={true} xs={12} sm={12} className={disabled ? `${styles.disabled} ${styles.removeHelper}` : styles.dateWrapper}>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <DatePicker
            inputFormat={isMonthFilter ? 'MM/YYYY' : 'DD/MM/YYYY'}
            value={date ? moment(date, 'DD-MM-YYYY') : null}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(dateProps) => <TextField {...dateProps} />}
            label={!label && placeholder}
            onChange={(selectedDate) => {
              if (selectedDate) {
                if (input) input.onChange(selectedDate.format('DD/MM/YYYY'));
                onDateSelect(selectedDate.format('DD/MM/YYYY'), selectedDate);
              }
            }}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            autoOk={true}
            clearable={true}
            disableFuture={disableFuture}
            views={isMonthFilter ? ['year', 'month'] : ['year', 'month', 'date']}
          />
        </LocalizationProvider>
      </Grid>
      {meta && error && submitFailed && (
        <Grid className={styles.warning} item={true} xs={12}>
          {error}
        </Grid>
      )}
    </Grid>
  );
};

CustomDatePicker.propTypes = {
  placeholder: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  label: PropTypes.string,
  onDateSelect: PropTypes.func,
  disabled: PropTypes.bool,
  minDate: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  disableFuture: PropTypes.bool,
  initialValue: PropTypes.string
};

CustomDatePicker.defaultProps = {
  placeholder: '',
  input: {
    onChange: () => { },
    value: ''
  },
  label: '',
  onDateSelect: () => { },
  disabled: false,
  minDate: null,
  meta: {},
  disableFuture: false,
  initialValue: ''
};

export default CustomDatePicker;
