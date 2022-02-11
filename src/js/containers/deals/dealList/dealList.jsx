/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import {
  AdvanceTable,
  CustomeHeader
} from 'app/components';
import { formatCurrency, formatDateStandard, decodeParams } from 'app/utils/utils';
import DialogComponent from '../../../components/dialogComponent/dialogComponent';
import CreateForm from './components/createDealForm';
import global from '../../global.scss';

const DealList = (props) => {
  const history = useHistory();
  const {
    getDealLeadPool,
    totalCount,
    dealList,
    getConfig,
    getBrandLeadPool,
    brandList,
    genericConfig,
    createDealForm,
    brandId
  } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setselectedDate] = useState();
  const [selectedStatus, setselectedStatus] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [selectedDealName, setSelectedDealName] = useState('');
  const statusOptions = [
    'Ready',
    'Rejected',
    'On Hold',
    'Published',
    'Fully Subscribed',
    'Initiate Documentation',
    'Documentation Done',
    'Funded',
    'Disbursed',
    'Repaying',
    'Delayed',
    'Defaulted',
    'Fully Repaid'
  ];
  const brandDetails = brandList && brandList.find((data) => data.applicationCode === selectedBrand);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const [tableData, setTableData] = useState([]);

  const tableColumns = [
    { Header: 'Deal Code', accessor: 'dealCode', disableSortBy: true },
    { Header: 'Deal Name', accessor: 'name', disableSortBy: true },
    {
      Header: 'Deal Value',
      accessor: 'dealAmount',
      disableSortBy: true,
      Cell: (row) => (row.value
        ? formatCurrency(
          row.value,
          row.row.original.dealCurrency ? row.row.original.dealCurrency : 'INR'
        )
        : '')
    },
    { Header: 'Status', accessor: 'status', disableSortBy: true },
    { Header: 'Application Code', accessor: 'applicationCode', disableSortBy: true },
    {
      Header: 'Created at',
      accessor: 'createdAt',
      disableSortBy: true,
      Cell: (row) => row.value && formatDateStandard(row.value)
    },
    {
      Header: 'Updated at',
      accessor: 'updatedAt',
      disableSortBy: true,
      Cell: (row) => row.value && formatDateStandard(row.value)
    }
  ];

  const decodeParamsData = decodeParams();
  const statusArray = [
    {
      label: 'Draft',
      value: 'Draft'
    },
    {
      label: 'Ready',
      value: 'Ready'
    },
    {
      label: 'Rejected',
      value: 'Rejected'
    },
    {
      label: 'On Hold',
      value: 'On Hold'
    },
    {
      label: 'Published',
      value: 'Published'
    },
    {
      label: 'Fully Subscribed',
      value: 'Fully Subscribed'
    },
    {
      label: 'Document Data Missing',
      value: 'Document Data Missing'
    },
    {
      label: 'Document Data Added',
      value: 'Document Data Added'
    },
    {
      label: 'Document Generate Error',
      value: 'Document Generate Error'
    },
    {
      label: 'Document Generated',
      value: 'Document Generated'
    },
    {
      label: 'Initiate Documentation',
      value: 'Initiate Documentation'
    },
    {
      label: 'Initiate Document Signing',
      value: 'Initiate Document Signing'
    },
    {
      label: 'Signing Files Missing',
      value: 'Signing Files Missing'
    },
    {
      label: 'Documentation Done',
      value: 'Documentation Done'
    },
    {
      label: 'Funded',
      value: 'Funded'
    },
    {
      label: 'Disbursed',
      value: 'Disbursed'
    },
    {
      label: 'Repaying',
      value: 'Repaying'
    },
    {
      label: 'Delayed',
      value: 'Delayed'
    },
    {
      label: 'Defaulted',
      value: 'Defaulted'
    },
    {
      label: 'Fully Repaid',
      value: 'Fully Repaid'
    }
  ];
  const FilterData = [
    {
      name: 'Status',
      value: statusArray,
      type: 2,
      isSearchable: false,
      key: 'status',
      selectedValue: {
        search: '',
        value: (decodeParamsData?.status) ? [decodeParamsData.status] : []
      }
    },
    {
      name: 'Created At',
      value: [],
      type: 3,
      isSearchable: false,
      key: 'createdAt',
      selectedValue: {
        search: '',
        value: (decodeParamsData?.createdAt) ? [decodeParamsData.createdAt] : []
      }
    }
  ];

  const inputEnterHandler = (e) => {
    if (e.key === 'Enter' && selectedDealName) {
      setPage(0);
      fetchData(
        rowsPerPage,
        1,
        selectedStatus,
        selectedDate || undefined,
        brandId,
        selectedDealName || undefined
      );
    }
  };

  const onSearchClick = (value) => {
    setPage(0);
    fetchData(
      rowsPerPage,
      1,
      selectedStatus,
      selectedDate || undefined,
      brandId,
      value || selectedDealName || undefined
    );
  };

  useEffect(() => {
    const mData = decodeParams();
    setSelectedDealName(mData?.q || '');
    setselectedDate(mData?.createdAt || '');
    setselectedStatus(mData?.status || '');
    if (getDealLeadPool) fetchData(rowsPerPage, 1, mData?.status || null, mData?.createdAt || null, brandId, mData?.q || '');
  }, []);

  const filterHendler = (searchURL) => {
    let mData = {};
    if (searchURL) {
      mData = JSON.parse(`{"${decodeURI(searchURL).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
    }
    setSelectedDealName(mData?.q || '');
    setselectedDate(mData?.createdAt || '');
    setselectedStatus(mData?.status || '');
    if (getDealLeadPool) {
      fetchData(rowsPerPage, 1, mData?.status || undefined, mData?.createdAt || undefined, brandId, mData?.q);
    }
  };

  const onSubmit = (data) => {
    const { values, brandData, applicationData } = data;
    const payload = {
      dealName: values.name,
      dealType: values.isPrivate ? 'Private' : 'Public',
      ...values
    };
    createDealForm(
      payload,
      brandData.businessName,
      brandData.id,
      applicationData.id,
      applicationData.key,
      brandData.companyCode
    ).then((res) => {
      if (res.data) {
        setOpenDialog(false);
      }
    });
  };

  const fetchData = (limt, currentpage, currentstatus, selecteddate, brandid, selecteddealname) => {
    setTableLoading(true);
    const mData = decodeParams();
    getDealLeadPool(limt, currentpage, currentstatus || mData?.status, mData?.createdAt || selecteddate, brandid, mData?.q || selecteddealname).then(
      (res) => {
        setTableData(res.data);
        setDataCount(res.meta.total);
        setTableLoading(false);
      }
    );
  };

  const handleRowClick = (data) => {
    history.push(`/deals/${data.id}`);
  };

  useEffect(() => {
    document.addEventListener('keyup', inputEnterHandler);
    return () => document.removeEventListener('keyup', inputEnterHandler);
  });

  const onClearSearchClick = () => {
    setSelectedDealName('');
    setRowsPerPage(25);
    setPage(1);
    fetchData(25, 1, '', undefined, brandId, undefined);
  };

  const toolBarActions = [
    {
      label: 'Create Deal',
      onClick: () => setOpenDialog(true),
      variant: 'text',
      otherProps: {
        startIcon: <AddIcon />
      }
    }
  ];

  const statusListChangeHendler = (value) => {
    setselectedStatus(value);
    const mData = decodeParams();
    const payload = {
      ...mData,
      status: value
    };
    const qs = Object.keys(payload)
      .map((key) => `${key}=${payload[key]}`)
      .join('&');
    filterHendler(qs);
    history.push({
      search: qs
    });
  };

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="Deals"
        searchValue={selectedDealName}
        searchValueHendler={setSelectedDealName}
        searchHendler={onSearchClick}
        searchClearHendler={onClearSearchClick}
        actions={toolBarActions}
        filterStyle={{ paddingLeft: '35px' }}
        FilterData={FilterData}
        filterHendler={filterHendler}
        statusList={statusArray}
        statusListChangeHendler={statusListChangeHendler}
        statusListValue={selectedStatus}
        isStatusBox={true}
      />
      {openDialog && (
        <DialogComponent title="Create Deal" onClose={() => setOpenDialog(false)}>
          <CreateForm onSubmit={onSubmit} />
        </DialogComponent>
      )}
      <Grid item={true} xs={12} className={global.tableStyle}>
        <AdvanceTable
          fetchNextData={(limit, offset, newPage) => fetchData(
            limit,
            newPage + 1,
            selectedStatus,
            selectedDate || undefined,
            brandId,
            selectedDealName || undefined
          )}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          tableData={tableData}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
          isStatusCheckboxRequired={false}
          handleRowClick={handleRowClick}
        />
      </Grid>
    </Grid>
  );
};

DealList.propTypes = {
  dealList: PropTypes.arrayOf(PropTypes.shape({})),
  getConfig: PropTypes.func,
  getBrandLeadPool: PropTypes.func,
  getDealLeadPool: PropTypes.func,
  createDealForm: PropTypes.func,
  totalCount: PropTypes.number
};

DealList.defaultProps = {
  dealList: null,
  getBrandLeadPool: () => {},
  getConfig: () => {},
  getDealLeadPool: () => {},
  createDealForm: () => {},
  totalCount: 0
};

export default DealList;
