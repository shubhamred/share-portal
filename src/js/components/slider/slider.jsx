/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';

import { Grid } from '@material-ui/core';
import styles from './styles.scss';

const ValueLabelComponent = (props) => {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <div>
      <Tooltip
        PopperProps={{
          popperRef
        }}
        open={open}
        enterTouchDelay={0}
        placement="top"
        title={value}
      >
        {children}
      </Tooltip>
    </div>
  );
};

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired
};

const SliderComponent = (props) => {
  const { label, input, meta, minValue, maxValue, step, marks, defaultValue, disabled } = props;
  const { value, onChange } = input;
  const { error, submitFailed } = meta;
  if (value !== '') {
    onChange(value);
  } else onChange(defaultValue);
  return (
    <Grid className={styles.wrapper} container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12} justifyContent="space-between">
            {label}
          </Grid>
        )}
      <Grid item={true} xs={12}>
        <Grid
          className={styles.inputWrapper}
          alignItems="center"
          justifyContent="center"
          item={true}
          xs={12}
          container={true}
        >
          <Slider
            classes={{
              root: styles.sliderRoot,
              disabled: styles.disabled
            }}
            color="secondary"
            onChange={(event, inputValue) => onChange(inputValue)}
            ValueLabelComponent={ValueLabelComponent}
            value={Number(value)}
            aria-label="custom thumb label"
            defaultValue={defaultValue}
            min={minValue}
            max={maxValue}
            step={step}
            marks={marks}
            disabled={disabled}
          />
        </Grid>
        {error && submitFailed
          && (
            <Grid className={styles.warning} item={true} xs={12}>
              {error}
            </Grid>
          )}
      </Grid>
    </Grid>
  );
};

SliderComponent.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  marks: PropTypes.arrayOf(PropTypes.any).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  defaultValue: PropTypes.number
};

SliderComponent.defaultProps = {
  disabled: false,
  label: '',
  minValue: null,
  maxValue: null,
  step: 1,
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => {},
    value: ''
  },
  defaultValue: 0
};

export default SliderComponent;
