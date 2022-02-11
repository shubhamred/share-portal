/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  useTable,
  useSortBy,
  useFilters
} from 'react-table';
import PropTypes from 'prop-types';
import MultiSelect from '../multiselect/multiSelect';

import styles from './style.scss';

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  container: {
    // maxHeight: 440
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#164363'
  }
});

const CustomTable = (props) => {
  // eslint-disable-next-line max-len
  const { tableData, tableColumns, totalCount, isLoading, rowsPerPage, setRowsPerPage, currentPage, setPage, fetchNextData, handleRowClick, checkedOptions, statusOptions,
    handleClearStatus, handleCheckBoxValue, onChangeSort, isStatusCheckboxRequired, disableFilter } = props;
  if (!tableData) {
    return <p>loading...</p>;
  }
  const columns = tableColumns;
  const data = tableData;
  const classes = useStyles();
  const { getTableProps, headerGroups, rows, prepareRow, state: { sortBy } } = useTable(
    {
      columns,
      data,
      // initialState: { sortBy: initialSortBy },
      manualSortBy: true,
      manualFilters: true,
      disableFilters: disableFilter
    },
    useFilters,
    useSortBy
  );
  // Store new sort state in reducer and call API to fetch new data from server
  React.useEffect(() => {
    onChangeSort(sortBy);
  }, [onChangeSort, sortBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchNextData(rowsPerPage, (newPage * rowsPerPage), newPage);
  };

  const handleChangeRowsPerPage = ({ target: { value } }) => {
    setRowsPerPage(value);
    setPage(0);
    fetchNextData(value, 0, 0);
  };
  return (
    <Paper className={classes.root}>
      {isLoading ? <LinearProgress variant="query" /> : null }
      <TableContainer className={classes.container} {...getTableProps()}>
        <Table>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div className={classes.alignCenter}>
                      { column.id === 'status' && isStatusCheckboxRequired ? (
                        <div className={classes.alignCenter}>
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
                          {checkedOptions.length
                            ? (
                              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                              <span tabIndex="0" onClick={handleClearStatus}>
                                Clear
                              </span>) : null}
                        </div>
                      ) : (
                        <>
                          {column.canFilter ? column.render('Filter') : (
                            <>
                              { column.render('Header') }
                              {column.isSorted ? column.isSortedDesc
                                ? <ArrowDownwardIcon fontSize="small" />
                                : <ArrowUpwardIcon fontSize="small" />
                                : ''}
                            </>
                          )}
                        </>
                      ) }

                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          {
            rows && !isLoading && rows.length === 0 && (
              <div>
                <p className={styles.noDataText}>No Data Found</p>
              </div>
            )
          }
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow className={styles.tableRowHover} {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                  {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        props.isPaginationRequired ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : null
      }
    </Paper>
  );
};

CustomTable.propTypes = {
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
  totalCount: PropTypes.number,
  isLoading: PropTypes.bool,
  disableFilter: PropTypes.bool,
  isPaginationRequired: PropTypes.bool,
  isStatusCheckboxRequired: PropTypes.bool,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  currentPage: PropTypes.number,
  setPage: PropTypes.func,
  fetchNextData: PropTypes.func,
  handleRowClick: PropTypes.func,
  onChangeSort: PropTypes.func
};

CustomTable.defaultProps = {
  tableColumns: [],
  tableData: [],
  totalCount: 0,
  isLoading: false,
  disableFilter: true,
  isPaginationRequired: true,
  isStatusCheckboxRequired: true,
  rowsPerPage: 5,
  setRowsPerPage: () => {},
  currentPage: 0,
  setPage: () => {},
  fetchNextData: () => {},
  handleRowClick: () => {},
  onChangeSort: () => {}
};
export default React.memo(CustomTable);
