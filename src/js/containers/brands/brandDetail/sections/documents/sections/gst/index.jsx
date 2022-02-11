/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import {
  Grid, Button
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreIcon from '@material-ui/icons/MoreVert';
import { AdvanceTable, Tabs, Tooltip, DialogComponent } from 'app/components';
import { getCompanyGstDetails, moveFilePosition, parseGstAccounts, updateDocumentStatus } from 'app/containers/brands/saga';
import { getDocs, getDocsbyId, viewImage, removeFile } from 'app/containers/patrons/saga';
import { formatDateStandard, getImageByFormat } from 'app/utils/utils';
import { groupBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomCheckBox from '../../../../../../../components/check-box/custom-checkbox';
import NestedDrodown from '../../../../../../../components/drop-down/nestedDropDown';
import { getStateName } from '../../../gst/sections/addGst/gstStatesList';
import styles from '../../styles.scss';
import { DocumentStatusColors, DocumentStatuses, GSTMoreMenuList, MoreMenuOptions } from '../data';

const columnStyles = {
  border: 'none',
  color: '#212529',
  fontWeight: 500,
  fontSize: '14px'
};

const NavbarPopoverEl = (name, menuList = [], hideIcon = false, title = '', onItemClick) => {
  const tipEl = (
    <div style={{ width: '180px', padding: '2px 10px' }}>
      <p className={styles.menuTitle}>{title}</p>
      {menuList.map((item) => (
        <ListItem
          button={true}
          rel="noopener"
          key={item}
        >
          <ListItemText primary={item} className={styles.menuItem} onClick={() => onItemClick(item)} />
        </ListItem>
      ))}
    </div>
  );
  const renderEl = (
    <div>
      <Tooltip title={tipEl}>
        <div className={styles.menuLabel} style={hideIcon ? { margin: 0 } : {}}>
          {name}
          {!hideIcon && (<ArrowDropDownIcon />)}
        </div>
      </Tooltip>
    </div>
  );
  return renderEl;
};

const BrandGST = (props) => {
  const { company, setDialogConfig } = props;
  const dispatch = useDispatch();
  const inputEl = useRef(null);

  const [gstAccounts, setGstAccounts] = useState([]);
  const [gstFiles, setGstFiles] = useState({});
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [docList, setDocList] = useState([]);
  const [selectedTabAccount, setSelectedAccount] = useState({});
  const [isCheckboxVisible, toggleCheckbox] = useState(false);
  const [selectedRowIDs, setSelectedRows] = useState([]);
  const [allChecked, toggleAllCheckbox] = useState(false);
  const [page, setPage] = useState(10);
  const [apiQuery, setQueryConfig] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const otherGstAccounts = gstAccounts.filter((account) => account.id !== selectedTabAccount?.id) || [];
  const showMultiActionbar = selectedRowIDs.length > 0;

  GSTMoreMenuList[0].subList = [];
  GSTMoreMenuList[0].subList.push(...otherGstAccounts.map((account) => getStateName(account?.stateCode)));

  const query = {
    where: {
      resourceCode: ''
    },
    take: 50
  };

  useEffect(() => {
    if (company?.companyCode) getGstData();
  }, [company]);

  useEffect(() => {
    if (allChecked && docList?.length > 0) {
      setSelectedRows(docList.map((file) => file.id));
    } else {
      setSelectedRows([]);
    }
  }, [allChecked]);

  useEffect(() => {
    if (gstAccounts.length > 0) {
      handleAccordionToggle(gstAccounts[0].id, true); // fetch selected bank documents
      setSelectedAccount(gstAccounts[0]);
    }
  }, [gstAccounts]);

  useEffect(() => {
    if (Object.keys(gstFiles)?.length > 0) {
      const fileList = gstFiles[selectedTabAccount.id]
        ? Object.keys(gstFiles[selectedTabAccount.id])
          .map((key) => gstFiles[selectedTabAccount.id][key]
            .map((a) => a.files)
            .flat(Infinity)
          )
          .flat(Infinity)
        : [];
      setDocList(fileList);
    }
  }, [gstFiles, selectedTabAccount]);

  useEffect(() => {
    sortDocuments();
  }, [apiQuery]);

  const fetchData = () => { };

  const getGstData = () => {
    query.where.resourceCode = company?.companyCode;
    getCompanyGstDetails(query).then((res) => {
      if (res.data) {
        setGstAccounts(res.data);
      }
    });
  };

  const handleAccordionToggle = (accId, expanded) => {
    if (expanded) {
      getGstDocs(accId);
    }
  };

  const handleChange = (newValue) => {
    const accountID = gstAccounts[newValue]?.id;
    setSelectedAccount(gstAccounts[newValue]);
    handleAccordionToggle(accountID, true);
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    if (apiQuery.order?.status !== isDesc) {
      if (sortBy[0]?.desc) {
        setQueryConfig({ ...apiQuery, order: { status: 'DESC' } });
      } else {
        setQueryConfig({ ...apiQuery, order: { status: 'ASC' } });
      }
    }
  };

  const setFiles = (id, response = {}) => {
    const groupedDocs = groupBy(response.data, 'docType');
    if (Object.keys(groupedDocs).length) {
      setGstFiles((prevState) => ({
        ...prevState,
        [id]: groupedDocs
      }));
      setSelectedRows([]); // reset row selections
    }
  };

  const sortDocuments = () => {
    const selectedGstFiles = gstFiles[selectedTabAccount?.id];
    if (selectedGstFiles) {
      const docArray = Object.values(selectedGstFiles)[0];
      if (docArray?.length > 0) {
        getDocsbyId(docArray[0]?.id, apiQuery)
          .then((res) => {
            // setFiles(selectedTabAccount?.id, { data: [res.data] });
          });
      }
    }
  };

  const getGstDocs = (id) => {
    getDocs(id, 'GST').then((res) => {
      if (res.data) {
        setFiles(id, res);
      }
    });
  };

  const handleMoveFiles = (destinationDocumentId) => {
    const fileIDs = inputEl.current ? [inputEl.current] : selectedRowIDs;
    const payload = {
      files: fileIDs.map((id) => ({ sourceFileId: id, destinationDocumentId }))
    };
    moveFilePosition(payload)
      .then((data) => {
        if (data?.errors.length === 0) {
          setDialogConfig({
            open: true,
            title: `Position of ${fileIDs.length} file(s) has been moved`,
            subTitle: `The position of ${fileIDs.length} file(s) is moved.`
          });
        } else {
          dispatch({
            type: 'show',
            payload: data.errors,
            msgType: 'error'
          });
        }
        getGstDocs(selectedTabAccount.id);
      });
  };

  const getTargetDocData = (target) => {
    const targetAccount = gstAccounts.find((account) => (account.gstin === target || getStateName(account?.stateCode) === target));
    const { id } = targetAccount;
    if (gstFiles[id]?.BANK_STATEMENT) {
      handleMoveFiles(gstFiles[id]?.BANK_STATEMENT[0]?.id);
      return;
    }
    getDocs(id, 'GST').then((res) => {
      if (res.data) {
        handleMoveFiles(res.data[0]?.id);
      }
    });
  };

  const handleFetchDetails = () => {
    if (!selectedTabAccount?.id) return;
    parseGstAccounts([selectedTabAccount?.id]).then((res) => {
      if (res.error) {
        dispatch({ type: 'show', payload: res.message, msgType: 'error' });
        toggleCheckbox(false);
        setSelectedAccounts({});
      } else if (res.message) {
        dispatch({ type: 'show', payload: 'Parse requested raised successfully', msgType: 'success' });
        toggleCheckbox(false);
        setSelectedAccounts({});
      }
    });
  };

  const getFileCount = (accountId) => {
    if (gstFiles[accountId] && Object.keys(gstFiles[accountId]).length) {
      return !Object.keys(gstFiles[accountId])
        .includes('GST');
    }
    return true;
  };

  const handleCheckChange = (checked, id) => {
    if (checked && !selectedRowIDs.includes(id)) {
      setSelectedRows([...selectedRowIDs, id]);
    } else {
      const IDs = [...selectedRowIDs];
      IDs.splice(IDs.indexOf(id), 1);
      setSelectedRows(IDs);
    }
  };

  const handleRowsChange = (rowNo) => {
    // setRowsPerPage(rowNo);
    fetchData(rowNo, 2);
  };

  const handleCentralCheckbox = (val) => {
    toggleAllCheckbox(val);
  };

  const handleStatusChange = (status) => {
    const fileIDs = inputEl.current ? [inputEl.current] : selectedRowIDs;
    const payload = {
      files: fileIDs.map((id) => ({ fileId: id, status }))
    };
    updateDocumentStatus(payload).then((data) => {
      if (data?.errors.length === 0) {
        setDialogConfig({
          open: true,
          title: `Status of ${fileIDs.length} file(s) has been updated`,
          subTitle: `The status of ${fileIDs.length} file(s) is updated to ${status}.`
        });
      } else {
        dispatch({
          type: 'show',
          payload: data.errors,
          msgType: 'error'
        });
      }
      inputEl.current = null;
      if (selectedTabAccount?.id) {
        getGstDocs(selectedTabAccount.id);
      }
    });
  };

  const handleFileDelete = () => {
    const fileIDs = inputEl?.current || '';
    removeFile(fileIDs).then((res) => {
      if (res.data) {
        const fileList = [...docList].filter((file) => file.id !== fileIDs);
        setOpenDialog(false);
        setDocList(fileList);
      }
    });
  };

  const handleMoreClick = (data = {}) => {
    const { parent, child } = data;
    switch (true) {
      case parent === MoreMenuOptions.MOVE_FILES && typeof child !== 'undefined':
        getTargetDocData(child);
        break;
      case parent === MoreMenuOptions.RUN_PERFIOS:
        handleFetchDetails();
        break;
      case parent === MoreMenuOptions.DELETE:
        setOpenDialog(true);
        break;
      case parent === MoreMenuOptions.UPDATE_STATUS && typeof child !== 'undefined':
        handleStatusChange(child);
        break;
      default:
        break;
    }
  };

  const tableColumns = [
    {
      Header: <CustomCheckBox defaultChecked={allChecked} indeterminate={true} onChange={handleCentralCheckbox} />,
      accessor: 'selection',
      customStyle: { ...columnStyles, maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <CustomCheckBox
          onChange={(val) => handleCheckChange(val, row.row?.original.id)}
          defaultChecked={selectedRowIDs.includes(row.row?.original.id)}
        />
      )
    },
    {
      Header: 'Document Name',
      accessor: 'fileName',
      customStyle: columnStyles,
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          <img
            src={getImageByFormat(row.row?.original?.contentType)}
            alt="Document"
            className={styles.fileImage}
          />
          {row.value}
        </span>
      )
    },
    {
      Header: 'Created at',
      accessor: 'createdAt',
      disableSortBy: true,
      Cell: (row) => <span className={styles.tableText}>{formatDateStandard(row.value)}</span>,
      customStyle: columnStyles,
      disableFilters: true
    },
    {
      Header: 'Status',
      accessor: 'status',
      customStyle: columnStyles,
      disableSortBy: false,
      disableFilters: true,
      Cell: (row) => (
        <div className={styles.tableText}>
          <img src="/assets/black-dot.svg" style={{ filter: DocumentStatusColors[row.value] }} alt="status" />
          {' '}
          {row.value || 'Pending'}
        </div>)
    },
    {
      Header: 'Download',
      accessor: 'id',
      customStyle: columnStyles,
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <IconButton
          aria-label="Download"
          size="small"
          onClick={() => viewImage(row.value)}
        >
          <img src="/assets/downloadIcon.svg" alt="Download" height={16} />
        </IconButton>
      )
    },
    {
      Header: 'More',
      accessor: 'more',
      customStyle: { ...columnStyles, position: 'relative' },
      disableSortBy: true,
      Cell: (row) => {
        const moreMenuList = [...GSTMoreMenuList];
        if (row?.row?.original?.status && row.row.original.status !== 'Verified') {
          moreMenuList.push({
            label: MoreMenuOptions.DELETE
          });
        }
        return (
          <NestedDrodown list={moreMenuList} onClick={handleMoreClick}>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              id={row.row?.original.id}
              className={styles.moreIcon}
              onClick={() => {
                inputEl.current = row.row?.original.id;
              }}
            >
              <MoreIcon />
            </IconButton>
          </NestedDrodown>
        );
      },
      disableFilters: true
    }
  ];

  const fileStatus = docList.findIndex((file) => file.status === 'Approved');

  const gstAccountsTab = gstAccounts.map((account) => ({
    label: `${getStateName(account.stateCode)}`,
    content: (
      <Grid container={true}>
        <Grid item={true} xs={12} className={styles.bankSummary}>
          <p className={styles.bankName}>
            {getStateName(selectedTabAccount.stateCode)}
          </p>
          <p className={styles.accountType}>
            {selectedTabAccount?.gstin}
          </p>
          {showMultiActionbar && (
          <>
            <p className={styles.selected}>
              {`${selectedRowIDs.length} files selected`}
            </p>
            <p className={styles.moveFiles}>
              {otherGstAccounts?.length > 0 && (
                NavbarPopoverEl('Move files', otherGstAccounts.map((item) => item?.gstin), false, 'Move to', getTargetDocData)
            )}
            </p>
            <p className={styles.changeStatus}>
              {NavbarPopoverEl('Change Status', Object.values(DocumentStatuses), false, 'Update Status', handleStatusChange)}
            </p>
          </>
          )}
          {fileStatus >= 0 ? (
            <p
              className={styles.menuLabel}
              style={{ marginLeft: showMultiActionbar ? '20px' : 'auto' }}
              onClick={handleFetchDetails}
            >
              {MoreMenuOptions.RUN_PERFIOS}
            </p>
          ) : (
            <div style={{ marginLeft: showMultiActionbar ? '20px' : 'auto' }}>
              <Tooltip
                anchorOriginVertical="center"
                anchorOriginHorizontal="right"
                transformOriginHorizontal="right"
                title="Please move GST statements to the approved status to run Finbit."
              >
                <p
                  className={styles.menuLabelDisable}
                >
                  {MoreMenuOptions.RUN_PERFIOS}
                </p>
              </Tooltip>
            </div>
          )}
        </Grid>
        <Grid item={true} xs={12}>
          <Grid container={true} alignItems="center" className={styles.tableContainer}>
            <AdvanceTable
              fetchNextData={(limit, offset, newPage) => fetchData(limit, newPage)}
              totalCount={10}
              tableColumns={tableColumns}
              tableData={docList}
              rowsPerPage={10}
              setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
              currentPage={page}
              setPage={(pageNo) => setPage(pageNo)}
              isLoading={false}
              isStatusCheckboxRequired={false}
              disableFilter={false}
              isPaginationRequired={false}
              onChangeSort={onChangeSort}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }));

  return (
    <Grid container={true}>
      <Tabs tabList={gstAccountsTab} refTab={(ref) => { const tabRef = ref; }} onChange={handleChange} scrollable={true} />
      {openDialog && (
        <DialogComponent
          onClose={() => setOpenDialog(false)}
          title=""
          closeButton={false}
        >
          <Grid container="true" className={styles.messageContainer}>
            <Grid item={true} md={12} className={styles.message}>
              Are you sure you want to delete the file?
            </Grid>
            <Grid item={true} md={12}>
              <Grid
                container={true}
                justify="flex-end"
              >
                <Grid item={true}>
                  <Button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                  >
                    No
                  </Button>
                </Grid>
                <Grid item={true}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleFileDelete();
                    }}
                  >
                    Yes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

export default BrandGST;
