import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 9999,
    color: '#fff'
  }
}));

const FullScreenLoader = () => {
  const error = useSelector((state) => state.errorRed);
  const { showLoader } = error;
  const classes = useStyles();
  return (
    <>
      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default FullScreenLoader;
