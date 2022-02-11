import React from 'react';
import { Grid } from '@material-ui/core';
import { TableCustom } from 'app/components';

const RoleDetails = () => {
  const tableColumns = [
    {
      Header: 'Permission',
      accessor: 'permission',
      disableSortBy: true
    },
    {
      Header: 'Description',
      accessor: 'description',
      disableSortBy: true
    },
    {
      Header: 'API',
      accessor: 'api',
      disableSortBy: true
    },
    {
      Header: 'Action',
      accessor: 'id',
      disableSortBy: true
    }
  ];
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <TableCustom tableColumns={tableColumns} tableData={[]} />
      </Grid>
    </Grid>
  );
};

export default RoleDetails;
