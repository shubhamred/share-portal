import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { AdvanceTable, CustomeHeader } from 'app/components';
import { getApplications } from 'app/containers/applications/saga';
import { getProducts } from 'app/containers/products/saga';
import { useHistory } from 'react-router-dom';
import { formatCurrency, formatDateStandard, decodeParams } from 'app/utils/utils';
import { getCompanies } from 'app/containers/companies/saga';
import { extend, find, map as lodashMap, pick } from 'lodash';
import { BlazeStatus, GroStatus } from '../data';
import global from '../../global.scss';

const ApplicationListing = () => {
  const history = useHistory();
  const tableColumns = [
    {
      Header: 'Application ID',
      accessor: 'applicationCode',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Brand Name',
      accessor: 'businessName',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Requested Amount',
      accessor: 'requestedAmount',
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Sanctioned Amount',
      accessor: 'sanctionedAmount',
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Product',
      accessor: 'product.name',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Completed Status',
      accessor: 'applicationCompleted',
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => (row.value ? 'Completed' : 'Not Completed')
    },
    {
      Header: 'Applied On',
      accessor: 'createdAt',
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => formatDateStandard(row.value)
    }
  ];

  const [isTableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalDataCount, setDataCount] = useState(0);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setselectedStatus] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      applicationCode: 'applicationCode',
      requestedAmount: 'requestedAmount',
      sanctionedAmount: 'sanctionedAmount',
      status: 'status',
      applicationCompleted: 'applicationCompleted',
      createdAt: 'createdAt'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      const querysData = {
        order: { [key]: isDesc }
      };
      fetchData(rowsPerPage, page, querysData);
    }
  };

  const queryDataHandler = (mData) => {
    const querysData = {
      where: {}
    };
    if (mData?.status && mData.status !== '') {
      querysData.where = {
        ...querysData.where,
        applicationCompleted: mData?.status === 'Completed'
      };
    }
    if (mData?.bid && mData.bid !== '') {
      querysData.where = {
        ...querysData.where,
        companyId: mData.bid
      };
    }
    if (mData?.pid && mData.pid !== '') {
      querysData.where = {
        ...querysData.where,
        productId: mData?.pid
      };
      if (mData?.applicationStatus && mData.applicationStatus !== '') {
        querysData.where = {
          ...querysData.where,
          status: mData?.applicationStatus
        };
      }
    }
    return querysData;
  };

  const fetchData = (perPage, currentPage, queryParams) => {
    const mData = decodeParams();
    let querysData = queryDataHandler(mData);
    querysData = {
      ...querysData,
      order: {
        [currentColumnSortBy]: currentSortBy
      }
    };
    if (queryParams?.order) {
      querysData.order = queryParams.order;
    }
    setTableLoading(true);
    getApplications(perPage, currentPage + 1, querysData).then((res) => {
      if (res.data) {
        let companiesArr = res.data.map((application) => application.companyId);
        companiesArr = [...new Set(companiesArr)];
        const query = {
          fields: 'businessName,id',
          where: {
            id: {
              in: companiesArr
            }
          }
        };
        getCompanies(50, 1, undefined, undefined, undefined, query).then(
          (companyData) => {
            const mergedList = lodashMap(res.data, (item) => extend(
              item,
              pick(find(companyData.data, { id: item.companyId }), [
                'businessName'
              ])
            ));
            setTableData(mergedList);
            setDataCount(res.meta.total);
            setTableLoading(false);
          }
        );
      } else {
        setTableData([]);
      }
      setTableLoading(false);
      setDataCount(0);
    });
  };

  const handleRowClick = (val) => {
    if (val && val.id) {
      history.push(`/applications/${val.id}`);
    }
  };

  useEffect(() => {
    const mData = decodeParams();
    fetchData(25, 0);
    setselectedStatus(mData?.status || '');
    setSearchValue(mData?.q || '');
    getProducts().then((res) => {
      if (res.data) {
        const productList = res.data.map((list) => ({
          label: list.name,
          value: list.id,
          productCode: list.productCode
        }));
        setProductsList(productList);
      }
    });
  }, []);

  useEffect(() => {
    if (productsList?.length) {
      const mData = decodeParams();
      if (mData?.pid && mData?.pid !== '') {
        productChange(mData.pid);
      } else {
        productChange('');
      }
    }
  }, [productsList]);

  const onSearchClick = (value) => {
    setPage(0);
    fetchData(rowsPerPage, 1, { keyword: value });
  };

  const onClearSearchClick = () => {
    setSearchValue('');
    setRowsPerPage(25);
    setPage(1);
    fetchData(25, 1, { keyword: '' });
  };

  const statusListChangeHendler = (value) => {
    setselectedStatus(value);
    const mData = decodeParams();
    const payload = {
      ...mData,
      applicationStatus: value
    };
    const qs = Object.keys(payload)
      .map((key) => `${key}=${payload[key]}`)
      .join('&');
    filterHendler(qs);
    history.push({
      search: qs
    });
  };

  const filterHendler = (searchURL) => {
    let mData = {};
    if (searchURL) {
      mData = JSON.parse(
        `{"${decodeURI(searchURL).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      );
    }
    const querysData = queryDataHandler(mData);
    setselectedStatus(mData?.applicationStatus || '');

    setTableLoading(true);
    getApplications(rowsPerPage, page + 1, querysData).then((res) => {
      if (res.data) {
        let companiesArr = res.data.map((application) => application.companyId);
        companiesArr = [...new Set(companiesArr)];
        const query = {
          fields: 'businessName,id',
          where: {
            id: {
              in: companiesArr
            }
          }
        };
        getCompanies(50, 1, undefined, undefined, undefined, query).then((companyData) => {
          const mergedList = lodashMap(res.data, (item) => extend(item, pick(find(companyData.data, { id: item.companyId }), ['businessName'])));
          setTableData(mergedList);
          setDataCount(res.meta.total);
          setTableLoading(false);
        });
      } else {
        setTableData([]);
      }
      setTableLoading(false);
      setDataCount(0);
    });
  };

  const hendelBrandSearch = (value) => {
    const query = {
      fields: 'businessName,id',
      where: {
        businessName: {
          keyword: value
        }
      }
    };
    getCompanies(10, 1, undefined, undefined, undefined, query).then((companyData) => {
      if (companyData?.data?.length) {
        setBrandList(companyData.data);
      }
    });
  };

  const productChange = (value) => {
    const productData = [...productsList].find((l) => l.value === value);
    if (productData && productData?.productCode === 'PRD-BLAZE') {
      setStatusList(BlazeStatus);
    }
    if (productData && productData?.productCode === 'PRD-GRO') {
      setStatusList(GroStatus);
    }
    if (value === '') {
      setStatusList([]);
    }
  };

  const decodeParamsData = decodeParams();
  const FilterData = [
    {
      name: 'Brand',
      value: brandList,
      type: 4,
      key: 'bid',
      searchKey: 'bname',
      isSearchable: true,
      selector: 'businessName',
      valueSelector: 'id',
      handleInputChange: hendelBrandSearch,
      selectedValue: {
        search: decodeParamsData?.bname || '',
        value: decodeParamsData?.bid ? [decodeParamsData.bid] : []
      }
    },
    {
      name: 'Products',
      value: productsList,
      type: 2,
      isSearchable: false,
      key: 'pid',
      isCallBack: true,
      callBack: productChange,
      selectedValue: {
        search: '',
        value: decodeParamsData?.pid ? [decodeParamsData.pid] : []
      }
    },
    {
      name: 'Application Status',
      value: statusList,
      type: 2,
      isSearchable: false,
      key: 'applicationStatus',
      selectedValue: {
        search: '',
        value: decodeParamsData?.applicationStatus ? [decodeParamsData.applicationStatus] : []
      }
    },
    {
      name: 'Completed Status',
      value: [
        {
          label: 'Completed',
          value: 'Completed'
        },
        {
          label: 'Not Completed',
          value: 'Not Completed'
        }
      ],
      type: 2,
      isSearchable: false,
      key: 'status',
      selectedValue: {
        search: '',
        value: decodeParamsData?.status ? [decodeParamsData.status] : []
      }
    }
  ];

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="Applications"
        isFilter={true}
        isSearch={false}
        FilterData={FilterData}
        filterHendler={filterHendler}
        searchValue={searchValue}
        searchValueHendler={setSearchValue}
        searchHendler={onSearchClick}
        searchClearHendler={onClearSearchClick}
        statusList={statusList}
        statusListChangeHendler={statusListChangeHendler}
        statusListValue={selectedStatus}
        isStatusBox={false}
      />
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          fetchNextData={(limit, offset, newValue) => fetchData(limit, newValue)}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          tableData={tableData}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
          handleRowClick={handleRowClick}
          disableFilter={false}
          isStatusCheckboxRequired={false}
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
    </Grid>
  );
};

export default React.memo(ApplicationListing);
