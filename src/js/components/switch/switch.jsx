import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 50,
    height: 26,
    padding: 0,
    margin: '7px'
  },
  switchBase: {
    padding: '1px !important',
    color: '#D5D5D5',
    '& + $track': {
      backgroundColor: 'rgba(212, 212, 212, 0.3);',
      opacity: 1,
      border: 'none'
    },
    '&$checked': {
      left: '8px',
      transform: 'translateX(16px)',
      color: '#10BC5A',
      '& + $track': {
        backgroundColor: 'rgba(16, 188, 90, 0.3)',
        opacity: 1,
        border: 'none'
      }
    }
  },
  thumb: {
    width: '24px !important',
    height: '24px !important'
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {}
}));

const GreenSwitch = (props) => {
  const classes = useStyles();
  const { checked, onChange } = props;
  return (
    <Switch
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      checked={checked}
      onChange={onChange}
    />
  );
};

GreenSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

GreenSwitch.defaultProps = {
  checked: false,
  onChange: () => {}
};

export default GreenSwitch;
