import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import styles from './styles.scss';

const CashFlow = (props) => {
  const { getFinancialCashFlow } = props;

  useEffect(() => {
    if (getFinancialCashFlow) getFinancialCashFlow();
  }, []);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        Cash Flow
      </Grid>
    </Grid>
  );
};

CashFlow.propTypes = {
  getFinancialCashFlow: PropTypes.func
  // financialCashFlow: PropTypes.arrayOf(PropTypes.shape({}))
};

CashFlow.defaultProps = {
  getFinancialCashFlow: () => { }
  // financialCashFlow: null
};

export default CashFlow;
