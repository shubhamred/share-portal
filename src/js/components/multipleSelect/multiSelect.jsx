import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Chip, Checkbox, ListItemIcon, ListItemText, MenuItem, FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import styles from './styles.scss';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      width: 300
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'menu'
};

const MultiSelect = (props) => {
  const { label, handleSelectedOption, options, isRequiredField, meta, input, selectedOptions, placeholder } = props;
  const { value, onChange, name } = input;
  const { error, submitFailed } = meta;
  const [selected, setSelected] = useState(selectedOptions || []);
  const isAllSelected = options.length > 0 && selected.length === options.length;

  if (input && value === '' && selectedOptions) {
    onChange(selectedOptions);
    handleSelectedOption(selectedOptions);
  }

  const handleChange = (selectedOption) => {
    if (selectedOption[selectedOption.length - 1] === 'all') {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(selectedOption);
  };

  const handleDelete = (data) => {
    const filteredOptions = selected.filter((item) => item !== data);
    setSelected(filteredOptions);
    handleSelectedOption(filteredOptions);
    onChange(filteredOptions);
  };

  return (
    <Grid container={true}>
      {label
        && (
          <Grid className={styles.label} item={true} xs={12} sm={12}>
            {label}
            {isRequiredField ? (
              <span className={styles.requiredStar}>*</span>
            ) : null}
          </Grid>
        )}
      <FormControl className={styles.formControl}>
        <Select
          labelId="mutiple-select-label"
          multiple={true}
          value={selected}
          displayEmpty={placeholder}
          inputProps={{
            name
          }}
          onChange={(event) => {
            handleChange(event.target.value);
            onChange(event.target.value);
            handleSelectedOption(event.target.value);
          }}
          renderValue={(selectedOption) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedOption.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  variant="outlined"
                  onDelete={() => {}}
                  onMouseDown={() => handleDelete(option)}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          <MenuItem
            value="all"
            classes={{
              root: isAllSelected ? styles.selectedAll : ''
            }}
          >
            <ListItemText
              classes={{ primary: styles.selectAllText }}
              primary="Select All"
            />
            <ListItemIcon>
              <Checkbox
                classes={{ indeterminate: styles.indeterminateColor }}
                style={{
                  color: '#1518af'
                }}
                checked={isAllSelected}
                indeterminate={
                    selected.length > 0 && selected.length < options.length
                }
              />
            </ListItemIcon>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemText primary={option} />
              <ListItemIcon>
                <Checkbox
                  checked={selected.indexOf(option) > -1}
                  style={{
                    color: '#1518af'
                  }}
                />
              </ListItemIcon>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && submitFailed
        && (
          <Grid className={styles.warning} item={true} xs={12}>
            {error}
          </Grid>
        )}
    </Grid>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.shape([]),
  handleSelectedOption: PropTypes.func,
  isRequiredField: PropTypes.bool,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool
  })
};

MultiSelect.defaultProps = {
  label: '',
  options: [],
  handleSelectedOption: () => { },
  isRequiredField: false,
  meta: {
    error: '',
    submitFailed: false
  }
};

export default MultiSelect;
