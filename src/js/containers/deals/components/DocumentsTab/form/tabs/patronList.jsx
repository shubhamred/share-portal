import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { AdvanceTable, Button } from 'app/components';
import styles from '../../styles.scss';
import formStyles from '../styles.scss';

const Payout = (props) => {
  const { defaultRows, defaultPage, dataHandler, tableColumns, onClose } = props;
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows || 10);
  const [isTableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(defaultPage || 0);
  const [totalDataCount, setDataCount] = useState(0);

  const handleRowsChange = (rowNo) => {
    setRowsPerPage(rowNo);
    fetchData(rowNo, page);
  };

  const fetchData = (limit, offset) => {
    setTableLoading(true);
    dataHandler(limit, offset + 1)
      .then((res) => {
        setTableData(res.data);
        setDataCount(res.meta);
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

  return (
    <Grid container={true}>
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
      <Grid sm={12} className={formStyles.buttons} style={{ marginTop: '20px' }}>
        <Button
          style={{
            color: '#212529',
            backgroundColor: '#fff',
            border: 'none',
            fontWeight: '600',
            paddingRight: '0px',
            marginRight: '0px',
            textAlign: 'right'
          }}
          type="button"
          label="Close"
          onClick={() => {
            onClose();
          }}
        />
        {/* <Button type="button" onClick={onSubmitHandler} label="Save" /> */}
      </Grid>
    </Grid>
  );
};

export default Payout;
