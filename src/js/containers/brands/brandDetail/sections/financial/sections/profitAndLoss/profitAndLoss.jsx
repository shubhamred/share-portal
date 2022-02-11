import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

import styles from './styles.scss';
import { PaginatedTable } from '../../../../../../../components';

const _ = require('lodash');

const pnlReducer = (accumulator, currentValue) => {
  const tempPnL = {
    ...currentValue.profitAndLoss
  };

  const model = {
    netRevenue: null,
    totalCostOfMaterialsConsumed: null,
    totalPurchasesOfStockInTrade: null,
    totalChangesInInventoriesOrFinishedGoods: null,
    totalEmployeeBenefitExpense: null,
    totalOtherExpenses: null,
    operatingProfit: null,
    otherIncome: null,
    depreciation: null,
    profitBeforeInterestAndTax: null,
    interest: null,
    profitBeforeTaxAndExceptionalItemsBeforeTax: null,
    exceptionalItemsBeforeTax: null,
    profitBeforeTax: null,
    incomeTax: null,
    profitForPeriodFromContinuingOperations: null,
    profitFromDiscontinuingOperationAfterTax: null,
    minorityInterestAndProfitFromAssociatesAndJointVentures: null,
    profitAfterTax: null
  };

  const pnl = _.pick(tempPnL, _.keys(model));
  Object.keys(pnl).map((key) => {
    const objIdx = _.findIndex(accumulator, ((o) => o.name === _.startCase(key)));
    if (objIdx > -1) {
      const tempObj = {
        ...accumulator[objIdx],
        [currentValue.reportingYear]: pnl[key]
      };
      accumulator[objIdx] = tempObj;
    } else {
      accumulator.push({
        name: _.startCase(key),
        [currentValue.reportingYear]: pnl[key]
      });
    }

    return '';
  });

  return accumulator;
};

const ProfitAndLoss = (props) => {
  const { companyId, financialProfitAndLoss, getFinancialProfitAndLoss } = props;

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const rows = (financialProfitAndLoss) ? financialProfitAndLoss.reduce(pnlReducer, []) : [];
  const rowNames = (rows && rows.length > 0) ? Object.keys(rows[0]) : [];

  const columns = rowNames;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);

  useEffect(() => {
    if (getFinancialProfitAndLoss) getFinancialProfitAndLoss(companyId, rowsPerPage, 1);
  }, []);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Typography>Profit And Loss</Typography>

        <PaginatedTable
          dataTableType="shareholdings"
          fetchNextData={(limit, offset) => getFinancialProfitAndLoss(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
          totalCount={rows.length}
          columns={columns}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          page={page}
          setPage={(pageNo) => setPage(pageNo)}
          rows={rows}
          emptyRows={emptyRows}
          rowNames={rowNames}
        />
      </Grid>
    </Grid>
  );
};

ProfitAndLoss.propTypes = {
  companyId: PropTypes.string,
  financialProfitAndLoss: PropTypes.arrayOf(PropTypes.shape({})),
  getFinancialProfitAndLoss: PropTypes.func
};

ProfitAndLoss.defaultProps = {
  companyId: null,
  financialProfitAndLoss: null,
  getFinancialProfitAndLoss: () => { }
};

export default ProfitAndLoss;
