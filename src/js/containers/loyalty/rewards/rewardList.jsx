import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import {
  AutocompleteCustom,
  DialogComponent,
  AdvanceTable,
  CustomeHeader
} from 'app/components';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';
import StopIcon from '@material-ui/icons/Stop';
import { formatDateStandard, decodeParams } from 'app/utils/utils';
import { getBrandLeadPool } from 'app/containers/brands/saga';
import styles from './styles.scss';
import global from '../../global.scss';

import CreateReward from './createReward';
import ChangeRewardStatus from './changeRewardStatus';

const RewardList = (props) => {
  const {
    getRewards,
    brandId,
    createRewardStatus,
    updateRewardStatus,
    rewardStatusUpdateStatus
  } = props;

  const history = useHistory();
  const ALL_BRAND = { businessName: 'All Brands' };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog, setDialog] = useState();
  const [queryParams, setQueryParams] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableRows, setTableData] = useState([]);
  const [brandList, changeBrandList] = useState([ALL_BRAND]);
  const [selectedBrand, changeSelectedBrand] = useState(ALL_BRAND);
  const [selectedReward, changeSelectedReward] = useState('');
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');

  const brandColumn = {
    Header: 'Brand',
    accessor: 'brand.businessName',
    disableSortBy: true
  };

  const btnClickHandler = (title, status, id) => {
    openDialog({
      title,
      content: <ChangeRewardStatus status={status} rewardId={id} />
    });
  };
  const defaultTableColumns = [
    { Header: 'Name', accessor: 'name', disableSortBy: false },
    { Header: 'Points', accessor: 'points', disableSortBy: false },
    {
      Header: 'Expire At',
      accessor: 'expireAt',
      disableSortBy: false,
      Cell: (row) => formatDateStandard(row.value)
    },
    { Header: '# Code', accessor: 'noOfCode', disableSortBy: true },
    { Header: '# Redeem', accessor: 'noOfRedeem', disableSortBy: true },
    { Header: 'Status', accessor: 'status', disableSortBy: true },
    {
      Header: 'Actions',
      accessor: 'id',
      disableSortBy: true,
      Cell: (row) => (
        <Grid container={true}>
          <Grid item={true}>
            <Tooltip title="Edit Reward">
              <IconButton
                onClick={() => history.push(`/loyalty/rewards/${row.value}`)}
              >
                <EditIcon />
                {' '}
              </IconButton>
            </Tooltip>
          </Grid>

          {row.row.original.status === 'Draft' && (
            <Grid item={true}>
              <Tooltip title="Edit Status">
                <IconButton
                  onClick={() => btnClickHandler('Publish Reward', 'Published', row.value)}
                >
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {row.row.original.status === 'Published' && (
            <Grid item={true}>
              <Tooltip title="Unpublish">
                <IconButton
                  onClick={() => btnClickHandler('Unpublish Reward', 'Expired', row.value)}
                >
                  <StopIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      )
    }
  ];
  const [tableColumns, setTableColumns] = useState(defaultTableColumns);

  const openDialog = (dialogInfo) => {
    setDialog(dialogInfo);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogOpen(false);
  };

  const queryParam = {
    take: rowsPerPage,
    page: page + 1,
    where: {},
    includes: 'brand',
    order: { createdAt: 'DESC' }
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      name: 'name',
      points: 'points',
      expireAt: 'expireAt'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      fetchData(rowsPerPage, page + 1, { ...queryParam, order: { [key]: isDesc } });
    }
  };

  useEffect(() => {
    const mData = decodeParams();
    changeSelectedReward(mData?.q || '');
    if (brandId) {
      queryParam.where = { brandId };
      setQueryParams(queryParam);
    } else {
      queryParam.includes = 'brand';
      setQueryParams(queryParam);
      setTableColumns([brandColumn, ...defaultTableColumns]);
    }
    if (mData?.q) queryParam.where.name = { keyword: mData?.q };
    if (getRewards) fetchData(rowsPerPage, page + 1, queryParam);
  }, []);

  useEffect(() => {
    if (
      dialogOpen
      && (createRewardStatus === 'success'
        || updateRewardStatus === 'success'
        || rewardStatusUpdateStatus === 'success')
    ) {
      closeDialog();
      fetchData(rowsPerPage, page + 1);
    }
  }, [createRewardStatus, updateRewardStatus, rewardStatusUpdateStatus]);

  const fetchData = (limit, offset, params) => {
    queryParams.take = limit;
    queryParams.page = offset;
    if (queryParams?.order) {
      queryParams.order = { [currentColumnSortBy]: currentSortBy };
    }
    setTableLoading(true);
    getRewards(params || queryParams).then((res) => {
      setTableData(res.data);
      setTotalCount(res.meta.total);
      setTableLoading(false);
    });
  };

  const handleBrandNameChange = (val) => {
    if (!val || val.length <= 2) return;
    if (val === ALL_BRAND.businessName) {
      changeBrandList([ALL_BRAND]);
      changeSelectedBrand(ALL_BRAND);
      return;
    }
    getBrandLeadPool(5, undefined, val, undefined, undefined, undefined, true).then((res) => {
      changeBrandList(res.data);
    });
  };

  const onSearchClick = (value) => {
    const query = {
      ...queryParam,
      take: rowsPerPage,
      page: page + 1,
      order: { [currentColumnSortBy]: currentSortBy }
    };
    if (selectedBrand) query.where.brandId = selectedBrand.id;
    changeSelectedBrand(selectedBrand);
    if (value || selectedReward) query.where.name = { keyword: value || selectedReward };
    fetchData(rowsPerPage, page + 1, query);
  };
  const clearFilters = () => {
    changeSelectedBrand(ALL_BRAND);
    // changeSelectedReward('');
    fetchData(rowsPerPage, page + 1);
  };
  const toolbarActions = [
    {
      label: 'Create Reward',
      variant: 'text',
      color: 'default',
      onClick: () => {
        openDialog({
          title: `Create Reward`,
          content: <CreateReward brandId={brandId} />
        });
      }
    }
  ];

  const inputEnterHandler = (e) => {
    if (e.key === 'Enter') {
      const query = {
        ...queryParam,
        take: rowsPerPage,
        page: page + 1,
        order: { [currentColumnSortBy]: currentSortBy }
      };
      if (selectedBrand) query.where.brandId = selectedBrand.id;
      changeSelectedBrand(selectedBrand);
      if (selectedReward) query.where.name = { keyword: selectedReward };
      fetchData(rowsPerPage, page + 1, query);
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', inputEnterHandler);
    return () => document.removeEventListener('keyup', inputEnterHandler);
  });

  const onClearSearchClick = () => {
    changeSelectedReward('');
    fetchData(rowsPerPage, page + 1);
  };

  return (
    <Grid className={styles.wrapper} direction="column">
      <CustomeHeader
        pageName="Rewards"
        isFilter={false}
        searchValue={selectedReward}
        searchValueHendler={changeSelectedReward}
        searchHendler={onSearchClick}
        searchClearHendler={onClearSearchClick}
        actions={toolbarActions}
      />
      <Grid className={styles.marginContainer} item={true} direction="row" container={true}>
        {/* <Grid item={true} xs={3}>
            <Input
              isFieldValue={false}
              label="Name"
              propValue={selectedReward}
              onValueChange={(val) => changeSelectedReward(val)}
            />
          </Grid> */}
        {!brandId && (
          <Grid item={true} md={3}>
            <AutocompleteCustom
              options={brandList || []}
              selector="businessName"
              label="Brand"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedBrand(selected)}
              selectedOption={selectedBrand}
              debouncedInputChange={handleBrandNameChange}
            />
          </Grid>
        )}

        {!brandId && (
          <Grid item={true} md={4} lg={3}>
            <Button className={global.primaryCTA} onClick={onSearchClick}>Search</Button>
            <Button className={global.primaryCTA} onClick={clearFilters}> Clear Filters</Button>
          </Grid>
        )}
      </Grid>
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          isLoading={tableLoading}
          tableData={tableRows}
          fetchNextData={(limit, offset, newPage) => fetchData(limit, newPage + 1)}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isStatusCheckboxRequired={false}
          tableColumns={tableColumns}
          totalCount={totalCount}
          onChangeSort={onChangeSort}
        />
      </Grid>
      {dialogOpen && (
        <DialogComponent onClose={closeDialog} title={dialog && dialog.title}>
          {dialog && dialog.content}
        </DialogComponent>
      )}
    </Grid>
  );
};

RewardList.propTypes = {
  createRewardStatus: PropTypes.string,
  updateRewardStatus: PropTypes.string,
  rewardStatusUpdateStatus: PropTypes.string,
  getRewards: PropTypes.func,
  brandId: PropTypes.string
};

RewardList.defaultProps = {
  createRewardStatus: null,
  updateRewardStatus: null,
  rewardStatusUpdateStatus: null,
  getRewards: () => {},
  brandId: null
};

export default RewardList;
