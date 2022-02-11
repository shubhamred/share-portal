import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { formatDateStandard, decodeParams } from 'app/utils/utils';
import {
  DialogComponent,
  AdvanceTable,
  CustomeHeader
} from 'app/components';
import { useHistory } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import global from '../../global.scss';
import CreateBrandDialog from './components/createBrand';

const BrandList = (props) => {
  const history = useHistory();
  const { getBrandLeadPool, createBrand, brandCreate, onCancel } = props;

  const createData = (brandId, brandName, applicantName, appliedDate, status, amount, id) => ({
    brandId,
    brandName,
    applicantName,
    appliedDate,
    status,
    amount,
    id
  });

  const tableColumns = [
    { Header: 'Brand ID', accessor: 'brandId', disableSortBy: false },
    { Header: 'Brand Name', accessor: 'brandName', disableSortBy: false },
    { Header: 'Applicant', accessor: 'applicantName', disableSortBy: true },
    { Header: 'Applied On', accessor: 'appliedDate', disableSortBy: false }
  ];

  const statusOptions = [
    { label: 'Lead', name: 'Lead', checked: false },
    { label: 'Qualified Lead', name: 'Qualified Lead', checked: false },
    { label: 'Under Assessment', name: 'Under Assessment', checked: false },
    { label: 'Approved', name: 'Approved', checked: false },
    { label: 'Matched', name: 'Matched', checked: false },
    { label: 'Sanctioned', name: 'Sanctioned', checked: false },
    { label: 'Disbursed', name: 'Disbursed', checked: false },
    { label: 'Matured', name: 'Matured', checked: false },
    { label: 'Closed', name: 'Closed', checked: false },
    { label: 'Rejected', name: 'Rejected', checked: false },
    { label: 'Withdrawal', name: 'Withdrawal', checked: false }
  ];

  const defaultRows = 25;
  const defaultPage = 0;

  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(defaultPage);
  const [tableData, setTableData] = useState([]);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);

  useEffect(() => {
    const mData = decodeParams();
    setSelectedBrandName(mData?.q || '');
    if (getBrandLeadPool) fetchData(rowsPerPage, page, mData?.q || undefined);
  }, []);

  const onSubmit = (values) => {
    createBrand(values);
  };

  const onSearchClick = (value) => {
    setRowsPerPage(defaultRows);
    setPage(defaultPage);
    fetchData(rowsPerPage, page, value || selectedBrandName, selectedStatus);
  };

  const onClearSearchClick = () => {
    setSelectedBrandName('');
    setRowsPerPage(defaultRows);
    setPage(defaultPage);
    fetchData(defaultRows, defaultPage);
  };

  const filterByStatus = ({ target: { value } }) => {
    setSelectedStatus(value);
    fetchData(rowsPerPage, page, selectedBrandName, value.join(','));
    // setSelectedStatus('');
  };

  const handleCancelButton = () => {
    onCancel();
    setOpenDialog(false);
  };

  const handleClearStatus = () => {
    if (selectedStatus.length === 0) return false;
    setSelectedStatus([]);
    fetchData(rowsPerPage, page, selectedBrandName, '');
    return true;
  };

  const inputEnterHandler = (e) => {
    if (e.key === 'Enter' && selectedBrandName) {
      setRowsPerPage(defaultRows);
      setPage(defaultPage);
      fetchData(rowsPerPage, page, selectedBrandName, selectedStatus);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    brandCreate === 'failed' ? setOpenDialog(true) : setOpenDialog(false);
  }, [brandCreate]);

  useEffect(() => {
    document.addEventListener('keyup', inputEnterHandler);
    return () => document.removeEventListener('keyup', inputEnterHandler);
  });

  const fetchData = (
    perPage,
    currentpage,
    brandname,
    selectedstatus,
    selectedfromdate,
    sortOrder = { [currentColumnSortBy]: currentSortBy }
  ) => {
    setTableLoading(true);
    getBrandLeadPool(
      perPage,
      currentpage + 1,
      brandname,
      selectedstatus,
      undefined,
      sortOrder,
      true
    ).then((res) => {
      const temp = res.data.map((data) => createData(
        data && data.companyCode,
        data && data.businessName,
        data
            && data.customerCompanies
            && data.customerCompanies[0].customer
            && data.customerCompanies[0].customer.name,
        formatDateStandard(data && data.createdAt),
        data && data.brandProfile && data.brandProfile.status,
        data && data.brandProfile && data.brandProfile.amount,
        data && data.brandProfile && data.brandProfile.id
      ));
      setTableData(temp);
      setTableLoading(false);
      setDataCount(res.meta.total);
    }).catch(() => {
      setTableData([]);
      setTableLoading(false);
      setDataCount(0);
    });
  };

  const handleRowClick = ({ id }) => {
    history.push(`/brands/${id}`);
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      brandId: 'companyCode',
      brandName: 'businessName',
      appliedDate: 'createdAt'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      fetchData(rowsPerPage, page, selectedBrandName, selectedStatus, undefined, { [key]: isDesc });
    }
  };

  const toolBarActions = [
    {
      label: 'Create Brand',
      onClick: () => setOpenDialog(true),
      variant: 'text',
      otherProps: {
        startIcon: <AddIcon />
      }
    }
  ];

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        isFilter={false}
        pageName="Brands"
        searchValue={selectedBrandName}
        searchValueHendler={setSelectedBrandName}
        searchHendler={onSearchClick}
        searchClearHendler={onClearSearchClick}
        actions={toolBarActions}
      />
      {openDialog && (
        <DialogComponent onClose={handleCancelButton} title="Create Brand">
          <CreateBrandDialog onSubmit={onSubmit} handleCancelButton={handleCancelButton} />
        </DialogComponent>
      )}
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          fetchNextData={(limit, offset, newValue) => fetchData(limit, newValue, selectedBrandName, selectedStatus, undefined)}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          tableData={tableData}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
          handleRowClick={handleRowClick}
          handleCheckBoxValue={filterByStatus}
          statusOptions={statusOptions}
          checkedOptions={selectedStatus}
          handleClearStatus={handleClearStatus}
          onChangeSort={onChangeSort}
          initialSortBy="brandName"
          initialStateProps={{ sortBy: [
            {
              id: 'appliedDate',
              desc: true
            }
          ] }}
        />
      </Grid>
    </Grid>
  );
};

BrandList.propTypes = {
  getBrandLeadPool: PropTypes.func,
  createBrand: PropTypes.func,
  brandCreate: PropTypes.string,
  onCancel: PropTypes.func
};

BrandList.defaultProps = {
  brandCreate: null,
  onCancel: () => {},
  getBrandLeadPool: () => {},
  createBrand: () => {}
};

export default BrandList;
