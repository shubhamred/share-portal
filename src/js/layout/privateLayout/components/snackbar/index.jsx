/* eslint-disable react/no-multi-comp */
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';

function Alert(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  snackBar: {
    alignItems: 'center'
  }
}));

const initialState = {
  show: false,
  message: null,
  type: 'error',
  showLoader: false
};

export function errorReducer(state = initialState, action) {
  switch (action.type) {
    case 'show':
      return {
        ...state,
        show: true,
        message: action.payload,
        type: action.msgType
      };
    case 'hide':
      return { ...state, show: false, message: null };
    case 'SHOW_LOADER':
      return { ...state, showLoader: true };
    case 'HIDE_LOADER':
      return { ...state, showLoader: false };
    default:
      return state;
  }
}

const SnackbarComponent = () => {
  const error = useSelector((state) => state.errorRed);
  const dispatch = useDispatch();
  const { show, message, type } = error;
  const handleClose = () => {
    dispatch({ type: 'hide' });
  };
  const renderMessage = () => (
    <>
      {typeof message === 'string' ? (
        message
      ) : (
        <ol>
          {map(message, (msg) => (typeof msg === 'string' ? <li key={msg}>{msg}</li> : 'Error'))}
        </ol>
      )}
    </>
  );
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={show}
        onClose={handleClose}
      >
        <Alert
          className={classes.snackBar}
          onClose={handleClose}
          severity={type}
        >
          {renderMessage() || 'Error'}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarComponent;
