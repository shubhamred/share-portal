import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import {
  getConfig,
  getRepayments,
  uploadPayments
} from 'app/containers/repayments/saga';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth0 } from 'app/react-auth0-spa';
import { formatCurrency, formatDateStandard } from 'app/utils/utils';
import {
  getPatronDocPresignedUrl,
  viewImage,
  postMetaData, getPatrons
} from 'app/containers/patrons/saga';
import { extend, find, map as lodashMap, pick, uniq } from 'lodash';
import { getDealLeadPool } from 'app/containers/deals/saga';
import { AdvanceTable, AutocompleteCustom, CustomeHeader, FileUploader, DatePickerNew } from '../../../components';
import styles from './styles.scss';
import global from '../../global.scss';

const RepaymentsComponent = (props) => {
  const dispatch = useDispatch();
  const { dealId, patronId, payoutType } = props;
  const docConfig = useSelector((state) => state.repaymentsReducer.docConfig);
  const { user } = useAuth0();
  // docConfig = docConfig && docConfig.categories;
  const FILE_UPLOAD_KEY = 'BULK_PATRON_IMPORT';
  const ALL_DEALS = { name: 'All Deals' };
  const ALL_CUSTOMERS = { name: 'All Patrons' };
  const [uploadConfig, setUploadConfig] = useState(null);
  const [customersData, setCustomersData] = useState(ALL_CUSTOMERS);
  const [selectedCustomer, changeSelectedCustomer] = useState(ALL_CUSTOMERS);
  const [selectedDeal, changeSelectedDeal] = useState(ALL_DEALS);
  const [selectedYear, changeSelectedYear] = useState('2022');
  const [selectedStatus, changeSelectedStatus] = useState(0);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('paymentDate');
  const queryParam = {
    order: { [currentColumnSortBy]: currentSortBy },
    where: {},
    includes: 'deal'
  };
  const [queryParams, setQueryParams] = useState(queryParam);
  const [showSearch, setSearch] = useState({ showDealSearch: true, showCustomerSearch: true, showBrandSearch: true });
  const [dealList, changeDealList] = useState(ALL_DEALS);
  const [selectedDate, setDate] = useState(null);
  useEffect(() => {
    if (docConfig) {
      const patronUploadConfig = docConfig && docConfig.find((cate) => cate.documentCategory.key === 'PATRON');
      if (patronUploadConfig) {
        getConfiguredDocumentTypes('PORTAL', patronUploadConfig.documentCategoryId).then((res) => {
          if (res?.data?.length) {
            const uploadConfigData = res.data.find(
              (config) => config.documentType.key === FILE_UPLOAD_KEY
            );
            setUploadConfig(uploadConfigData);
          }
        });
      }
    }
  }, [docConfig]);

  const extraColumns = [
    {
      Header: 'Deal Name',
      accessor: 'deal.name',
      disableSortBy: true
    }
  ];

  const handleDateChange = (date) => {
    setDate(date);
    const dates = date.split('/');
    if (dates?.length) {
      changeSelectedStatus(dates[1]);
      changeSelectedYear(dates[2]);
    }
  };
  const defaultColumns = [
    {
      Header: 'Revenue Share Month',
      accessor: 'revenueMonth',
      disableSortBy: false,
      Cell: (row) => {
        const date = new Date(row.value);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
      }
    },
    {
      Header: `Brand's Revenue for the month`,
      accessor: 'brandRevenue',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Patron Name',
      accessor: 'name',
      disableSortBy: true,
      Cell: (row) => (
        <Link to={`/patrons/${row.row.original.patronId}`} component={RouterLink}>
          {row.row.original.name}
        </Link>
      )
    },
    // { Header: 'Patron ID', accessor: 'patronCode', disableSortBy: true },
    { Header: 'Payout Date',
      accessor: 'paymentDate',
      disableSortBy: false,
      Cell: (row) => (formatDateStandard(row.value)) },
    {
      Header: 'Revenue Share Expected',
      accessor: 'expectedRevenueShare',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Revenue Share Payout',
      accessor: 'actualRevenueShare',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Principal Amount',
      accessor: 'principalAmount',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Interest Amount',
      accessor: 'interestAmount',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'TDS Deducted',
      accessor: 'taxDeducted',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Klub Fee Deducted',
      accessor: 'feeDeducted',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Investment Fee',
      accessor: 'feeAmount',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Investment Fee Tax (GST)',
      accessor: 'feeTaxAmount',
      disableSortBy: false,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Tax Percentage (%)',
      accessor: 'taxPercentage',
      disableSortBy: false,
      Cell: (row) => (typeof row.value === 'number' && `${row.value}%`) || '-'
    },
    {
      Header: 'Fee Tax Percentage (%)',
      accessor: 'feeTaxPercentage',
      disableSortBy: false,
      Cell: (row) => (typeof row.value === 'number' && `${row.value}%`) || '-'
    },
    {
      Header: 'Net Payout',
      accessor: 'netPayout',
      disableSortBy: true,
      Cell: (row) => formatCurrency(row.value)
    }
  ];

  const saveMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    postMetaData({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      viewImage(res.data.id, false).then((csvdata) => {
        uploadPayments(csvdata.data.url).then((errData) => {
          if (!errData.error) {
            fetchData(queryParam);
          }
        });
      });
    });
  };

  const toolBarActions = [
    {
      component: (
        <>
          {uploadConfig && (
            <FileUploader
              uploadedDocumentCount={null}
              resourceType="PORTAL"
              docCategory="PATRON"
              resourceId={user['https://klubworks.com/user_id']}
              minNumberOfFiles={1}
              getPreSignedUrl={getPatronDocPresignedUrl}
              handleSaveMetaData={saveMetaData}
              docType={uploadConfig.documentType}
              btnLabel="Upload Patron Payouts"
            />
          )}
        </>
      )
    }
  ];

  const [isTableLoading, setTableLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tableColumns, setTableColumns] = useState(defaultColumns);
  const [tableRows, setTableData] = useState([]);

  useEffect(() => {
    if (dealId || patronId) {
      dispatch({ type: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_INIT' });
    } else {
      getConfig('PORTAL');
    }
    if (dealId) return;
    if (patronId) {
      defaultColumns.splice(2, 1);
      defaultColumns.splice(2, 1);
      setTableColumns([...extraColumns, ...defaultColumns]);
      return;
    }
    setTableColumns([...extraColumns, ...defaultColumns]);
  }, [props]);

  const handleCustomerChange = (val) => {
    if (!val || val.length <= 2) return;
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 5
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

  const fetchData = (query) => {
    setTableLoading(true);
    getRepayments(query).then((res) => {
      if (res.data) {
        if (!res.data.length) {
          setTableData([]);
          setTotalCount(0);
          setTableLoading(false);
          return;
        }
        const customersIdsArr = uniq(res.data.map((cus) => cus.patronCode));
        const customerParams = {
          fields: 'name,firstName,lastName,id,patronCode',
          where: {
            patronCode: {
              in: customersIdsArr
            }
          },
          take: 30
        };
        getPatrons(customerParams).then((cusData) => {
          const customerData = cusData.data?.map((item) => ({ ...item, patronId: item.id }));
          const mergedList = lodashMap(res.data, (item) => extend(
            item,
            pick(find(customerData, { patronCode: item.patronCode }), ['name', 'patronId'])
          ));
          setTableData(mergedList);
          setTotalCount(res.meta.total);
          setTableLoading(false);
        });
      } else {
        setTableData([]);
        setTotalCount(0);
      }
      setTableLoading(false);
    });
  };
  useEffect(() => {
    if (dealId) {
      queryParam.where.dealCode = dealId;
      setQueryParams(queryParam);
      setSearch((prevState) => ({ ...prevState, showDealSearch: false, showBrandSearch: false }));
    }
    if (patronId) {
      if (payoutType === 'Entity' || payoutType === 'NBFC') {
        queryParam.where.companyCode = patronId;
      } else {
        queryParam.where.patronCode = patronId;
      }
      setQueryParams(queryParam);
      setSearch((prevState) => ({ ...prevState, showCustomerSearch: false, showBrandSearch: false }));
    }
    queryParams.take = rowsPerPage;
    queryParams.page = page + 1;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    fetchData(queryParams);
  }, [props]);

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      paymentDate: 'paymentDate',
      revenueMonth: 'revenueMonth',
      brandRevenue: 'brandRevenue',
      expectedRevenueShare: 'expectedRevenueShare',
      actualRevenueShare: 'actualRevenueShare',
      taxDeducted: 'taxDeducted',
      feeDeducted: 'feeDeducted',
      netPayout: 'netPayout',
      taxPercentage: 'taxPercentage',
      feeTaxPercentage: 'feeTaxPercentage'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      queryParams.take = rowsPerPage;
      queryParams.page = page + 1;
      queryParams.where = {};
      if (selectedCustomer && selectedCustomer.patronCode) queryParams.where.patronCode = selectedCustomer.patronCode;
      if (selectedDeal && selectedDeal.id) queryParams.where.dealCode = selectedDeal.dealCode;
      if (selectedStatus && selectedStatus !== 0)queryParams.where.revenueMonth = `${selectedYear}-${selectedStatus}-01`;
      if (patronId) queryParams.where.patronCode = patronId;
      if (dealId) queryParams.where.dealCode = dealId;
      queryParams.order = { [key]: isDesc };
      fetchData(queryParams);
    }
  };

  const onSearchClick = () => {
    queryParams.take = rowsPerPage;
    queryParams.page = page + 1;
    queryParams.where = {};
    if (selectedCustomer && selectedCustomer.patronCode) queryParams.where.patronCode = selectedCustomer.patronCode;
    if (selectedDeal && selectedDeal.id) queryParams.where.dealCode = selectedDeal.dealCode;
    if (selectedStatus && selectedStatus !== 0) queryParams.where.revenueMonth = `${selectedYear}-${selectedStatus}-01`;
    if (patronId) queryParams.where.patronCode = patronId;
    if (dealId) queryParams.where.dealCode = dealId;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    fetchData(queryParams);
  };
  const clearFilters = () => {
    changeSelectedDeal(ALL_DEALS);
    changeSelectedCustomer(ALL_CUSTOMERS);
    changeSelectedStatus(0);
    queryParams.take = rowsPerPage;
    queryParams.page = page + 1;
    queryParams.where = {};
    if (patronId) queryParams.where.patronCode = patronId;
    if (dealId) queryParams.where.dealCode = dealId;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    fetchData(queryParams);
  };

  const handleTableUpdate = (limit, offset) => {
    queryParams.take = limit;
    queryParams.page = offset + 1;
    queryParams.order = { [currentColumnSortBy]: currentSortBy };
    fetchData(queryParams);
  };

  const isSearch = showSearch.showDealSearch || showSearch.showCustomerSearch;

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName={payoutType ? `${payoutType} Payouts` : `All Patron Payouts`}
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
        {
          showSearch.showCustomerSearch && (
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
          )
        }
        {
          showSearch.showDealSearch && (
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
          )
        }
        <Grid item={true} sm={2} md={2} lg={3} style={{ alignSelf: 'flex-end' }}>
          <DatePickerNew
            lableStyle={{ fontSize: '12px', color: '#00000061' }}
            label="Revenue Month/Year"
            onDateSelect={handleDateChange}
            initialValue={selectedDate}
            isMonthFilter={true}
            minDate="01-01-2019"
            maxDate="01-01-2023"
          />
        </Grid>
        <Grid item={true} sm={4} lg={isSearch ? 3 : 2} md={isSearch ? 4 : 3} className={styles.searchBtnContainer} container={true} justify="flex-end">
          <Button className={global.primaryCTA} onClick={onSearchClick}>Search</Button>
          <Button className={global.primaryCTA} onClick={clearFilters}> Clear Filters</Button>
        </Grid>
      </Grid>
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          fetchNextData={(limit, offset, newPage) => handleTableUpdate(limit, newPage)}
          tableColumns={tableColumns}
          tableData={tableRows}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isStatusCheckboxRequired={false}
          handleRowClick={() => {}}
          isLoading={isTableLoading}
          onChangeSort={onChangeSort}
          initialStateProps={{ sortBy: [
            {
              id: 'paymentDate',
              desc: true
            }
          ] }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(RepaymentsComponent);
