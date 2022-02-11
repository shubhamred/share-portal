import React, { useEffect, useState } from 'react';
import { Grid, TextField, Divider, Button } from '@material-ui/core';
import { TableCustom } from 'app/components';
import { groupBy, reduce, startCase } from 'lodash';
import { formatCurrency } from 'app/utils/utils';
import { getSumOfData } from 'app/containers/brands/brandDetail/sections/banking/sections/singleBank/utils';

const ChequeDetails = (props) => {
  const { summary } = props;
  const [showTable, toggleTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColums] = useState([]);
  const [fieldsData, setFieldsData] = useState({
    inwardBounce: 0,
    outwardBounce: 0,
    emiBounce: 0
  });

  const particular = {
    Header: 'Particulars',
    accessor: 'particular',
    disableSortBy: true,
    Cell: (row) => startCase(row.value)
  };

  const rowNames = [
    'chequeIssues',
    'inwardBounce',
    'chequeDeposit',
    'outwardBounce'
  ];

  const processData = () => {
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
    setTableColums([particular, ...tempColumns]);

    const tempArr = rowNames.map((val) => {
      const obj = {
        particular: val
      };
      const tempData = Object.entries(groupByMonths).map(([key, values]) => ({
        [key]: reduce(values, (sum, value) => sum + Number(value[val]), 0)
      }));
      return { ...obj, ...Object.assign({}, ...tempData) };
    });
    // console.log(tempArr);
    setTableData(tempArr);
  };

  useEffect(() => {
    if (summary && summary.length) {
      processData();
      const inwardBounce = getSumOfData(summary, 'inwardBounce');
      const outwardBounce = getSumOfData(summary, 'outwardBounce');
      setFieldsData({ inwardBounce, outwardBounce });
    }
  }, [summary]);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <p>Cheque Bounces</p>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true}>
          <Grid item={true} xs={3}>
            <TextField
              label="Inward Cheque Bounce"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={formatCurrency(fieldsData.inwardBounce)}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <TextField
              label="Outward Cheque Bounce"
              disabled={true}
              InputLabelProps={{ shrink: true }}
              value={formatCurrency(fieldsData.outwardBounce)}
            />
          </Grid>
          <Grid item={true} xs={3} style={{ display: 'none' }}>
            <TextField
              label="Emi Bounces"
              disabled={true}
              InputLabelProps={{ shrink: true }}
              value={formatCurrency(0)}
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

export default ChequeDetails;
