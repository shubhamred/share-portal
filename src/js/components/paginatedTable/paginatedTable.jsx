/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MultiSelect from '../multiselect/multiSelect';

import styles from './styles.scss';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

const TablePaginationActions = (props) => {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

// .sort((a, b) => (a.calories < b.calories ? -1 : 1));

const useStyles2 = makeStyles(() => ({
  root: {
    overflow: 'unset'
  },
  toolbar: {
    justifyContent: 'center'
  },
  spacer: {
    display: 'none'
  },
  tableCell: {
    // fontFamily: 'Rubik !important',
    color: '#164363',
    fontSize: '14px',
    lineHeight: '17px'
  }
}));

const CustomPaginationActionsTable = (props) => {
  const classes = useStyles2();
  const {
    columns,
    rowsPerPage,
    setRowsPerPage,
    page, setPage,
    rows,
    rowNames,
    totalCount,
    fetchNextData,
    dataTableType,
    onTableHeadClick,
    handleCheckBoxValue,
    statusOptions,
    checkedOptions,
    selectedFromDate,
    handleClearStatus,
    handleClearDate,
    isPaginationRequired
  } = props;
  const history = useHistory();

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows && totalCount - page * rowsPerPage);
  const emptyRows = 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchNextData(rowsPerPage, (newPage * rowsPerPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
    fetchNextData(event.target.value, 0);
  };

  const handleRowClick = (id) => {
    if (dataTableType === 'brands') history.push(`/brands/${id}`);
    else if (dataTableType === 'patrons') history.push(`/patrons/${id}`);
    else if (dataTableType === 'deals') history.push(`/deals/${id}`);
  };

  return (
    <Paper className={styles.wrapper}>
      {rows && (
        <Table className={styles.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {columns && columns.length > 0 && columns.map((column) => (
                <TableCell
                  className={styles.tableHead}
                  onClick={(event) => onTableHeadClick(column, event.target !== this)}
                >
                  {column !== 'Status' ? column
                    : (
                      <div style={{
                        display: 'inline-block',
                        position: 'relative'
                      }}
                      >
                        {checkedOptions.length
                          ? (
                            <span
                              className={styles.statusClearStyle}
                              tabIndex="0"
                              onClick={handleClearStatus}
                            >
                              Clear
                            </span>) : null}
                        <MultiSelect
                          listItems={statusOptions}
                          handleSelect={handleCheckBoxValue}
                          selectedItems={checkedOptions}
                          nameOfSelect="Status"
                          isShowChips={false}
                          style={{
                            border: 'none',
                            backGroundColor: '#ffffff'
                          }}
                        />
                      </div>
                    )}
                  {(column === 'Applied On') && (
                    <>
                      <ArrowDropDownIcon style={{ fontSize: '20px' }} />
                      {selectedFromDate !== ''
                        ? (
                          <span
                            className={styles.dateClearStyle}
                            tabIndex="0"
                            onClick={handleClearDate}
                          >
                            Clear
                          </span>) : null}
                    </>)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rows && rows.length === 0 && (
                <div>
                  <p className={styles.noDataText}>No Data Found</p>
                </div>
              )
            }
            {rows.map((row) => (
              <TableRow key={row.id || row[rowNames[0]]} onClick={() => handleRowClick(row.id)} className={styles.tableRow}>
                {rowNames && rowNames.map((name) => (
                  <TableCell>
                    {row[name]}
                  </TableCell>))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          {
            isPaginationRequired && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  className={classes.root}
                  classes={{
                    toolbar: classes.toolbar,
                    spacer: classes.spacer
                  }}
                  rowsPerPageOptions={[5, 10, 30]}
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
            )
          }
        </Table>
      )}
    </Paper>
  );
};

CustomPaginationActionsTable.propTypes = {
  rowNames: PropTypes.arrayOf(PropTypes.string),
  columns: PropTypes.arrayOf(PropTypes.string),
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  dataTableType: PropTypes.string,
  setPage: PropTypes.func,
  totalCount: PropTypes.number,
  fetchNextData: PropTypes.func,
  rows: PropTypes.arrayOf(PropTypes.shape({})),
  onTableHeadClick: PropTypes.func,
  handleCheckBoxValue: PropTypes.func,
  statusOptions: PropTypes.arrayOf(PropTypes.shape([])),
  checkedOptions: PropTypes.arrayOf(PropTypes.shape([])),
  selectedFromDate: PropTypes.arrayOf(PropTypes.shape([])),
  handleClearStatus: PropTypes.func,
  handleClearDate: PropTypes.func,
  isPaginationRequired: PropTypes.bool
};

CustomPaginationActionsTable.defaultProps = {
  rowNames: [],
  columns: [],
  page: 0,
  rowsPerPage: 5,
  totalCount: 0,
  dataTableType: '',
  fetchNextData: () => { },
  setRowsPerPage: () => { },
  setPage: () => { },
  rows: [{}],
  onTableHeadClick: () => { },
  handleCheckBoxValue: () => { },
  statusOptions: [],
  checkedOptions: [],
  selectedFromDate: [],
  handleClearStatus: () => { },
  handleClearDate: () => { },
  isPaginationRequired: true
};
export default CustomPaginationActionsTable;
