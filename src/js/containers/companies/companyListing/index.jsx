import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import {
  AdvanceTable,
  // ToolbarComponent,
  CustomeHeader,
  DialogComponent
} from 'app/components';
import { getCompanies } from 'app/containers/companies/saga';
import { useHistory } from 'react-router-dom';
import { formatDateStandard } from 'app/utils/utils';
import CreateBrand from '../components/createBrand/createBrand';
import global from '../../global.scss';

const CompanyListing = () => {
  const history = useHistory();

  const tableColumns = [
    { Header: 'Company ID', accessor: 'companyCode', disableSortBy: false },
    { Header: 'Company Name', accessor: 'businessName', disableSortBy: false },
    {
      Header: 'Applicant',
      accessor: 'customerCompanies[0].customer.name',
      disableSortBy: true
    },
    {
      Header: 'Applied On',
      accessor: 'createdAt',
      disableSortBy: false,
      Cell: (row) => formatDateStandard(row.value)
    }
  ];

  const [createBrandModalOpen, toggleCreateBrandModal] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalDataCount, setDataCount] = useState(0);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      companyCode: 'companyCode',
      businessName: 'businessName',
      createdAt: 'createdAt'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      const querysData = {
        where: {
          companyType: 'InstitutionalInvestor'
        },
        order: { [key]: isDesc },
        includes: [
          'customerCompanies',
          'customerCompanies.customer'
        ]
      };
      fetchData(rowsPerPage, page, '', '', querysData);
    }
  };

  const toolBarActions = [
    {
      label: 'Create Entity',
      onClick: () => toggleCreateBrandModal(true),
      variant: 'text',
      otherProps: {
        startIcon: <AddIcon />
      }
    }
  ];

  const query = {
    where: {
      companyType: 'InstitutionalInvestor'
    },
    order: { [currentColumnSortBy]: currentSortBy },
    includes: [
      'customerCompanies',
      'customerCompanies.customer'
    ]
  };

  const fetchData = (
    perPage,
    currentpage,
    brandname,
    selectedstatus,
    queryString = { ...query, order: { [currentColumnSortBy]: currentSortBy } }
  ) => {
    setTableLoading(true);
    getCompanies(perPage, currentpage + 1, brandname, selectedstatus, undefined, queryString).then(
      (res) => {
        if (res.data) {
          setTableData(res.data);
          setTableLoading(false);
          setDataCount(res.meta.total);
          return;
        }
        setTableLoading(false);
        setDataCount(0);
      }
    );
  };

  const handleRowClick = (val) => {
    if (val && val.id) {
      history.push(`/companies/${val.id}`);
    }
  };

  useEffect(() => {
    fetchData(25, 0);
  }, []);

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="Investment Entities"
        isFilter={false}
        isSearch={false}
        actions={toolBarActions}
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
          onChangeSort={onChangeSort}
          initialStateProps={{ sortBy: [
            {
              id: 'createdAt',
              desc: true
            }
          ] }}
        />
      </Grid>
      {createBrandModalOpen && (
        <DialogComponent
          title="Create Entity"
          onClose={() => toggleCreateBrandModal(false)}
        >
          <CreateBrand onClose={() => {
            toggleCreateBrandModal(false);
            fetchData(rowsPerPage, page);
          }}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default React.memo(CompanyListing);
