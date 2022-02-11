import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { TableCustom } from 'app/components';

import { formatCurrency, formatDateStandard } from 'app/utils/utils';
import styles from './styles.scss';

const SecurityAllotment = (props) => {
  const { companyId, getFinancialSecurityAllotment } = props;

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const tableColumns = [
    { Header: 'Type', accessor: 'allotmentType', disableSortBy: true },
    { Header: 'Date', accessor: 'allotmentDate', disableSortBy: true, Cell: (row) => row.value && formatDateStandard(row.value) },
    { Header: 'Instrument', accessor: 'instrument', disableSortBy: true },
    { Header: 'Amount', accessor: 'totalAmountRaised', disableSortBy: true, Cell: (row) => row.value && formatCurrency(row.value) },
    { Header: 'Number', accessor: 'numberOfSecuritiesAllotted', disableSortBy: true },
    { Header: 'Nominal Value', accessor: 'nominalAmountPerSecurity', disableSortBy: true },
    { Header: 'Premium Value', accessor: 'premiumAmountPerSecurity', disableSortBy: true }
  ];

  useEffect(() => {
    fetchData(rowsPerPage, 0, 0);
  }, []);

  const fetchData = (limit, offset, newPage) => {
    setTableLoading(true);
    getFinancialSecurityAllotment(companyId, limit, newPage + 1).then((res) => {
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
          Securities Allotment
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

SecurityAllotment.propTypes = {
  companyId: PropTypes.string,
  getFinancialSecurityAllotment: PropTypes.func
};

SecurityAllotment.defaultProps = {
  companyId: null,
  getFinancialSecurityAllotment: () => { }
};

export default SecurityAllotment;
