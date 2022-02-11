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

import _ from 'lodash';

import styles from './styles.scss';
import Input from '../input/input';
import HideButton from '../hideButton/hideButton';
import CloseButton from '../closeButton/closeButton';

const DropDown = (props) => {
  const { placeholder, label, options, input, selectedOption, handleSelectedOption, meta, hideButton, visible,
    onHideBtnClick, closeButton, onCloseButtonClick, disabled, isOtherFieldRequired, required, isRequiredField } = props;
  const { value, onChange, name } = input;
  const { error, submitFailed } = meta;
  let dropDownValue = selectedOption || value;

  const valueInOptions = options && (_.some(options, ['key', value]) || options.includes(value));
  if (input && value === '' && selectedOption) {
    onChange(selectedOption);
    dropDownValue = selectedOption;
  } else if (value !== 'Other' && valueInOptions) {
    dropDownValue = value;
  } else if (value !== '' && !valueInOptions) {
    dropDownValue = 'Other';
  }
  return (
    <Grid className={styles.wrapper} direction="row" container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12}>
            {label}
            {isRequiredField || required ? (
              <span className={styles.requiredStar}>*</span>
            ) : null}
            <div className={styles.buttons}>
              {hideButton && <HideButton visible={visible} onHideBtnClick={onHideBtnClick} />}
              {closeButton && <CloseButton onCloseButtonClick={onCloseButtonClick} />}
            </div>
          </Grid>
        )}
      <Grid item={true} xs={12} sm={12}>
        <Grid className={styles.component} item={true} xs={12}>
          <FormControl classes={{ root: disabled ? styles.disabled : styles.formControlRoot }} className={styles.margin}>
            <Select
              classes={{ select: styles.selectFocus }}
              value={dropDownValue}
              displayEmpty={placeholder}
              input={<InputBase
                classes={{ root: styles.inputRoot, focused: styles.focusedSelect }}
              />}
              inputProps={{
                name
              }}
              onChange={(event) => {
                onChange(event.target.value);
                handleSelectedOption(event.target.value);
              }}
              disabled={disabled}
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
              {[...options].map((option, index) => (
                <MenuItem
                  className={index !== ((options.length) - 1) ? styles.MenuDivider : styles.MenuItemValue}
                  styles={{ root: styles.MenuItem, selected: styles.MenuSelected }}
                  key={`select-${name}-${option.key || `${option.toString().replace(/\s+/g, '-')}`}`}
                  value={option.key || option}
                >
                  { option.value || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {((selectedOption === 'Other' && dropDownValue === 'Other') || dropDownValue === 'Other') && isOtherFieldRequired && (
          <Grid item={true} xs={12} sm={12} className={styles.inputOther}>
            <Input
              propValue={value !== 'Other' ? value : ''}
              isFieldValue={false}
              disabled={disabled}
              inputType="text"
              onValueChange={(inputValue) => { onChange(inputValue); }}
            />
          </Grid>
        )}
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

DropDown.propTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.string,
  hideButton: PropTypes.bool,
  visible: PropTypes.bool,
  closeButton: PropTypes.bool,
  onCloseButtonClick: PropTypes.func,
  onHideBtnClick: PropTypes.func,
  handleSelectedOption: PropTypes.func,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  }),
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  isOtherFieldRequired: PropTypes.bool,
  required: PropTypes.bool
};

DropDown.defaultProps = {
  disabled: false,
  placeholder: '',
  label: '',
  options: [],
  selectedOption: null,
  meta: {
    error: '',
    submitFailed: false
  },
  visible: false,
  hideButton: false,
  closeButton: false,
  onCloseButtonClick: () => { },
  onHideBtnClick: () => { },
  input: {
    onChange: () => { },
    value: ''
  },
  handleSelectedOption: () => { },
  isOtherFieldRequired: true,
  required: false
};

export default DropDown;
