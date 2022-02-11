/* eslint-disable react/no-multi-comp */
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  active: {
    '& $line': {
      borderColor: '#0000001a'
    }
  },
  completed: {
    '& $line': {
      borderColor: '#0000001a'
    }
  },
  line: {
    borderStyle: 'dashed',
    borderColor: '#0000001a',
    borderTopWidth: 0,
    borderRadius: 0,
    borderWidth: 1
  }
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center'
  },
  active: {
    color: '#784af4'
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18
  }
});

const stepStyles = {
  position: 'relative'
};

const stepLabelStyles = {
  textTransform: 'uppercase'
};

const childrenStyles = {
  position: 'absolute',
  left: '40px',
  width: '100%'
};

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool
};

QontoStepIcon.defaultProps = {
  active: false,
  completed: false
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  stepIcon: {
    color: '#c4c4c480 !important'
  },
  stepIconActive: {
    color: '#C4C4C4 !important'
  },
  stepIconCompleted: {
    color: '#27AF60 !important'
  },
  labelCompleted: {
    color: '#212529 !important',
    fontWeight: '400 !important'
  },
  labelActive: {
    fontWeight: '600 !important'
  },
  label: {
    color: '#2125294d',
    fontWeight: '400'
  }
}));

export default function CustomizedSteppers(props) {
  const classes = useStyles();

  const setStepHeight = () => {

  };

  useEffect(() => {
    setStepHeight();
  }, []);

  return (
    <div className={classes.root} style={{ height: '100px' }}>
      <Stepper alternativeLabel={false} activeStep={props.activeStep || 0} connector={<QontoConnector />}>
        {props.steps?.map((data) => (
          <Step key={data.label} style={{ ...stepStyles }}>
            <StepLabel
              style={{ ...stepLabelStyles }}
              classes={{ label: classes.label, completed: classes.labelCompleted, active: classes.labelActive }}
              StepIconProps={{
                classes: { root: classes.stepIcon, completed: classes.stepIconCompleted, active: classes.stepIconActive }
              }}
            >
              {data.label}
            </StepLabel>
            <div style={{ ...childrenStyles }}>
              {data.children}
            </div>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
