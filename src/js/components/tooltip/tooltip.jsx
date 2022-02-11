/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Popover from 'material-ui-popup-state/HoverPopover';
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks';

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: '#fff0',
    boxShadow: 'none'
  }
}));

const useStyles1 = makeStyles(() => ({
  popoverOuterDiv: {
    backgroundColor: '#fff0'
  },
  popoverInnerDiv: {
    margin: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0px 5px 5px -3px #00000033, 0px 8px 10px 1px #00000024, 0px 3px 14px 2px #0000001f'
  }
}));
function MuiTooltips(props) {
  const classes = useStyles();
  const classes1 = useStyles1();
  const {
    title,
    children,
    anchorOriginVertical,
    anchorOriginHorizontal,
    transformOriginVertical,
    transformOriginHorizontal
  } = props;
  const popupState = usePopupState({
    variant: 'popper',
    popupId: 'demoPopper'
  });

  return (
    <div>
      <div {...bindHover(popupState)}>{children}</div>
      <Popover
        classes={classes}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: anchorOriginVertical,
          horizontal: anchorOriginHorizontal
        }}
        transformOrigin={{
          vertical: transformOriginVertical,
          horizontal: transformOriginHorizontal
        }}
        disableRestoreFocus>
        <Grid onClick={popupState.close} className={classes1.popoverOuterDiv}>
          <div className={classes1.popoverInnerDiv}>{title}</div>
        </Grid>
      </Popover>
    </div>
  );
}

MuiTooltips.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  anchorOriginVertical: PropTypes.string,
  anchorOriginHorizontal: PropTypes.string,
  transformOriginVertical: PropTypes.string,
  transformOriginHorizontal: PropTypes.string
};

MuiTooltips.defaultProps = {
  anchorOriginVertical: 'bottom',
  anchorOriginHorizontal: 'center',
  transformOriginVertical: 'top',
  transformOriginHorizontal: 'center'
};

export default MuiTooltips;
