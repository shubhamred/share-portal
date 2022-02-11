import React from 'react';
// import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, IconButton, Grid } from '@material-ui/core';
import styles from './styles.scss';

const useStyles = makeStyles(() => ({
  root: {
    padding: (props) => (props.customPadding ? props.customPadding : 0),
    width: (props) => (props.customWidth ? `${props.customWidth}` : '500px !important'),
    height: (props) => (props.customHeight ? `${props.customHeight}px` : 'auto')
  },
  wrapper: {
    padding: (props) => (props.customBodyPadding ? props.customBodyPadding : '8px 24px')
  }
}));

const DialogComponent = (props) => {
  const classes = useStyles(props);
  const { children, onClose, closeButton, contentStyle, title, titleStyles, steps, tag, disableFocus } = props;

  const { total, active } = steps || {};

  return (
    <Dialog
      open={true}
      classes={{
        paper: classes.root
      }}
      maxWidth={false}
      disableEnforceFocus={disableFocus || false}
      disableAutoFocus={disableFocus || false}
    >
      <Grid className={styles.grid}>
        <div className={styles.modalTitle} style={titleStyles ? { ...titleStyles } : {}}>
          {title}
          {tag}
        </div>
        {closeButton && (
          <div className={styles.closeBtnContainer}>
            <IconButton
              className={styles.iconButtonStyle}
              disableRipple={true}
              onClick={onClose}
            >
              <img src="/assets/close.svg" alt="close" width={14} height={14} />
            </IconButton>
          </div>
        )}
        {steps && (
          <div className={styles.stepContainer}>
            Step
            {' '}
            {active}
            /
            {total}
          </div>
        )}
      </Grid>
      <DialogContent className={styles.wrapper} style={contentStyle}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

DialogComponent.propTypes = {
  closeButton: PropTypes.bool,
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func,
  contentStyle: PropTypes.shape({}),
  title: PropTypes.string,
  steps: PropTypes.shape({}),
  tag: PropTypes.shape({}),
  disableFocus: PropTypes.bool
};

DialogComponent.defaultProps = {
  closeButton: true,
  onClose: () => {},
  contentStyle: {},
  title: '',
  steps: null,
  tag: null,
  disableFocus: false
};

export default DialogComponent;
