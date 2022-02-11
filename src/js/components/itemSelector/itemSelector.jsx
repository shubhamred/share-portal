/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Select, MenuItem, FormControl,
  InputBase,
  Grid
} from '@material-ui/core';
import styles from './styles.scss';

const ItemSelector = (props) => {
  const { placeholder, label, options, selectedOption, handleSelectedOption, disabled } = props;
  return (
    <Grid className={styles.wrapper} direction="row" container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12}>
            {label}
          </Grid>
        )}
      <Grid item={true} xs={12} sm={12}>
        <Grid className={styles.component} item={true} xs={12}>
          <FormControl classes={{ root: disabled ? styles.disabled : styles.formControlRoot }} className={styles.margin}>
            <Select
              disabled={disabled}
              classes={{ select: styles.selectFocus }}
              displayEmpty={!!placeholder}
              value={selectedOption}
              input={<InputBase classes={{ root: styles.inputRoot, focused: styles.focusedSelect }} />}
              onChange={(event) => {
                handleSelectedOption(event.target.value);
              }}
            >
              {placeholder && (
                <MenuItem
                  className={styles.MenuDivider}
                  styles={{ root: styles.MenuItem, selected: styles.MenuSelected }}
                  value=""
                  disabled={true}
                >
                  {placeholder}
                </MenuItem>
              )}
              {[...options].map((item, index) => (
                <MenuItem
                  className={index !== ((options.length) - 1) ? styles.MenuDivider : styles.MenuItemValue}
                  styles={{ root: styles.MenuItem, selected: styles.MenuSelected }}
                  key={`${index.toString()}a`}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

ItemSelector.propTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.string,
  handleSelectedOption: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  })
};

ItemSelector.defaultProps = {
  disabled: false,
  placeholder: '',
  label: '',
  options: [],
  selectedOption: null,
  meta: {
    error: '',
    submitFailed: false
  },
  input: {
    onChange: () => { },
    value: ''
  },
  handleSelectedOption: () => { }
};

export default ItemSelector;
