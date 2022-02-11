import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel, Grid } from '@material-ui/core';
import HideButton from '../hideButton/hideButton';

import styles from './styles.scss';

const CustomCheckBox = withStyles({
  root: {
    // color: '#464646',
    '&$checked': {
      color: '#164363'
    }
  },
  disabled: {
    '&$checked': {
      color: '#bdbdbd'
    }
  },
  checked: {}
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox color="default" {...props} />);

const CheckboxComponent = (props) => {
  const { row, values, label, input, handleCheckBoxValue, meta, hideButton, visible, onHideBtnClick, disabled } = props;
  const { error, submitFailed } = meta;
  const { value, onChange } = input;
  return (
    <Grid className={styles.container} direction="row" container={true}>
      {(label || label === '')
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12}>
            {label}
            {hideButton && <HideButton visible={visible} onHideBtnClick={onHideBtnClick} />}
          </Grid>
        )}
      <Grid className={styles.inputWrapper} item={true} xs={12} sm={12}>
        <FormGroup row={row}>
          {values && values.map((checkValue) => <FormControlLabel
            classes={{
              root: styles.formLabelRoot,
              disabled: styles.disabled
            }}
            key={checkValue.label}
            disabled={disabled}
            label={checkValue.label}
            control={<CustomCheckBox
              checked={value ? value.includes(checkValue.name) : false}
              label={checkValue.label}
              onChange={(event) => {
                const newValue = value ? [...value] : [];
                if (event.target.checked) {
                  newValue.push(checkValue.name);
                } else {
                  newValue.splice(newValue.indexOf(checkValue.name), 1);
                }
                handleCheckBoxValue(newValue);
                return input && onChange(newValue);
              }}
              value={checkValue.name}
              inputProps={{
                'aria-label': 'primary checkbox'
              }}
            />}
          />)}
          {error && submitFailed
            && (
              <Grid className={styles.warning} item={true} xs={12}>
                {error}
              </Grid>
            )}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

CheckboxComponent.propTypes = {
  row: PropTypes.bool,
  disabled: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.shape({})),
  label: PropTypes.string,
  hideButton: PropTypes.bool,
  visible: PropTypes.bool,
  onHideBtnClick: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.string)
  }),
  handleCheckBoxValue: PropTypes.func
};

CheckboxComponent.defaultProps = {
  row: true,
  disabled: false,
  values: [],
  visible: false,
  hideButton: false,
  onHideBtnClick: () => { },
  label: '',
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => { },
    value: []
  },
  handleCheckBoxValue: () => { }
};

export default CheckboxComponent;
