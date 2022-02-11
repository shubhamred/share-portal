import * as React from 'react';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import { TableCustom } from 'app/components';
import { Context, formatCurrency } from 'app/utils/utils';
import { getConsolidatedGstTransactions } from '../../../../../saga';
import { GSTContextTS } from '../../gst.model';

type GetDataTS = (rowLimit: number, rowsPage: number) => void;

const GstConsolidated: React.FC = () => {
  const { company } = React.useContext<GSTContextTS>(Context);
  const [gst, setGstDetails] = React.useState([]);
  const [isTableLoading, setTableLoading] = React.useState<boolean>(true);
  const [totalDataCount, setDataCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  const tableColumns = [
    {
      Header: 'Month',
      accessor: 'returnPeriod',
      disableSortBy: true,
      Cell: (row: any) => moment(row.value).format('MMM YY')
    },
    {
      Header: 'Revenue',
      accessor: 'gstr3bTotalTaxableValue',
      disableSortBy: true,
      Cell: (row: any) => (row.value ? formatCurrency(row.value) : 'N/A')
    },
    {
      Header: 'Tax',
      accessor: 'gstr3bTotalTax',
      disableSortBy: true,
      Cell: (row: any) => (row.value ? formatCurrency(row.value) : 'N/A')
    }
  ];

  const getData: GetDataTS = (rowLimit, rowsPage) => {
    setTableLoading(true);
    const query = {
      where: { resourceCode: company?.companyCode || '' },
      order: { returnPeriod: 'DESC' },
      take: rowLimit,
      page: rowsPage
    };
    getConsolidatedGstTransactions(query).then((res) => {
      setTableLoading(false);
      if (res.data) {
        setGstDetails(res.data);
        setDataCount(res.meta.total);
      }
    });
  };

  React.useEffect(() => {
    if (company?.companyCode) {
      getData(rowsPerPage, page + 1);
    }
  }, []);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <TableCustom
          tableColumns={tableColumns}
          tableData={gst}
          rowsPerPage={rowsPerPage}
          isLoading={isTableLoading}
          totalCount={totalDataCount}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          fetchNextData={(limit, offset, newPage) => getData(limit, newPage + 1)}
        />
      </Grid>
    </Grid>
  );
};

export default GstConsolidated;
