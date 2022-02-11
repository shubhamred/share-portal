import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Grid, Breadcrumbs, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  formContainer: {
    width: '100% !important',
    backgroundColor: 'white !important',
    // marginBottom: '20px',
    height: 'fit-content'
    // marginRight: '24px'
  },
  divBreadcrumbs: {
    // padding: '1%'
  },
  divBreadcrumbsText: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    color: '#1518afcc !important',
    cursor: 'pointer',
    textTransform: 'capitalize',
    '&:hover': {
      // textDecoration: 'underline'
    }
  },
  divBreadcrumbsIconText: {
    fontSize: '18px',
    color: '#1518afcc !important',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '&:hover': {
      // textDecoration: 'underline'
    }
  },
  divBreadcrumbsTextActive: {
    fontSize: '16px',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'capitalize',
    color: '#1518afcc !important'
  }
}));

const EnhancedDrawer = (props) => {
  const classes = useStyles();
  const { BreadcrumbsArray, styles, childEl } = props;
  return (
    <Grid
      item={true}
      justify="space-between"
      direction="row"
      container={true}
      className={classes.formContainer}
      style={styles}
    >
      <div className={classes.divBreadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          {BreadcrumbsArray.map((list, index) => {
            let classType = '';
            if (index === 0) return null;
            if (index === 1) {
              classType = classes.divBreadcrumbsTextActive;
            } else {
              classType = classes.divBreadcrumbsText;
            }
            return (
              <Typography
                className={classType}
                color="inherit"
                onClick={() => list.functions()}
              >
                {list.title}
              </Typography>
            );
          })}
        </Breadcrumbs>
      </div>
      {childEl && <div>{childEl}</div>}
    </Grid>
  );
};

EnhancedDrawer.propTypes = {
  BreadcrumbsArray: PropTypes.arrayOf(PropTypes.shape([])),
  styles: PropTypes.shape({}),
  childEl: PropTypes.node
};

EnhancedDrawer.defaultProps = {
  BreadcrumbsArray: [],
  styles: {},
  childEl: null
};

export default EnhancedDrawer;
