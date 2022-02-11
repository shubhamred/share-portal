import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

import styles from './styles.scss';
import { PaginatedTable } from '../../../../../../../components';

const _ = require('lodash');

const financialReducer = (accumulator, currentValue) => {
  const model = {
    reportingYear: null,
    natureOfReport: null,
    statedOn: null,
    filingStandard: null,
    totalEquity: null,
    totalCurrentLiabilities: null,
    netFixedAssets: null,
    totalCurrentAssets: null,
    capitalWip: null,
    totalDebt: null,
    totalOperatingCost: null
  };

  const financial = _.pick(currentValue, _.keys(model));
  Object.keys(financial).map((key) => {
    const objIdx = _.findIndex(accumulator, ((o) => o.name === _.startCase(key)));
    if (objIdx > -1) {
      const tempObj = {
        ...accumulator[objIdx],
        [currentValue.reportingYear]: financial[key]
      };
      accumulator[objIdx] = tempObj;
    } else {
      accumulator.push({
        name: _.startCase(key),
        [currentValue.reportingYear]: financial[key]
      });
    }

    return '';
  });

  return accumulator;
};

const assetReducer = (accumulator, currentValue) => {
  const tempAsset = {
    ...currentValue.asset
  };

  const model = {
    tangibleAssets: null,
    producingProperties: null,
    intangibleAssets: null,
    preproducingProperties: null,
    tangibleAssetsCapitalWorkInProgress: null,
    intangibleAssetsUnderDevelopment: null,
    noncurrentInvestments: null,
    deferredTaxAssetsNet: null,
    foreignCurrMonetaryItemTransDiffAssetAccount: null,
    longTermLoansAndAdvances: null,
    otherNoncurrentAssets: null,
    currentInvestments: null,
    inventories: null,
    tradeReceivables: null,
    cashAndBankBalances: null,
    shortTermLoansAndAdvances: null,
    otherCurrentAssets: null,
    givenAssetsTotal: null
  };

  const asset = _.pick(tempAsset, _.keys(model));
  Object.keys(asset).map((key) => {
    const objIdx = _.findIndex(accumulator, ((o) => o.name === _.startCase(key)));
    if (objIdx > -1) {
      const tempObj = {
        ...accumulator[objIdx],
        [currentValue.reportingYear]: asset[key]
      };
      accumulator[objIdx] = tempObj;
    } else {
      accumulator.push({
        name: _.startCase(key),
        [currentValue.reportingYear]: asset[key]
      });
    }

    return '';
  });

  return accumulator;
};

const liabilityReducer = (accumulator, currentValue) => {
  const tempLiability = {
    ...currentValue.liability
  };

  const model = {
    shareCapital: null,
    reservesAndSurplus: null,
    moneyReceivedAgainstShareWarrants: null,
    shareApplicationMoneyPendingAllotment: null,
    deferredGovernmentGrants: null,
    minorityInterest: null,
    longTermBorrowings: null,
    deferredTaxLiabilitiesNet: null,
    foreignCurrMonetaryItemTransDiffLiabilityAccount: null,
    otherLongTermLiabilities: null,
    longTermProvisions: null,
    shortTermBorrowings: null,
    tradePayables: null,
    otherCurrentLiabilities: null,
    shortTermProvisions: null,
    givenLiabilitiesTotal: null
  };

  const liability = _.pick(tempLiability, _.keys(model));
  Object.keys(liability).map((key) => {
    const objIdx = _.findIndex(accumulator, ((o) => o.name === _.startCase(key)));
    if (objIdx > -1) {
      const tempObj = {
        ...accumulator[objIdx],
        [currentValue.reportingYear]: liability[key]
      };
      accumulator[objIdx] = tempObj;
    } else {
      accumulator.push({
        name: _.startCase(key),
        [currentValue.reportingYear]: liability[key]
      });
    }

    return '';
  });

  return accumulator;
};

const BalanceSheet = (props) => {
  const { companyId, financialBalanceSheet, getFinancialBalanceSheet, totalCount } = props;

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [assetRowsPerPage, setAssetRowsPerPage] = useState(5);
  const [liabilityRowsPerPage, setLiabilityRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const rows = (financialBalanceSheet) ? financialBalanceSheet.reduce(financialReducer, []) : [];
  const rowNames = (rows && rows.length > 0) ? Object.keys(rows[0]) : [];
  const columns = rowNames;
  const emptyRows = rowsPerPage
   - Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);

  const assetRows = (financialBalanceSheet) ? financialBalanceSheet.reduce(assetReducer, []) : [];
  const assetRowNames = (assetRows && assetRows.length > 0) ? Object.keys(assetRows[0]) : [];
  const assetColumns = assetRowNames;
  const assetEmptyRows = assetRowsPerPage
    - Math.min(assetRowsPerPage, assetRows && assetRows.length - page * assetRowsPerPage);

  const liabilityRows = (financialBalanceSheet) ? financialBalanceSheet.reduce(liabilityReducer, []) : [];
  const liabilityRowNames = (liabilityRows && liabilityRows.length > 0) ? Object.keys(liabilityRows[0]) : [];
  const liabilityColumns = liabilityRowNames;
  const liabilityEmptyRows = liabilityRowsPerPage
   - Math.min(liabilityRowsPerPage, liabilityRows && liabilityRows.length - page * liabilityRowsPerPage);

  useEffect(() => {
    if (getFinancialBalanceSheet) getFinancialBalanceSheet(companyId, rowsPerPage, 1);
  }, []);
  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <Typography>Financial</Typography>

          <PaginatedTable
            dataTableType="financial"
            fetchNextData={(limit, offset) => getFinancialBalanceSheet(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
            totalCount={totalCount}
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
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <Typography>Asset</Typography>

          <PaginatedTable
            dataTableType="asset"
            fetchNextData={(limit, offset) => getFinancialBalanceSheet(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
            totalCount={assetRows.length}
            columns={assetColumns}
            rowsPerPage={assetRowsPerPage}
            setRowsPerPage={(rowNo) => setAssetRowsPerPage(rowNo)}
            page={page}
            setPage={(pageNo) => setPage(pageNo)}
            rows={assetRows}
            emptyRows={assetEmptyRows}
            rowNames={assetRowNames}
            isPaginationRequired={false}
          />
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <Typography>Liability</Typography>

          <PaginatedTable
            dataTableType="liability"
            fetchNextData={(limit, offset) => getFinancialBalanceSheet(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
            totalCount={liabilityRows.length}
            columns={liabilityColumns}
            rowsPerPage={liabilityRowsPerPage}
            setRowsPerPage={(rowNo) => setLiabilityRowsPerPage(rowNo)}
            page={page}
            setPage={(pageNo) => setPage(pageNo)}
            rows={liabilityRows}
            emptyRows={liabilityEmptyRows}
            rowNames={liabilityRowNames}
            isPaginationRequired={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

BalanceSheet.propTypes = {
  companyId: PropTypes.string,
  financialBalanceSheet: PropTypes.arrayOf(PropTypes.shape({})),
  getFinancialBalanceSheet: PropTypes.func
};

BalanceSheet.defaultProps = {
  companyId: null,
  financialBalanceSheet: null,
  getFinancialBalanceSheet: () => { }
};

export default BalanceSheet;
