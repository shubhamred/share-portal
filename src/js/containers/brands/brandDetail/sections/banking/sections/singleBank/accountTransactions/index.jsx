import React, { useEffect, useState } from 'react';
import { Grid, TextField, Divider, Button } from '@material-ui/core';
import { TableCustom } from 'app/components';
import { groupBy, reduce } from 'lodash';
import { formatCurrency } from 'app/utils/utils';
import { getSumOfData } from '../utils';

const AccountTransactionsSection = (props) => {
  const { type, summary } = props;
  const [showTable, toggleTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColums] = useState([]);
  const [fieldData, setFieldData] = useState({ total: 0, average: 0 });

  const processTableData = () => {
    const groupByMonths = groupBy(
      summary,
      (x) => `${x.summaryMonth} ${x.summaryYear}`
    );
    const tempColumns = Object.keys(groupByMonths).map((group) => ({
      Header: group,
      accessor: group,
      disableSortBy: true,
      Cell: (row) => (row.value ? formatCurrency(row.value) : '-')
    }));
    setTableColums(tempColumns);
    const tempData = Object.entries(groupByMonths).map(([key, values]) => ({
      [key]: reduce(
        values,
        (sum, n) => {
          if (type === 'Credit') {
            return sum + n.totalNetCredit;
          }
          return sum + n.totalNetDebit;
        },
        0
      )
    }));
    setTableData([Object.assign({}, ...tempData)]);
  };

  useEffect(() => {
    if (summary && summary.length) {
      processTableData();
      const sum = getSumOfData(
        summary,
        type === 'Credit' ? 'totalNetCredit' : 'totalNetDebit'
      );
      setFieldData({ total: sum, average: sum / summary.length });
    }
  }, [summary]);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <p>{type}</p>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true}>
          <Grid item={true} xs={3}>
            <TextField
              label={`Total ${type}`}
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={formatCurrency(fieldData.total)}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <TextField
              label={`Avg ${type} ₹/Month `}
              disabled={true}
              InputLabelProps={{ shrink: true }}
              value={formatCurrency(fieldData.average)}
            />
          </Grid>
        </Grid>
      </Grid>
      {summary && summary.length ? (
        <Grid item={true} xs={12}>
          <Button
            variant="text"
            color="primary"
            onClick={() => toggleTable((prevState) => !prevState)}
            style={{ margin: '15px 0' }}
          >
            {showTable ? 'Hide transactions' : 'View Transactions'}
          </Button>
        </Grid>
      ) : null}
      <Grid item={true} xs={12}>
        {showTable ? (
          <TableCustom
            tableColumns={tableColumns}
            tableData={tableData}
            isPaginationRequired={false}
          />
        ) : null}
      </Grid>
      <Grid item={true} xs={12} style={{ margin: '15px 0' }}>
        <Divider width="100%" />
      </Grid>
    </Grid>
  );
};

export default AccountTransactionsSection;
