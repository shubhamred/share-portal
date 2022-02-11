import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { TableCustom } from 'app/components';
import { useDispatch } from 'react-redux';
import styles from './styles.scss';

const ErrorTable = ({ error, handleClose }) => {
  const dispatch = useDispatch();
  const { errors } = error;
  const { validationErrors } = errors[0];
  if (!validationErrors) {
    dispatch({ type: 'show', payload: error.message, msgType: 'error' });
    handleClose();
    return null;
  }
  const [tableData, setTableData] = useState([]);
  const tableColumns = [{ Header: 'Name', accessor: 'name', disableSortBy: true }, { Header: 'Mobile', accessor: 'mobile', disableSortBy: true }, { Header: 'Email', accessor: 'email', disableSortBy: true }, { Header: 'Reason', accessor: 'reason', disableSortBy: true }];
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const onChangeSort = (sortBy) => {
    // eslint-disable-next-line no-empty
    if (!sortBy.length) {

    }
  };
  const handleChangeInRow = (newVal) => {
    setRowsPerPage(newVal);
  };
  // eslint-disable-next-line no-unused-vars
  const handlePageChange = (limit, offset) => {
    // console.log(limit, offset);
  };
  const setTable = (errArr) => {
    const tempData = errArr.map((singleError) => ({
      name: singleError.data.name || singleError.data.Name,
      mobile: singleError.data.mobile || singleError.data.Mobile,
      email: singleError.data.email || singleError.data.Email,
      ...singleError.data,
      reason: singleError.constraints[Object.keys(singleError.constraints)[0]],
      [singleError.property]: singleError.value
    }));
    setTableData(tempData);
  };

  useEffect(() => {
    setTable(validationErrors);
  }, []);

  return (
    <>
      <Grid container={true} className={styles.modalContainer}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
        <p className={styles.closeBtn} onClick={handleClose}>x</p>
        <Grid item={true} xs={12}>
          <p className={styles.text}>
            <CancelOutlinedIcon />
            Import Failed due to Data validation errors
          </p>
          <TableCustom
            fetchNextData={(limit, offset) => handlePageChange(limit, offset)}
            totalCount={tableData.length}
            tableColumns={tableColumns}
            tableData={tableData}
            rowsPerPage={rowsPerPage}
            setPage={(rowNo) => handleChangeInRow(rowNo)}
            currentPage={0}
            isLoading={false}
            onChangeSort={onChangeSort}
          />
        </Grid>
      </Grid>
    </>
  );
};

ErrorTable.propTypes = {
  error: PropTypes.shape({})
};

ErrorTable.defaultProps = {
  error: null
};

export default ErrorTable;
