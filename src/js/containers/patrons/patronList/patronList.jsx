import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDateStandard, decodeParams } from 'app/utils/utils';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import Grid from '@material-ui/core/Grid';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {
  DialogComponent,
  AdvanceTable,
  CustomeHeader,
  FileUploader
} from 'app/components';
import { useAuth0 } from 'app/react-auth0-spa';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CreatePatron from './components/createPatron';
import global from '../../global.scss';
import DateFilter from './components/dateFilter/dateFilter';
import { uploadPatronsCsv } from '../saga';
import TreeViews from './components/errorTable/errorDialog';
import Style from './styles.scss';

const PatronList = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    getPatrons,
    createPatron,
    patronCreate,
    onCancel,
    errorMsg,
    docConfig,
    getPatronDocPresignedUrl,
    viewImage,
    postMetaData,
    getConfig
  } = props;

  const columns = ['Patron ID', 'Name', 'Email', 'Status', 'Created On'];

  const dateTableHeadPosition = 3;
  const tableColumns = [
    {
      Header: 'Patron ID',
      accessor: 'patronCode',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Name',
      accessor: 'name',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Email',
      accessor: 'email',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'KYC Status',
      accessor: 'profileCompleted',
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => (row.value ? 'Verified' : 'Not Verified')
    },
    {
      Header: 'Created On',
      accessor: 'createdAt',
      disableSortBy: false,
      Cell: (row) => formatDateStandard(row.value),
      disableFilters: true
    }
  ];
  const FILE_UPLOAD_KEY = 'BULK_PATRON_IMPORT';
  const statusOptions = [
    { label: 'Created', name: 'Created', checked: false },
    { label: 'Active', name: 'Active', checked: false },
    { label: 'Blocked', name: 'Blocked', checked: false }
  ];
  const [tableData, setTableData] = useState([]);
  const defaultRows = 25;
  const defaultPage = 0;
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [page, setPage] = useState(defaultPage);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedPatronName, setSelectedPatronName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dateStyles, setDateStyles] = useState({
    top: '50%',
    left: '50%'
  });
  const [showErrortable, toggleErrorTable] = useState(false);
  const [errorTableData, setErrorTableData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');
  const [uploadConfig, setUploadConfig] = useState(null);

  useEffect(() => {
    if (docConfig?.length) {
      const patronUploadConfig = docConfig && docConfig.find((cate) => {
        const { documentCategory } = cate;
        return documentCategory.key === 'PATRON';
      });
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

  const queryParam = {
    where: {},
    order: { [currentColumnSortBy]: currentSortBy },
    take: rowsPerPage,
    page
  };

  const onSearchClick = (value) => {
    setRowsPerPage(defaultRows);
    setPage(defaultPage);
    queryParam.where.firstName = {
      keyword: value || selectedPatronName
    };
    fetchData(defaultRows, defaultPage, selectedPatronName, selectedStatus);
  };

  const onSubmit = (values) => {
    createPatron(values);
  };

  const filterByDate = (value) => {
    if (showStatusFilter) setShowStatusFilter(false);
    setSelectedFromDate(value);
    setShowDateFilter(false);
  };

  const filterByStatus = ({ target: { value } }) => {
    setSelectedStatus(value);
    fetchData(rowsPerPage, page, '', value);
  };

  const handleClearStatus = () => {
    if (selectedStatus.length === 0) return false;
    setSelectedStatus([]);
    setTimeout(() => {
      fetchData(rowsPerPage, page, selectedPatronName);
    }, 500);
    return true;
  };

  const handleCancelButton = () => {
    onCancel();
    setOpenDialog(false);
  };

  const filterPosition = (event) => {
    const { target } = event;
    if (target.innerText === columns[dateTableHeadPosition]) {
      const pos = target.getBoundingClientRect();
      setDateStyles({
        top: `${pos.top + pos.height}px`,
        left: `${pos.left}px`
      });
    }
  };

  const filterPositionOnMount = () => {
    const dateTarget = document.querySelectorAll('TH')[dateTableHeadPosition];
    if (dateTarget) {
      const datePos = dateTarget.getBoundingClientRect();
      setDateStyles({
        top: `${datePos.top + datePos.height}px`,
        left: `${datePos.left}px`
      });
    }
  };
  const handleClearSearch = () => {
    setSelectedPatronName('');
    setTimeout(() => {
      fetchData(rowsPerPage, page, '', selectedStatus);
    }, 500);
  };

  const inputEnterHandler = (e) => {
    if (e.key === 'Enter' && selectedPatronName) {
      setRowsPerPage(defaultRows);
      setPage(defaultPage);
      fetchData(defaultRows, defaultPage, selectedPatronName, selectedStatus);
    }
  };

  useEffect(() => {
    const mData = decodeParams();
    setSelectedPatronName(mData?.q || '');
    if (getConfig) getConfig('PORTAL');
    if (getPatrons) fetchData(rowsPerPage, page, mData?.q || undefined);

    filterPositionOnMount();
    document.addEventListener('click', filterPosition);
    return () => document.removeEventListener('click', filterPosition);
  }, []);

  const filterHendler = (searchURL) => {
    if (searchURL) {
      const mData = JSON.parse(`{"${decodeURI(searchURL).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
      setTableLoading(true);
      const statusData = mData?.status?.split(',') || [];
      if (statusData && statusData.length) {
        queryParam.where.status = {
          in: statusData
        };
      }
      if (mData?.q) {
        queryParam.where.firstName = {
          keyword: mData?.q
        };
      }
      if (mData?.KYCstatus && mData.KYCstatus !== '') {
        queryParam.where.profileCompleted = mData.KYCstatus === 'Verified';
      }
      queryParam.take = rowsPerPage;
      queryParam.page = page + 1;
      queryParam.order = { [currentColumnSortBy]: currentSortBy };
      getPatrons(queryParam).then((res) => {
        setTableData(res.data);
        setDataCount(res.meta.total);
        setTableLoading(false);
      });
    }
  };

  const decodeParamsData = decodeParams();

  const FilterData = [
    {
      name: 'Status',
      value: [
        {
          label: 'Created',
          value: 'Created'
        },
        {
          label: 'Active',
          value: 'Active'
        },
        {
          label: 'Blocked',
          value: 'Blocked'
        }
      ],
      type: 1,
      isSearchable: false,
      key: 'status',
      selectedValue: {
        search: '',
        value: decodeParamsData?.status?.split(',') || []
      }
    },
    {
      name: 'KYC Status',
      value: [
        {
          label: 'Verified',
          value: 'Verified'
        },
        {
          label: 'Not Verified',
          value: 'Not Verified'
        }
      ],
      type: 2,
      isSearchable: false,
      key: 'KYCstatus',
      selectedValue: {
        search: '',
        value: (decodeParamsData?.KYCstatus) ? [decodeParamsData.KYCstatus] : []
      }
    }
  ];

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    patronCreate === 'failed' ? setOpenDialog(true) : setOpenDialog(false);
  }, [patronCreate]);

  useEffect(() => {
    document.addEventListener('keyup', inputEnterHandler);
    return () => document.removeEventListener('keyup', inputEnterHandler);
  });

  const { user } = useAuth0();
  const saveMetaData = async (
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
        uploadPatronsCsv(csvdata.data.url).then((validationData) => {
          if (validationData.error) {
            if (Array.isArray(validationData.message)) {
              setErrorTableData(validationData.message);
              toggleErrorTable(true);
            } else {
              dispatch({ type: 'show', payload: validationData.message, msgType: 'error' });
            }
          } else {
            handleModalClose(false);
            const addedCount = validationData.data.added.length;
            const failedCount = validationData.data.failed.length;
            // eslint-disable-next-line max-len
            const failedCountMsg = failedCount
              ? `${failedCount} duplicate ${failedCount === 1 ? 'Patron' : 'Patrons'} are not imported.`
              : '';
            const message = `${addedCount} ${addedCount === 1 ? 'Patron' : 'Patrons'} imported. ${failedCountMsg}`;
            dispatch({ type: 'show', payload: message, msgType: addedCount > 0 ? 'success' : 'error' });
          }
        });
      });
    });
  };

  const handleModalClose = (val) => {
    toggleErrorTable(val);
    fetchData(rowsPerPage, page);
  };

  const handleRowClick = ({ id }) => {
    history.push(`/patrons/${id}`);
  };
  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      patronCode: 'patronCode',
      name: 'firstName',
      email: 'email',
      status: 'status',
      profileCompleted: 'profileCompleted',
      createdAt: 'createdAt'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      fetchData(rowsPerPage, page, undefined, undefined, { [key]: isDesc });
    }
  };
  const fetchData = (
    limit,
    offset,
    patronName,
    statusSelected,
    sortBy = { [currentColumnSortBy]: currentSortBy }
  ) => {
    setTableLoading(true);
    const mData = decodeParams();
    const statusData = mData?.status?.split(',') || [];
    if ((statusData && statusData.length) || (statusSelected && statusSelected.length)) {
      queryParam.where.status = {
        in: statusData || statusSelected || selectedStatus
      };
    }
    if ((patronName && patronName.length) || mData?.q || selectedPatronName) {
      queryParam.where.firstName = {
        keyword: mData?.q || patronName || selectedPatronName
      };
    }
    if (mData?.KYCstatus && mData.KYCstatus !== '') {
      queryParam.where.profileCompleted = mData.KYCstatus === 'Verified';
    }
    queryParam.take = limit;
    queryParam.page = offset + 1;
    queryParam.order = sortBy;
    getPatrons(queryParam).then((res) => {
      setTableData(res.data);
      setDataCount(res.meta.total);
      setTableLoading(false);
    });
  };

  const handleRowsChange = (rowNo) => {
    setRowsPerPage(rowNo);
    fetchData(rowNo, page, selectedPatronName, selectedStatus);
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
            />
          )}
        </>
      )
    }
  ];

  const errorTree = errorTableData?.map((error) => ({
    key: error.rowNumber,
    label: (
      <Grid item={true} className={Style.errorLabel}>
        {`[Row: ${error.rowNumber}] has ${error.errors.length} error(s):`}
      </Grid>
    ),
    data: error.errors.map((field, fieldIndex) => ({ key: `${error.rowNumber}${fieldIndex}`,
      label: (
        <Grid item={true} className={Style.messageLabel}>
          <FiberManualRecordIcon className={Style.messageBullet} />
          {`Invalid/Empty ${field}`}
        </Grid>
      ) }))
  }));

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader
        pageName="Patrons"
        searchValue={selectedPatronName}
        searchValueHendler={setSelectedPatronName}
        searchHendler={onSearchClick}
        searchClearHendler={handleClearSearch}
        actions={toolBarActions}
        FilterData={FilterData}
        filterHendler={filterHendler}
      />
      {openDialog && (
        <DialogComponent onClose={handleCancelButton}>
          <CreatePatron
            onSubmit={onSubmit}
            formTitle="Create Patron"
            handleCancelButton={handleCancelButton}
            errorMsg={errorMsg}
          />
        </DialogComponent>
      )}
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          fetchNextData={(limit, offset, newPage) => fetchData(
            limit,
            newPage,
            selectedPatronName,
            selectedStatus,
            undefined
          )}
          totalCount={totalDataCount}
          tableColumns={tableColumns}
          tableData={tableData}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isLoading={isTableLoading}
          handleRowClick={handleRowClick}
          handleCheckBoxValue={filterByStatus}
          isStatusCheckboxRequired={false}
          statusOptions={statusOptions}
          checkedOptions={selectedStatus}
          handleClearStatus={handleClearStatus}
          onChangeSort={onChangeSort}
          disableFilter={false}
          initialStateProps={{ sortBy: [
            {
              id: 'createdAt',
              desc: true
            }
          ] }}
        />
      </Grid>
      {showDateFilter && (
        <DateFilter
          onDateSelect={filterByDate}
          style={dateStyles}
          selectedDate={selectedFromDate}
        />
      )}
      {(showErrortable) && (
        <DialogComponent onClose={() => toggleErrorTable(false)}>
          <Grid item={true} className={Style.treeViewContainer}>
            <Grid item={true} className={Style.errorHeading}>
              <img src="/assets/close-filled.svg" alt="Error" />
              Upload failed: Errors found in
              {' '}
              {errorTableData?.length}
              {' '}
              {errorTableData?.length === 1 ? 'row' : 'rows'}
            </Grid>
            <TreeViews data={errorTree} />
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

PatronList.propTypes = {
  docConfig: PropTypes.arrayOf(PropTypes.shape({})),
  getPatrons: PropTypes.func,
  createPatron: PropTypes.func,
  patronCreate: PropTypes.string,
  onCancel: PropTypes.func,
  errorMsg: PropTypes.string,
  getConfig: PropTypes.func
};

PatronList.defaultProps = {
  patronCreate: null,
  getPatrons: () => {},
  createPatron: () => {},
  onCancel: () => {},
  errorMsg: null,
  docConfig: null,
  getConfig: () => {}
};

export default PatronList;
