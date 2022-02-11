import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

import { TableCustom } from 'app/components';

import styles from './styles.scss';

const ShareholdingSummary = (props) => {
  const { companyId, getFinancialShareholdingType } = props;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const tableColumns = [
    { Header: 'Shareholders', accessor: 'shareholders', disableSortBy: true },
    { Header: '# of Shares', accessor: 'totalNoOfShares', disableSortBy: true },
    { Header: '%age', accessor: 'totalPercentageOfShares', disableSortBy: true },
    { Header: 'Category', accessor: 'category', disableSortBy: true }];

  useEffect(() => {
    fetchData(rowsPerPage, 0, 0);
  }, []);

  const fetchData = (limit, offset, newPage) => {
    setTableLoading(true);
    getFinancialShareholdingType(companyId, limit, newPage + 1).then((res) => {
      setTableData(res.data);
      setDataCount(res.meta.total);
      setTableLoading(false);
    });
  };

  return (
    !!tableData?.length && (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Typography>
          Shareholding Summary
        </Typography>
        <TableCustom
          fetchNextData={(limit, offset, newPage) => fetchData(limit, offset, newPage)}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          tableData={tableData}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
        />
      </Grid>
    </Grid>
    )
  );
};

ShareholdingSummary.propTypes = {
  companyId: PropTypes.string,
  getFinancialShareholdingType: PropTypes.func
};

ShareholdingSummary.defaultProps = {
  companyId: null,
  getFinancialShareholdingType: () => { }
};

export default ShareholdingSummary;
