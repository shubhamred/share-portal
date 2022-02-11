import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '27px',
    marginTop: '2px',
    width: (props) => (props.fullWidth ? `100%` : 'auto')
  },
  shadow: {
    boxShadow: '2px 3px 6px 1px rgba(164, 164, 164, 0.2)'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: (props) => (props.customBasis ? props.customBasis : '90%'),
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  actionsContainer: {
    position: 'relative'
  }
}));

const ControlledAccordions = (props) => {
  const classes = useStyles(props);
  const {
    expanded,
    handleChange,
    children,
    heading,
    subHeading,
    actions,
    id,
    unmountOnExit
  } = props;

  return (
    <div className={classes.root} data-accordionid={id}>
      <Accordion
        className={classes.shadow}
        expanded={expanded === id}
        onChange={(event, expan) => handleChange(expan, id, true)}
        TransitionProps={{ unmountOnExit }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.heading}>{heading}</div>
          {subHeading && (
            <div className={classes.secondaryHeading}>
              {subHeading}
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
        {actions && actions.length ? (
          <>
            <Divider />
            <AccordionActions className={classes.actionsContainer}>
              {actions.map((action) => action)}
            </AccordionActions>
          </>
        ) : null}
      </Accordion>
    </div>
  );
};

ControlledAccordions.propTypes = {
  expanded: PropTypes.any,
  handleChange: PropTypes.func,
  children: PropTypes.element,
  heading: PropTypes.any,
  subHeading: PropTypes.any,
  actions: PropTypes.array,
  id: PropTypes.string,
  unmountOnExit: PropTypes.bool
  // fullWidth: PropTypes.bool
};

ControlledAccordions.defaultProps = {
  expanded: null,
  handleChange: () => {},
  children: null,
  heading: null,
  subHeading: null,
  actions: [],
  id: '',
  unmountOnExit: false
  // fullWidth: false
};

export default React.memo(ControlledAccordions);
