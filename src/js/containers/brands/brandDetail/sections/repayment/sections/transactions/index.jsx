import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { fetchTransactions } from 'app/containers/brands/saga';
import { AdvanceTable } from 'app/components';
import { formatDateStandard, formatCurrency } from 'app/utils/utils';
import styles from '../../styles.scss';

const Payout = (props) => {
  const { company } = props;
  const [tableData, setTableData] = useState([]);
  const defaultRows = 25;
  const defaultPage = 0;
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [isTableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(defaultPage);
  const [totalDataCount, setDataCount] = useState(0);

  const queryParam = {
    order: { addedOn: 'DESC' },
    take: rowsPerPage,
    page
  };

  const handleRowsChange = (rowNo) => {
    setRowsPerPage(rowNo);
    fetchData(rowNo, page);
  };

  const fetchData = (limit, offset) => {
    setTableLoading(true);
    queryParam.take = limit;
    queryParam.page = offset + 1;
    fetchTransactions(queryParam, company?.company?.companyCode)
      .then((res) => {
        setTableData(res.data.transactions);
        setDataCount(res.meta.total);
        setTableLoading(false);
      })
      .catch(() => {
        setTableLoading(false);
        setTableData([]);
        setDataCount(0);
      });
  };

  useEffect(() => {
    fetchData(rowsPerPage, page);
  }, []);

  const tableColumns = [
    {
      Header: 'Transaction Id',
      accessor: 'transactionId',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      disableSortBy: true,
      Cell: (row) => formatCurrency(row?.value || 0),
      disableFilters: true
    },
    {
      Header: 'Vendor',
      accessor: 'vendor',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Vendor Transfer Id',
      accessor: 'vendorTransactionId',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Transfer Time',
      accessor: 'addedOn',
      disableSortBy: true,
      Cell: (row) => formatDateStandard(row.value),
      disableFilters: true
    }
  ];
  return (
    <Grid container={true}>
      <Grid item={true} xs={12} className={styles.mb16}>
        <Grid className={styles.headerText}>
          Partner Settlement
          <span className={styles.headerInnerText}>( This is the settlement done by the Payment gateway partner to the Brand )</span>
        </Grid>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true} alignItems="center" className={styles.tableContainer}>
          <AdvanceTable
            fetchNextData={(limit, offset, newPage) => fetchData(limit, newPage)}
            totalCount={totalDataCount}
            tableColumns={tableColumns}
            tableData={tableData}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
            currentPage={page}
            setPage={(pageNo) => setPage(pageNo)}
            isLoading={isTableLoading}
            isStatusCheckboxRequired={false}
            disableFilter={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Payout;
