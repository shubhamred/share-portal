import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MenuItem, ListItemText, Select, Checkbox, Input, Chip, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import styles from './styles';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      width: 'auto'
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
  }
};

const MultiSelect = (props) => {
  const { classes, listItems, selectedItems, handleSelect, nameOfSelect, isDisabled,
    isShowChips, chipLabel, onClickClear, style } = props;
  return (
    <div className={classes.flexContainer} style={style}>
      <Select
        className={isDisabled ? classes.doNothing : classes.enabled}
        multiple={true}
        value={selectedItems}
        displayEmpty={true}
        native={false}
        disabled={isDisabled}
        name={nameOfSelect}
        onChange={handleSelect}
        input={<Input disableUnderline={true} />}
        renderValue={(selected) => (
          <>
            {isShowChips ? (
              <div className={classes.chips}>
                {selectedItems && selectedItems.length ? (selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    className={classes.chip}
                    onDelete={() => onClickClear(value)}
                  />
                ))) : (
                  <Typography className={classes.defaultText}>{chipLabel}</Typography>
                )}
              </div>
            ) : (
              nameOfSelect
            )}
          </>
        )}
        MenuProps={MenuProps}
      >
        {listItems.map((item) => (
          <MenuItem
            key={item.name}
            value={item.name}
          >
            <Checkbox
              color="primary"
              checked={selectedItems && selectedItems.indexOf(item.name) > -1}
            />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

MultiSelect.propTypes = {
  classes: PropTypes.shape().isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape()),
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  handleSelect: PropTypes.func,
  onClickClear: PropTypes.func,
  nameOfSelect: PropTypes.string,
  isDisabled: PropTypes.bool,
  isShowChips: PropTypes.bool,
  chipLabel: PropTypes.string
};

MultiSelect.defaultProps = {
  listItems: [],
  handleSelect: () => {},
  onClickClear: () => {},
  nameOfSelect: '',
  selectedItems: [],
  isDisabled: false,
  isShowChips: true,
  chipLabel: ''
};

export default withStyles(styles)(MultiSelect);
