import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import {
  AdvanceTable,
  CustomeHeader,
  DialogComponent
} from 'app/components';
import { useHistory } from 'react-router-dom';
import { getCompanies } from 'app/containers/companies/saga';
import CreatePartner from '../components/createPartner';
import global from '../../global.scss';

const PartnersListing = () => {
  const history = useHistory();
  const [createNBFCModal, toggleCreateNBFCModal] = useState(false);

  const tableColumns = [
    { Header: 'Name', accessor: 'businessName', disableSortBy: true },
    { Header: 'NBFC ID', accessor: 'companyCode', disableSortBy: true },
    { Header: 'Website', accessor: 'website', disableSortBy: true },
    { Header: 'Mail id', accessor: 'customerCompanies[0].customer.email', disableSortBy: true }
  ];

  const toolBarActions = [
    {
      label: 'Create NBFC Partner',
      onClick: () => toggleCreateNBFCModal(true),
      variant: 'text',
      otherProps: {
        startIcon: <AddIcon />
      }
    }
  ];

  const [isTableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalDataCount, setDataCount] = useState(0);
  const [currentSortBy, setSortBy] = useState('DESC');
  const currentColumnSortBy = 'createdAt';

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    setSortBy(isDesc);
  };

  const query = {
    where: {
      companyType: 'NBFC'
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
      history.push(`/partners/${val.id}`);
    }
  };

  useEffect(() => {
    fetchData(25, 0);
  }, []);

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="NBFC Partners"
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
      {createNBFCModal && (
        <DialogComponent
          title="Create NBFC Partner"
          onClose={() => toggleCreateNBFCModal(false)}
          customWidth="900px"
        >
          <CreatePartner
            onClose={() => {
              toggleCreateNBFCModal(false);
              fetchData(rowsPerPage, page);
            }}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default PartnersListing;
