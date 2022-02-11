/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import { map as lodashMap, extend, find, pick, uniq, groupBy } from 'lodash';
import { formatDateStandard, formatCurrency } from 'app/utils/utils';
import { getPatrons } from 'app/containers/patrons/saga';
import {
  AdvanceTable,
  AutocompleteCustom,
  // Button,
  CustomeHeader,
  CustomCheckBox,
  DialogComponent
} from 'app/components';
import { getBrandLeadPoolNew } from 'app/containers/brands/saga';
import { getDealLeadPool, getInvestmentStatuses } from '../saga';
import styles from './styles.scss';
import global from '../../global.scss';
import CreateInvestment from './createInvestment';
import UpdateInvestment from './updateInvestment';
import ChangeInvestmentStatus from './changeInvestmentStatus';

// eslint-disable-next-line react/no-multi-comp
const InvestmentList = (props) => {
  const ALL_DEALS = { name: 'All Deals' };
  const ALL_CUSTOMERS = { name: 'All Patron' };
  const ALL_STATUS = 'All status';
  const {
    getInvestments,
    customerList,
    dealId,
    customerId,
    // eslint-disable-next-line no-unused-vars
    createInvestmentStatus,
    updateInvestmentStatus,
    investmentStatusUpdateStatus,
    patronCode,
    investmentType
  } = props;
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [Statuses, setStatuses] = useState(false);
  const [dialog, setDialog] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableRows, setTableData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
  const [customersData, setCustomersData] = useState(customerList || []);
  const [selectedCustomer, changeSelectedCustomer] = useState(ALL_CUSTOMERS);
  const [selectedDeal, changeSelectedDeal] = useState(ALL_DEALS);
  const [selectedStatus, changeSelectedStatus] = useState(ALL_STATUS);
  const [dealList, changeDealList] = useState([]);
  const [investmentStatues, setInvestmentStatuses] = useState([]);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');
  const statusOptions = [ALL_STATUS, ...Object.keys(investmentStatues)];
  const [allChecked, toggleAllCheckbox] = useState(false);
  const [selectedRowIDs, setSelectedRows] = useState([]);
  const [showSearch, setSearch] = useState({
    showDealSearch: true,
    showCustomerSearch: true
  });

  const handleCentralCheckbox = (val) => {
    toggleAllCheckbox(val);
  };

  const handleCheckChange = (checked, id, status) => {
    if (checked && !selectedRowIDs.includes((list) => list.id)) {
      setSelectedRows([...selectedRowIDs, { id, status }]);
    } else {
      const IDs = [...selectedRowIDs];
      IDs.splice(IDs.findIndex((list) => list.id === id), 1);
      setSelectedRows(IDs);
    }
  };

  useEffect(() => {
    if (allChecked && tableRows?.length > 0) {
      setSelectedRows(tableRows.map((row) => ({ id: row.id, status: row.status })));
    } else {
      setSelectedRows([]);
    }
  }, [allChecked]);

  const openDialog = (dialogInfo) => {
    setDialog(dialogInfo);
    setDialogOpen(true);
  };

  const openStatusDialog = () => {
    if (selectedRowIDs.length) {
      const idArray = selectedRowIDs.map((list) => list.id);
      const statusGroup = groupBy(selectedRowIDs, 'status');
      if (Object.keys(statusGroup).length === 1) {
        openDialog({
          title: `Update Detail`,
          content: (
            <ChangeInvestmentStatus
              investmentDetail={{ status: selectedRowIDs[0].status }}
              investmentId={idArray}
            />
          )
        });
      } else {
        dispatch({
          type: 'show',
          payload: 'Unable to move Patrons to the next status. Please select the Patrons which are in the same status.',
          msgType: 'error'
        });
      }
    }
  };

  useEffect(() => {
    getInvestmentStatuses().then((res) => {
      if (res.data) {
        setInvestmentStatuses(res.data);
      }
    });
  }, []);

  const dealField = {
    Header: 'Deal Name',
    accessor: 'deal.name',
    disableSortBy: true,
    Cell: (row) => (
      <Link to={`/deals/${row.row.original.dealId}`} component={RouterLink}>
        {row.value}
      </Link>
    )
  };

  const getKycTag = (row = {}) => {
    if (row.companyCode) {
      return (
        <div className={`${styles.kycLabel} ${!row.profileCompleted ? styles.kycPending : ''}`}>
          {!row.profileCompleted ? 'KYC pending' : ''}
        </div>
      );
    }
    return (
      <div className={`${styles.kycLabel} ${!row.profileCompleted ? styles.kycPending : ''}`}>
        {!row.profileCompleted ? 'KYC pending' : ''}
      </div>
    );
  };

  const getRedirectURL = (row = {}) => {
    if (row.companyCode) {
      return `/companies/${row.entityId}`;
    }
    return `/patrons/${row.customerId}`;
  };

  const customerField = [
    {
      Header: 'Customer Name',
      accessor: 'customerId',
      disableSortBy: true,
      Cell: (row) => (
        <div className={styles.customerWrapper}>
          <Link to={getRedirectURL(row?.row?.original)} component={RouterLink}>
            {row?.row?.original.name}
          </Link>
          {getKycTag(row.row.original)}
        </div>
      )
    }
    // {
    //   Header: 'KYC Completed',
    //   accessor: 'profileCompleted',
    //   disableSortBy: true,
    //   Cell: (row) => (row.value ? 'Completed' : 'Not Completed')
    // }
  ];
  const checkboxField = [
    {
      Header: <CustomCheckBox defaultChecked={allChecked} indeterminate={true} onChange={handleCentralCheckbox} />,
      accessor: 'selection',
      customStyle: { maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <CustomCheckBox
          onChange={(val) => handleCheckChange(val, row.row?.original.id, row.row?.original.status)}
          defaultChecked={selectedRowIDs.findIndex((list) => list.id === row.row?.original.id) >= 0}
        />)
    }
  ];
  const tableColumnsNew = [
    {
      Header: 'Investment Type',
      accessor: 'investmentType',
      disableSortBy: true
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      disableSortBy: false,
      Cell: (row) => row.value && formatCurrency(row.value)
    },
    {
      Header: 'Investment Fee (%)',
      accessor: 'feePercentage',
      disableSortBy: true,
      Cell: (row) => (typeof row.value === 'number' && `${row.value}%`) || '-'
    },
    {
      Header: 'Investment Tax (%)',
      accessor: 'taxPercentage',
      disableSortBy: true,
      Cell: (row) => (typeof row.value === 'number' && `${row.value}%`) || '-'
    },
    {
      Header: 'Requested At',
      accessor: 'createdAt',
      disableSortBy: false,
      Cell: (row) => formatDateStandard(row.value)
    },
    { Header: 'Status', accessor: 'status', disableSortBy: true },
    {
      Header: 'Risk Accepted',
      accessor: 'riskAcceptance',
      disableSortBy: true,
      Cell: (row) => (row.value ? 'Yes' : 'No')
    },
    {
      Header: 'Actions',
      accessor: 'id',
      disableSortBy: true,
      Cell: (row) => (
        <Grid container={true}>
          <Grid item={true} xs={6}>
            <IconButton aria-label="Edit" style={{ padding: 0 }}>
              <EditIcon
                onClick={() => openDialog({
                  title: `Update Investment`,
                  content: <UpdateInvestment investmentId={row.value} />
                })}
              />
            </IconButton>
          </Grid>
          <Grid item={true} xs={6}>
            <IconButton aria-label="Launch Actions" style={{ padding: 0 }}>
              <LaunchIcon
                onClick={() => openDialog({
                  title: `Update Detail`,
                  content: (
                    <ChangeInvestmentStatus
                      investmentDetail={row.row.original}
                      investmentId={row.value}
                    />
                  )
                })}
              />
            </IconButton>
          </Grid>
        </Grid>
      )
    }
  ];
  const [tableColumns, setTableColumns] = useState(tableColumnsNew);
  const queryParam = {
    order: { [currentColumnSortBy]: currentSortBy },
    where: {}
  };
  const [queryParams, setQueryParams] = useState(queryParam);
  useEffect(() => {
    if (dealId) {
      queryParam.where = { dealId };
      setQueryParams(queryParam);
      setTableColumns((prevState) => [...customerField, ...prevState]);
      setSearch({ showCustomerSearch: true, showDealSearch: false });
    } else if (customerId) {
      if (investmentType === 'Company') {
        queryParam.where.investmentType = 'Company';
        queryParam.where.companyCode = patronCode;
      }
      if (investmentType === 'Patron') {
        queryParam.where.investmentType = 'Individual';
        queryParam.where.patronCode = patronCode;
      }
      setTableColumns((prevState) => [dealField, ...prevState]);
      queryParam.includes = ['deal'];
      setQueryParams(queryParam);
      setSearch({ showCustomerSearch: false, showDealSearch: true });
    } else {
      setTableColumns((prevState) => [dealField, ...customerField, ...prevState]);
      queryParam.includes = ['deal'];
      setQueryParams(queryParam);
    }
  }, []);

  useEffect(() => {
    queryParams.take = rowsPerPage;
    queryParams.page = page + 1;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    if (getInvestments) getTableData(queryParams);
  }, []);

  useEffect(() => {
    if (
      dialogOpen
      && (createInvestmentStatus === 'success'
        || updateInvestmentStatus === 'success'
        || investmentStatusUpdateStatus === 'success')
    ) {
      closeDialog();
    }
  }, [createInvestmentStatus, updateInvestmentStatus, investmentStatusUpdateStatus]);

  const fetchData = (limit, offset, order) => {
    queryParams.take = limit;
    queryParams.page = offset + 1;
    queryParams.where = {};
    if (selectedCustomer && selectedCustomer.id) queryParams.where.customerId = selectedCustomer.id;
    if (selectedDeal && selectedDeal.id) queryParams.where.dealId = selectedDeal.id;
    if (selectedStatus && selectedStatus !== ALL_STATUS) queryParams.where.status = selectedStatus;
    if (customerId) queryParams.where.customerId = customerId;
    if (dealId) queryParams.where.dealId = dealId;
    queryParams.order = order || { [currentColumnSortBy]: currentSortBy };
    getTableData(queryParams);
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      createdAt: 'createdAt',
      amount: 'amount'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      fetchData(rowsPerPage, page, { [key]: isDesc });
    }
  };

  const fetchCompanies = (
    perPage,
    currentpage,
    brandname,
    selectedstatus,
    companyCode = [],
    mergedList = []
  ) => {
    const query = {
      limit: perPage,
      offset: currentpage + 1,
      keyword: brandname,
      status: selectedstatus,
      fields: 'businessName,companyCode,id,kycCompleted',
      whereQuery: { companyCode: companyCode?.length ? { in: [...companyCode] } : [] }
    };
    getBrandLeadPoolNew(query).then((res) => {
      if (res.data) {
        const companyListData = res.data || [];
        const tempRecordData = [...mergedList];
        // eslint-disable-next-line no-unused-expressions
        companyListData?.map((item) => {
          const entityCodeIndex = tempRecordData.findIndex((record) => item.companyCode === record.companyCode);
          if (entityCodeIndex > -1) {
            tempRecordData[entityCodeIndex] = {
              ...tempRecordData[entityCodeIndex],
              name: item.businessName,
              profileCompleted: item.kycCompleted,
              entityId: item.id
            };
          }
        });
        setTableData(tempRecordData || []);
      }
    }).catch(() => {
    });
  };

  const getTableData = (params) => {
    setTableLoading(true);
    getInvestments(params).then(async (res) => {
      if (res.data) {
        if (!res.data.length) {
          setTableData([]);
          setSelectedRows([]);
          setTotalCount(0);
          setTableLoading(false);
          setInsightsData([]);
          return;
        }
        const customersIdsArr = uniq(res.data.map((cus) => cus.customerId)).filter((id) => id);
        const companyCodeArr = uniq(res.data.map((cus) => cus.companyCode)).filter((code) => code);

        const customerParams = {
          fields: 'name,firstName,lastName,id,profileCompleted',
          where: {
            id: {
              in: customersIdsArr
            },
            isPatron: true
          },
          take: params.take
        };
        const cusData = await getPatrons(customerParams);
        if (cusData?.data) {
          const mergedList = lodashMap(res.data, (item) => extend(
            item,
            pick(find(cusData.data, { id: item.customerId }), ['name', 'profileCompleted'])
          ));
          setTableData(mergedList);
          setSelectedRows([]);
          setTotalCount(res.meta.total);
          setTableLoading(false);
          setInsightsData(res.insights);
        }
        fetchCompanies(25, 0, '', undefined, companyCodeArr, res.data);
      }
    });
  };

  const onSearchClick = () => {
    fetchData(rowsPerPage, page);
  };

  const clearFilters = () => {
    changeSelectedDeal(ALL_DEALS);
    changeSelectedCustomer(ALL_CUSTOMERS);
    changeSelectedStatus(ALL_STATUS);
    queryParams.take = rowsPerPage;
    queryParams.page = page + 1;
    queryParams.where = {};
    if (customerId) queryParams.where.customerId = customerId;
    if (dealId) queryParams.where.dealId = dealId;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    getTableData(queryParams);
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogOpen(false);
    setTableLoading(true);
    setTimeout(() => {
      onSearchClick();
    }, 500);
  };

  const handleCustomerChange = (val) => {
    if (!val || val.length <= 2) return;
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 10
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomersData([ALL_CUSTOMERS, ...res.data]);
    });
  };
  const handleDealNameChange = (val) => {
    if (!val || val.length <= 2) return;
    getDealLeadPool(10, undefined, undefined, undefined, undefined, val).then((res) => {
      changeDealList([ALL_DEALS, ...res.data]);
    });
  };

  useEffect(() => {
    getDealLeadPool(10).then((res) => {
      changeDealList([ALL_DEALS, ...res.data]);
    });
    const customerQueryParams = {
      take: 10,
      where: { isPatron: true }
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomersData([ALL_CUSTOMERS, ...res.data]);
    });
  }, []);

  const toolBarActions = [
    {
      label: 'Create Investment',
      variant: 'text',
      color: 'default',
      onClick: () => {
        openDialog({
          title: `Create Investment`,
          content: <CreateInvestment dealId={dealId} />
        });
      }
    }
  ];

  const isSearch = showSearch.showDealSearch || showSearch.showCustomerSearch;

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="Deal Investments"
        isFilter={false}
        isSearch={false}
        actions={toolBarActions}
      />

      <Grid
        className={styles.marginContainer}
        item={true}
        justify="space-between"
        direction="row"
        container={true}
      >
        {showSearch.showDealSearch && (
          <Grid item={true} sm={3} md={3}>
            <AutocompleteCustom
              options={dealList || []}
              selector="name"
              label="Deal Name"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedDeal(selected)}
              selectedOption={selectedDeal}
              debouncedInputChange={handleDealNameChange}
              inputValue={ALL_DEALS}
            />
          </Grid>
        )}
        {showSearch.showCustomerSearch && (
          <Grid item={true} sm={3} md={3}>
            <AutocompleteCustom
              options={customersData}
              selector="name"
              label="Patron Name"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedCustomer(selected)}
              selectedOption={selectedCustomer}
              debouncedInputChange={handleCustomerChange}
              inputValue={ALL_CUSTOMERS}
            />
          </Grid>
        )}
        <Grid item={true} sm={2} md={2} lg={3} style={{ alignSelf: 'flex-end' }}>
          <FormControl variant="outlined" style={{ width: '100%' }}>
            <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              className={global.selectboxHeight}
              value={selectedStatus}
              onChange={({ target: { value } }) => changeSelectedStatus(value)}
              label="Status"
            >
              {statusOptions.map((statusOption) => (
                <MenuItem key={statusOption} value={statusOption}>
                  {' '}
                  {statusOption}
                  {' '}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item={true}
          sm={4}
          lg={isSearch ? 3 : 2}
          md={isSearch ? 4 : 3}
          className={styles.searchBtnContainer}
          container={true}
          justify="flex-end"
        >
          <Button className={global.primaryCTA} onClick={onSearchClick}>Search</Button>
          <Button className={global.primaryCTA} onClick={clearFilters}> Clear Filters</Button>
        </Grid>
      </Grid>

      <Grid container={true} item={true} className={styles.marginContainer}>
        <Grid item={true} className={styles.statusesBtn} onClick={() => setStatuses(!Statuses)}>
          Statuses
          <ExpandMoreIcon className={Statuses ? styles.statusesBtnIcon1 : styles.statusesBtnIcon2} />
        </Grid>
        <Grid item={true} container={true} className={Statuses ? styles.statusesContainer : styles.statusesContainerNone}>
          {insightsData.map((insights) => (
            <Grid className={styles.cardCustomSpacing}>
              <Card className={styles.cardCustoms}>
                <CardContent className={styles.cardContainer}>
                  <Grid item={true} xs={12} md={12} direction="column">
                    <Typography className={styles.cardCustomHeading}>
                      {insights.status}
                    </Typography>
                  </Grid>
                  <Grid container={true} spacing={3}>
                    <Grid item={true} xs={12} md={6} direction="column">
                      <Typography variant="body1" className={styles.cardCustomSubValue}>
                        {insights.count}
                      </Typography>
                      <Typography variant="body1" className={styles.cardCustomSubheading}>
                        Patrons
                      </Typography>
                    </Grid>
                    <Grid item={true} xs={12} md={6} direction="column">
                      <Typography
                        title={formatCurrency(insights.amount, 'INR')}
                        variant="body1"
                        className={styles.cardCustomSubValue}
                      >
                        {formatCurrency(insights.amount, 'INR')}
                      </Typography>
                      <Typography variant="body1" className={styles.cardCustomSubheading}>
                        Amount
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item={true} className={global.tableStyle}>
        <Grid container={true} className={styles.statusesBtn}>
          <Grid item={true} sm={6}>
            {investmentType === 'Company' ? `Entity Investments` : `Patron Investments`}
          </Grid>
          <Grid item={true} sm={6} className={styles.statusContainer}>
            <Button
              className={styles.cta}
              onClick={openStatusDialog}
              disabled={!selectedRowIDs.length}
            >
              Change Status
            </Button>
          </Grid>
        </Grid>
        <AdvanceTable
          fetchNextData={(limit, offset, newValue) => fetchData(limit, newValue)}
          tableColumns={[...checkboxField, ...tableColumns]}
          tableData={tableRows}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          columnWidth={[5, 25, 15, 10, 10, 10, 10, 20]}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isStatusCheckboxRequired={false}
          handleRowClick={() => {}}
          isLoading={tableLoading}
          onChangeSort={onChangeSort}
          initialStateProps={{
            sortBy: [
              {
                id: 'createdAt',
                desc: true
              }
            ]
          }}
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

InvestmentList.propTypes = {
  createInvestmentStatus: PropTypes.string,
  updateInvestmentStatus: PropTypes.string,
  investmentStatusUpdateStatus: PropTypes.string,
  customerList: PropTypes.arrayOf(PropTypes.shape({})),
  getInvestments: PropTypes.func,
  customerId: PropTypes.string,
  dealId: PropTypes.string
};

InvestmentList.defaultProps = {
  createInvestmentStatus: null,
  updateInvestmentStatus: null,
  investmentStatusUpdateStatus: null,
  customerList: null,
  getInvestments: () => {},
  customerId: null,
  dealId: null
};

export default InvestmentList;
