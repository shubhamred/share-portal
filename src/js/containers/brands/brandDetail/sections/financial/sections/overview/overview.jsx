import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './styles.scss';

const Overview = (props) => {
  const { company, financialOverview, getFinancialOverview } = props;
  const companyId = company.id || '';

  useEffect(() => {
    if (getFinancialOverview && companyId) getFinancialOverview(companyId);
  }, [company]);

  if (!financialOverview) {
    return <p>Loading</p>;
  }
  return (
    <Grid direction="column" container={true}>
      <List className={styles.list}>
        <ListItem disableGutters={true}>
          <ListItemText primary="Authorized Capital" secondary={financialOverview.authorizedCapital} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Paid Up Capital" secondary={financialOverview.paidUpCapital} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Legal Constitution" secondary={financialOverview.legalConstitution} />
        </ListItem>
      </List>
      <List>
        <ListItem disableGutters={true}>
          <ListItemText primary="Description (as per MCA)" secondary={financialOverview.description} />
        </ListItem>
      </List>
    </Grid>
  );
};

Overview.propTypes = {
  company: PropTypes.object,
  financialOverview: PropTypes.shape({}),
  getFinancialOverview: PropTypes.func
};

Overview.defaultProps = {
  company: {},
  financialOverview: {},
  getFinancialOverview: () => { }
};

export default Overview;
