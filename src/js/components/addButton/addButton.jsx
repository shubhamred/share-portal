import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const AddButton = (props) => (
  <Grid onClick={props.onClick} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} props={props}>
    <AddCircleIcon style={{ fill: '#5064E2' }} />
    <Grid style={{ padding: '4px', color: '#164363' }}>{props.label}</Grid>
  </Grid>
);

AddButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func
};

AddButton.defaultProps = {
  label: 'Add',
  onClick: () => {}
};

export default AddButton;
