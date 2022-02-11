import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {
  AutocompleteCustom,
  AdvanceTable,
  CustomeHeader,
  DialogComponent
} from 'app/components';
import RedeemPoints from 'app/containers/loyalty/points/redeemPoint';
import { getPatrons } from 'app/containers/patrons/saga';
import { getBrandLeadPool } from 'app/containers/brands/saga';
import { getPoints, getRewards } from '../saga';
import styles from './styles.scss';
import global from '../../global.scss';
import CreatePoint from './createPoint';

const PointList = (props) => {
  const { pointStatus, customerId, brandId, rewardId } = props;
  const ALL_BRAND = { businessName: 'All Brands' };
  const ALL_CUSTOMERS = { name: 'All Customers' };
  const ALL_REWARDS = { name: 'All Rewards' };
  const [dialogOpen, setDialogOpen] = useState({ open: false, title: null });
  const [dialog, setDialog] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const [totalTableData, setTableData] = useState([]);
  const [brandList, changeBrandList] = useState([ALL_BRAND]);
  const [selectedBrand, changeSelectedBrand] = useState(ALL_BRAND);
  const [customersData, setCustomersData] = useState(ALL_CUSTOMERS);
  const [selectedCustomer, changeSelectedCustomer] = useState(ALL_CUSTOMERS);
  const [rewardList, changeRewardList] = useState(ALL_REWARDS);
  const [selectedReward, changeSelectedReward] = useState(ALL_REWARDS);

  const Columns = [
    { Header: 'Type', accessor: 'type', disableSortBy: true },
    { Header: 'Debit', accessor: 'debitPoint', disableSortBy: true },
    { Header: 'Credit', accessor: 'creditPoint', disableSortBy: true },
    { Header: 'Status', accessor: 'status', disableSortBy: true }
  ];
  const [tableColumnsNew, setTableColumns] = useState(Columns);
  const openDialog = (dialogInfo, title) => {
    setDialog(dialogInfo);
    setDialogOpen({ open: true, title });
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogOpen({ open: false, title: null });
  };

  const queryParam = {
    includes: ['brand', 'customer', 'loyaltyReward'],
    where: {},
    order: { createdAt: 'DESC' }
  };
  const [queryParams, setQueryParams] = useState(queryParam);
  const brandColumn = {
    Header: 'Brand',
    accessor: 'brand.businessName',
    disableSortBy: true
  };
  const customerColumn = {
    Header: 'Customer',
    accessor: 'customer.name',
    disableSortBy: true
  };
  const rewardColumn = {
    Header: 'Reward',
    accessor: 'loyaltyReward.name',
    disableSortBy: true
  };

  useEffect(() => {
    if (brandId) {
      queryParam.where = { brandId };
      queryParam.includes = ['customer', 'loyaltyReward'];
      setQueryParams(queryParam);
      setTableColumns((prevState) => [
        customerColumn,
        rewardColumn,
        ...prevState
      ]);
      fetchData(rowsPerPage, page + 1, queryParam);
    } else if (customerId) {
      queryParam.where = { customerId };
      queryParam.includes = ['brand', 'loyaltyReward'];
      setQueryParams(queryParam);
      setTableColumns((prevState) => [brandColumn, rewardColumn, ...prevState]);
      fetchData(rowsPerPage, page + 1, queryParam);
    } else if (rewardId) {
      queryParam.where = { loyaltyRewardId: rewardId };
      queryParam.includes = ['customer', 'brand'];
      setQueryParams(queryParam);
      setTableColumns((prevState) => [
        brandColumn,
        customerColumn,
        ...prevState
      ]);
      fetchData(rowsPerPage, page + 1, queryParam);
    } else {
      fetchData(rowsPerPage, page + 1);
      setTableColumns((prevState) => [
        brandColumn,
        customerColumn,
        rewardColumn,
        ...prevState
      ]);
    }
  }, [brandId, customerId, rewardId]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (dialogOpen.open && pointStatus === 'success') {
      closeDialog();
      fetchData(rowsPerPage, page + 1);
    }
  }, [pointStatus]);

  const fetchData = (limit, offset, params) => {
    setTableLoading(true);
    const paramsPaylod = {
      ...queryParam,
      take: limit,
      page: offset
    };
    if (!params) {
      if (selectedBrand && selectedBrand.id) paramsPaylod.where.brandId = selectedBrand.id;
      if (selectedCustomer && selectedCustomer.id) paramsPaylod.where.customerId = selectedCustomer.id;
      if (selectedCustomer && selectedCustomer.id) paramsPaylod.where.customerId = selectedCustomer.id;
      if (selectedReward && selectedReward.id) paramsPaylod.where.loyaltyRewardId = selectedReward.id;
    }
    getPoints(params || paramsPaylod).then((res) => {
      setTableData(res.data);
      setDataCount(res.meta.total);
      setTableLoading(false);
    });
  };

  const handleCustomerChange = (val) => {
    if (!val || val.length <= 2) return;
    if (val === ALL_CUSTOMERS.name) {
      setCustomersData([ALL_CUSTOMERS]);
      changeSelectedCustomer(ALL_CUSTOMERS);
      return;
    }
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 5
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomersData([ALL_CUSTOMERS, ...res.data]);
    });
  };

  const handleRewardNameChange = (val) => {
    if (!val || val.length <= 2) return;
    if (val === ALL_REWARDS.name) {
      changeRewardList([ALL_REWARDS]);
      changeSelectedReward(ALL_REWARDS);
      return;
    }
    const query = {
      take: 5,
      page: 1,
      where: { name: { keyword: val } }
    };
    getRewards(query).then((res) => {
      changeRewardList(res.data);
    });
  };

  const handleBrandNameChange = (val) => {
    if (!val || val.length <= 2) return;
    if (val === ALL_BRAND.businessName) {
      changeBrandList([ALL_BRAND]);
      changeSelectedBrand(ALL_BRAND);
      return;
    }
    getBrandLeadPool(
      5,
      undefined,
      val,
      undefined,
      undefined,
      undefined,
      true
    ).then((res) => {
      changeBrandList(res.data);
    });
  };

  const onSearchClick = () => {
    const params = {
      ...queryParam,
      ...queryParams,
      take: rowsPerPage,
      page: 1
    };
    setPage(0);
    if (selectedBrand && selectedBrand.id) params.where.brandId = selectedBrand.id;
    if (selectedCustomer && selectedCustomer.id) params.where.customerId = selectedCustomer.id;
    if (selectedCustomer && selectedCustomer.id) params.where.customerId = selectedCustomer.id;
    if (selectedReward && selectedReward.id) params.where.loyaltyRewardId = selectedReward.id;
    fetchData(undefined, undefined, params);
  };
  const clearFilters = () => {
    changeSelectedBrand(ALL_BRAND);
    changeSelectedReward(ALL_REWARDS);
    changeSelectedCustomer(ALL_CUSTOMERS);
    const params = {
      ...queryParam,
      take: rowsPerPage,
      page: page + 1
    };
    fetchData(rowsPerPage, page, params);
  };

  const toolBarActions = [
    {
      label: 'Redeem Point',
      variant: 'text',
      color: 'default',
      onClick: () => {
        openDialog(
          {
            content: <RedeemPoints brandId={brandId} customerId={customerId} />
          },
          'Redeem Point'
        );
      }
    },
    {
      label: 'Add Point',
      variant: 'text',
      color: 'default',
      onClick: () => {
        openDialog(
          {
            content: <CreatePoint brandId={brandId} customerId={customerId} />
          },
          'Add Point'
        );
      }
    }
  ];

  return (
    <Grid className={styles.wrapper} direction="column">
      <CustomeHeader
        pageName="Points"
        isFilter={false}
        isSearch={false}
        actions={toolBarActions}
      />
      {/* <Grid item={true} className={styles.tableStyle}>
        <ToolbarComponent title="Points" actions={toolBarActions} />
      </Grid> */}

      <Grid
        className={styles.marginContainer}
        item={true}
        justify="space-between"
        direction="row"
        container={true}
      >
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
        {!customerId && (
          <Grid item={true} md={3}>
            <AutocompleteCustom
              options={customersData}
              selector="name"
              label="Customer Name"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedCustomer(selected)}
              selectedOption={selectedCustomer}
              debouncedInputChange={handleCustomerChange}
              inputValue={ALL_CUSTOMERS}
            />
          </Grid>
        )}
        <Grid item={true} md={brandId || customerId ? 3 : 2} lg={3}>
          <AutocompleteCustom
            options={rewardList || []}
            selector="name"
            label="Reward *"
            isArray={false}
            handleSelectedOption={(e, selected) => changeSelectedReward(selected)}
            selectedOption={selectedReward}
            debouncedInputChange={handleRewardNameChange}
          />
        </Grid>
        <Grid
          item={true}
          lg={brandId || customerId ? 4 : 3}
          md={brandId || customerId ? 5 : 4}
          className={styles.searchBtnContainer}
          container={true}
          justify="flex-end"
        >
          <Button className={global.primaryCTA} onClick={onSearchClick}>Search</Button>
          <Button className={global.primaryCTA} onClick={clearFilters}> Clear Filters</Button>
        </Grid>
      </Grid>
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          tableColumns={tableColumnsNew}
          fetchNextData={(limit, offset, newValue) => fetchData(limit, newValue + 1)}
          isLoading={isTableLoading}
          rowsPerPage={rowsPerPage}
          currentPage={page}
          totalCount={totalDataCount}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          setPage={(pageNo) => setPage(pageNo)}
          tableData={totalTableData}
          isStatusCheckboxRequired={false}
        />
      </Grid>
      {dialogOpen.open && (
        <DialogComponent
          onClose={closeDialog}
          title={dialogOpen.title}
        >
          {dialog && dialog.content}
        </DialogComponent>
      )}
    </Grid>
  );
};

PointList.propTypes = {
  pointStatus: PropTypes.string,
  customerId: PropTypes.string,
  rewardId: PropTypes.string,
  brandId: PropTypes.string
};

PointList.defaultProps = {
  pointStatus: null,
  customerId: null,
  rewardId: null,
  brandId: null
};

export default PointList;
