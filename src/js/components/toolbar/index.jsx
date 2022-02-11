/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import rootStyles from '../../rootStyles.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '0px'
    // fontFamily: 'Rubik !important'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    // fontFamily: 'Rubik !important',
    fontSize: '1.5rem',
    // fontWeight: 'bold',
    color: '#164363'
  },
  margin: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1)
    // fontFamily: 'Rubik !important'
  }
}));

const Toolbarcomponent = (props) => {
  const classes = useStyles();
  const { title, actions } = props;
  return (
    <Toolbar className={classes.root}>
      <Typography
        variant="h6"
        className={`${classes.title} ${rootStyles.customH5}`}
      >
        {title}
      </Typography>
      {actions && actions.length
        ? actions.map((action, index) => {
          if (action.component) {
            return (
              <div
                className={`${classes.margin} ${rootStyles.customSubtitle}`}
                key={`component-${index}`}
              >
                {action.component}
              </div>
            );
          }
          if (action.icon) {
            return (
              <IconButton
                key={`icon-${index}`}
                onClick={action.onClick}
                aria-label={action.label}
                className={`${classes.margin} ${rootStyles.customSubtitle}`}
                {...action.otherProps}
              >
                {action.icon}
              </IconButton>
            );
          }
          return (
            <Button
              key={`button-${index}`}
              className={`${classes.margin} ${rootStyles.customSubtitle}`}
              onClick={action.onClick}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              {...action.otherProps}
            >
              {action.label}
            </Button>
          );
        })
        : null}
    </Toolbar>
  );
};

Toolbarcomponent.defaultProps = {
  title: null,
  actions: []
};

Toolbarcomponent.propTypes = {
  title: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  actions: PropTypes.array
};

export default Toolbarcomponent;
