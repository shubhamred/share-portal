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
    width: '100%',
    boxShadow: 'none'
  },
  container: {
    boxShadow: 'none'
    // maxHeight: 440
  },
  alignCenter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '400',
    color: '#7B8395'
  },
  sortButton: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 10px'
  },
  sortImageUp: {
    marginBottom: '2px',
    height: '6px'
  },
  sortImageDown: {
    marginTop: '2px',
    height: '6px'
  },
  sortImageUpWithSelect: {
    filter: 'contrast(0.1)'
  },
  sortImageDownWithSelect: {
    filter: 'contrast(0.1)'
  }
});

const CustomTable = (props) => {
  // eslint-disable-next-line max-len
  const { tableData, tableColumns, totalCount, isLoading, rowsPerPage, setRowsPerPage, currentPage, setPage, fetchNextData, handleRowClick, checkedOptions, statusOptions,
    handleClearStatus, handleCheckBoxValue, onChangeSort, isStatusCheckboxRequired, disableFilter, initialStateProps, columnWidth = [], rowsPerPageOptions } = props;
  if (!tableData) {
    return <p>loading...</p>;
  }
  const columns = tableColumns;
  const data = tableData;
  const classes = useStyles();
  const initialState = initialStateProps || {};
  const { getTableProps, headerGroups, rows, prepareRow, state: { sortBy } } = useTable(
    {
      columns,
      data,
      initialState: { ...initialState },
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

  const sortButton = (
    <div className={classes.sortButton}>
      <img className={classes.sortImageUp} src="/assets/up_sort.svg" alt="up_sort" />
      <img className={classes.sortImageDown} src="/assets/down_sort.svg" alt="down_sort" />
    </div>
  );

  const sortButtonUp = (
    <div className={classes.sortButton}>
      <img
        className={`${classes.sortImageUpWithSelect} ${classes.sortImageUp}`}
        src="/assets/up_sort.svg"
        alt="up_sort"
      />
      <img className={classes.sortImageDown} src="/assets/down_sort.svg" alt="down_sort" />
    </div>
  );

  const sortButtonDown = (
    <div className={classes.sortButton}>
      <img className={classes.sortImageUp} src="/assets/up_sort.svg" alt="up_sort" />
      <img
        className={`${classes.sortImageDownWithSelect} ${classes.sortImageDown}`}
        src="/assets/down_sort.svg"
        alt="down_sort"
      />
    </div>
  );

  const fetchSortButton = (columnData) => {
    if (columnData) {
      const { isSorted, isSortedDesc, canSort } = columnData;
      if (canSort && isSorted) {
        if (isSortedDesc) {
          return sortButtonDown;
        }
        return sortButtonUp;
      }
      if (canSort) {
        return sortButton;
      }
    }
    return '';
  };

  return (
    <Paper className={classes.root}>
      {isLoading ? <LinearProgress variant="query" /> : null }
      <TableContainer className={classes.container} {...getTableProps()}>
        <Table>
          {columnWidth?.length > 0 && (
            <colgroup>
              {columnWidth.map((width) => <col width={`${width}%`} />)}
            </colgroup>
          )}
          <TableHead className={styles.tableHead}>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={column.customStyle ? { ...column.customStyle } : {}}
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
                              {fetchSortButton(column)}
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
              <TableBody className={styles.tableBody}>
                <TableRow>
                  <TableCell colSpan={tableColumns.length}>
                    <p className={styles.noDataText}>No Data Found</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            )
          }
          <TableBody className={styles.tableBody}>
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
            className={styles.pagination}
            rowsPerPageOptions={rowsPerPageOptions || [5, 10, 25, 50]}
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
  initialStateProps: PropTypes.object,
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
  initialStateProps: {},
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
