import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { fetchPayout } from 'app/containers/brands/saga';
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
    fetchPayout(queryParam, company?.company?.companyCode)
      .then((res) => {
        setTableData(res.data.payouts);
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
      Header: 'Payout Id',
      accessor: 'payoutId',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Transaction Id',
      accessor: 'transactionId',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Deal Code',
      accessor: 'dealCode',
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => row?.value || '-'
    },
    {
      Header: 'Account Id',
      accessor: 'accountId',
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
      Header: 'Payout Time',
      accessor: 'addedOn',
      disableSortBy: true,
      Cell: (row) => formatDateStandard(row.value),
      disableFilters: true
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Message',
      accessor: 'message',
      disableSortBy: true,
      disableFilters: true
    }
  ];

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} className={styles.mb16}>
        <Grid className={styles.headerText}>
          Klub Revenue Share
          <span className={styles.headerInnerText}>( The splits that are being received to Klub’s account )</span>
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

          {/* <div id="table-scroll" className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Transaction Id</th>
                  <th scope="col">Account Id</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Vendor</th>
                  <th scope="col">Payout Time</th>
                </tr>
              </thead>
              <tbody className="t-body">
                {mData.map((list) => (
                  <tr key={`table-row-no-${list}`}>
                    <td>04/12/2020</td>
                    <td>Razorpay</td>
                    <td>id912129388</td>
                    <td>912129388</td>
                    <td>3%</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>123</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tfoot>
            </table>
          </div> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Payout;
