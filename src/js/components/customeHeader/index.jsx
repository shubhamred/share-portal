/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { decodeParams } from 'app/utils/utils';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
  IconButton,
  NativeSelect,
  InputBase
} from '@material-ui/core';
import { debounce } from 'lodash';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import FilterProvider from '../../containers/shared/filter';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid #c6d1dd80',
    fontSize: 16,
    padding: '12px 26px 12px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  mainRoot: {
    alignItems: 'center',
    padding: '15px 24px'
  },
  pageNameContainer: {
    color: '#212529',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '22px',
    whiteSpace: 'nowrap'
  },
  filterContainer: {
    paddingLeft: '70px',
    alignItems: 'center'
  },
  margin: {
    margin: theme.spacing(1)
  },
  textField: {
    width: '100%'
  },
  button: {
    minWidth: '97px',
    padding: '10px 20px',
    backgroundColor: '#5064E2',
    color: '#fff',
    border: 'none',
    fontSize: '15px',
    margin: '0 10px',
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#5064E2',
      opacity: '0.9'
    }
  },
  inputHeight: {
    height: '45px',
    '& fieldset': {
      border: '1px solid #c6d1dd80 !important',
      '&:hover': {
        border: '1px solid #c6d1dd80 !important'
      },
      '&:active': {
        border: '1px solid #c6d1dd80 !important'
      }
    }
  },
  filterButton: {
    color: '#1518AF',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px',
    padding: '7px 16px'
  },
  buttonMargin: {
    margin: '10px 20px'
  },
  filtersApplied: {
    display: 'flex',
    paddingTop: '10px',
    alignIems: 'center'
  },
  filterHeading: {
    color: '#212529',
    fontSize: '16px',
    fontWeight: '600',
    paddingRight: '14px'
  },
  filterInnerHeading: {
    color: '#212529',
    fontSize: '14px',
    paddingRight: '6px'
  },
  filterInnerSperator: {
    color: '#212529b3',
    paddingRight: '6px',
    fontSize: '14px'
  },
  filterInnerValue: {
    color: '#212529',
    fontSize: '14px'
  },
  filterValue: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '20px'
  },
  filterTextButton: {
    color: '#1518AF',
    fontWeight: '600',
    fontSize: '16px',
    paddingRight: '12px',
    cursor: 'pointer'
  }
}));

function Index(props) {
  const [FilteredItem, setFilteredItem] = useState([]);
  const history = useHistory();
  const { hash } = history?.location || {};
  const {
    pageName,
    searchHendler,
    searchClearHendler,
    searchValue,
    searchValueHendler,
    actions,
    isFilter,
    isSearch,
    filterStyle,
    FilterData,
    isStatusBox,
    statusList,
    statusListValue,
    statusListChangeHendler,
    filterHendler,
    customColumns
  } = props;
  const classes = useStyles();
  const debounceHandle = useCallback(
    debounce((value) => {
      const mData = decodeParams();
      mData.q = value.trim();
      const qs = Object.keys(mData)
        .map((key) => `${key}=${mData[key]}`)
        .join('&');
      history.push({
        search: qs,
        hash
      });
      searchHendler(value);
    }, 500),
    []
  );

  let filterButtons = isFilter && actions && actions.length;

  if (!filterButtons) {
    filterButtons = actions.length > 1;
  }

  const onlyButtons = !isFilter && actions.length > 1;

  const passURIFinction = async (data) => {
    setFilteredItem(data);
    let objs = {};

    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      if (element?.value?.length) {
        objs = { ...objs, [element.key]: element.value.toString() };
      }
      if (element?.isSearchable) {
        objs = { ...objs, [element.searchKey]: element.search.toString() };
      }
    }

    const mData = decodeParams();
    const payload = {
      q: mData?.q || '',
      ...objs
    };

    const qs = Object.keys(payload)
      .map((key) => `${key}=${payload[key]}`)
      .join('&');
    filterHendler(qs);
    history.push({
      search: qs,
      hash
    });
  };

  let filters = false;
  for (let index = 0; index < FilteredItem.length; index += 1) {
    const element = FilteredItem[index];
    if (element?.value?.length > 0) {
      filters = true;
    }
  }

  return (
    <Grid
      className={classes.mainRoot}
      item={true}
      justify="space-between"
      direction="row"
      container={true}
    >
      <Grid item={true} sm={1} md={1} lg={1} className={classes.pageNameContainer}>
        {pageName}
      </Grid>
      {isStatusBox && (
        <Grid item={true} sm={3} md={3} lg={2}>
          <NativeSelect
            id="demo-customized-select-native"
            value={statusListValue}
            onChange={({ target }) => {
              statusListChangeHendler(target.value);
            }}
            input={<BootstrapInput />}
          >
            <option value="">All status</option>
            {statusList?.map((item) => (
              <option value={item.value}>{item.label}</option>
            ))}
          </NativeSelect>
        </Grid>
      )}
      <Grid item={true} sm={isStatusBox ? 3 : 6} md={isStatusBox ? 4 : 7} lg={customColumns ? customColumns.left : isStatusBox ? 6 : 8}>
        {isSearch ? (
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
            <OutlinedInput
              className={classes.inputHeight}
              id="outlined-adornment-weight"
              value={searchValue}
              autoComplete="off"
              onChange={({ target }) => {
                debounceHandle(target.value);
                searchValueHendler(target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#7B8395' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="start">
                  {searchValue && (
                    <CloseIcon
                      style={{ color: '#7B8395', cursor: 'pointer' }}
                      onClick={() => {
                        debounceHandle('');
                        searchClearHendler();
                      }}
                    />
                  )}
                </InputAdornment>
              }
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                'aria-label': 'search'
              }}
              labelWidth={0}
            />
          </FormControl>
        ) : null}
      </Grid>
      <Grid item={true} sm={5} md={4} lg={customColumns ? customColumns.right : 3}>
        <Grid
          item={true}
          className={`${!onlyButtons ? classes.filterContainer : ''}`}
          justify={filterButtons && !onlyButtons ? 'space-between' : 'flex-end'}
          container={true}
          style={filterStyle}
        >
          {isFilter ? (
            <FilterProvider
              type="DRAWER"
              customFilterData={FilterData}
              onApplyFilter={(data) => {
                passURIFinction(data);
              }}
            >
              <Button className={classes.filterButton} onClick={() => {}} type="button">
                Add filters
              </Button>
            </FilterProvider>
          ) : null}
          {actions && actions.length
            ? actions.map((action) => {
              if (action.component) {
                return <div className={classes.buttonMargin}>{action.component}</div>;
              }
              if (action.icon) {
                return (
                  <IconButton
                    onClick={action.onClick}
                    aria-label={action.label}
                    className={classes.button}
                    {...action.otherProps}
                  >
                    {action.icon}
                  </IconButton>
                );
              }
              return (
                <Button
                  className={classes.button}
                  onClick={action.onClick}
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  {...action.otherProps}
                >
                  {action.label}
                </Button>
              );
            })
            : null}
        </Grid>
      </Grid>
      {filters && false && (
        <Grid item={true} sm={12} className={classes.filtersApplied}>
          <Grid className={classes.filterHeading}>Applied filters</Grid>
          {FilteredItem.map((list) => (
            <Grid className={classes.filterValue}>
              <Grid className={classes.filterInnerHeading}>{list.name}</Grid>
              <Grid className={classes.filterInnerSperator}>in</Grid>
              <Grid className={classes.filterInnerValue}>{list.value.toString()}</Grid>
            </Grid>
          ))}
          <Grid className={classes.filterTextButton}>Clear</Grid>
          <Grid className={classes.filterTextButton}>Edit Filters</Grid>
        </Grid>
      )}
    </Grid>
  );
}

Index.propTypes = {
  isFilter: PropTypes.bool,
  isSearch: PropTypes.bool,
  isStatusBox: PropTypes.bool,
  pageName: PropTypes.string,
  searchHendler: PropTypes.func,
  statusListValue: PropTypes.string,
  statusListChangeHendler: PropTypes.func,
  searchClearHendler: PropTypes.func,
  searchValueHendler: PropTypes.func,
  filterHendler: PropTypes.func,
  searchValue: PropTypes.string,
  statusList: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(PropTypes.object),
  FilterData: PropTypes.arrayOf(PropTypes.object),
  filterStyle: PropTypes.shape({})
};

Index.defaultProps = {
  isFilter: true,
  isSearch: true,
  isStatusBox: false,
  pageName: 'Page Name',
  statusListValue: '',
  statusListChangeHendler: () => {},
  searchHendler: () => {},
  searchClearHendler: () => {},
  filterHendler: () => {},
  searchValueHendler: () => {},
  searchValue: '',
  actions: [],
  statusList: [],
  FilterData: [],
  filterStyle: {}
};

export default Index;
