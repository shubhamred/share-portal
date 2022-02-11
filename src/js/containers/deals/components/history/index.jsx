import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { AdvanceTable } from 'app/components';
import { map } from 'lodash';
import { getStatusHistory } from 'app/containers/deals/saga';
import { getPortalUserList } from 'app/containers/users/saga';

function History(props) {
  const { dealId } = props;
  const tableColumns = [
    { Header: 'Date', accessor: 'date', disableSortBy: true },
    { Header: 'Time', accessor: 'time', disableSortBy: true },
    { Header: 'User', accessor: 'username', disableSortBy: true },
    { Header: 'Activity', accessor: 'status', disableSortBy: true },
    { Header: 'Remark', accessor: 'remarks', disableSortBy: true }
  ];

  const [totalDataCount, setDataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isTableLoading, setTableLoading] = useState(true);

  const fetchData = (limt, currentpage) => {
    setTableLoading(true);
    getStatusHistory(limt, currentpage, dealId).then(async (res) => {
      if (res?.data?.length) {
        const userIdList = map(res.data, 'userId');
        const userData = await getPortalUserList({
          fields: 'id,firstName,middleName,lastName',
          where: {
            id: {
              in: userIdList
            }
          }
        });
        const mData = res.data.map((list) => {
          const user = userData?.data?.length
            ? userData.data.find((row) => row.id === list.userId)
            : {};
          const userName = `${user?.firstName || ''} ${user?.middleName || ''} ${
            user?.lastName || ''
          }`;
          return {
            ...list,
            date: list?.createdAt ? new Date(list.createdAt).toLocaleDateString() : '',
            time: list?.createdAt ? new Date(list.createdAt).toLocaleTimeString('en-US') : '',
            username: userName || ''
          };
        });
        setTableData(mData);
        setDataCount(res.meta.total);
      } else {
        setTableData([]);
        setDataCount(0);
      }
      setTableLoading(false);
    });
  };

  useEffect(() => {
    if (dealId) fetchData(page + 1, rowsPerPage);
  }, [dealId]);

  return (
    <Grid container={true}>
      <Grid item={true} md={12}>
        <AdvanceTable
          fetchNextData={(limit, offset, newPage) => fetchData(limit, newPage + 1)}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          tableData={tableData}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
          isStatusCheckboxRequired={false}
        />
      </Grid>
    </Grid>
  );
}

export default History;
