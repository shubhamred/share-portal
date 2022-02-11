/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import {
  Accordion, AccordionDetails, AccordionSummary, Checkbox, Divider, Grid, Button
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreIcon from '@material-ui/icons/MoreVert';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { AdvanceTable, SingleDocument, Tabs, Tooltip, DialogComponent } from 'app/components';
import { getAccounts, parseAccount, updateDocumentStatus, moveFilePosition } from 'app/containers/brands/saga';
import { getDocs, getDocsbyId, viewImage, removeFile } from 'app/containers/patrons/saga';
import { formatDateStandard, getImageByFormat, getVerifiedImage } from 'app/utils/utils';
import { groupBy, startCase } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import CustomCheckBox from '../../../../../../../components/check-box/custom-checkbox';
import styles from '../../styles.scss';
import { DocumentStatusColors, DocumentStatuses, MoreMenuList, MoreMenuOptions } from '../data';
import NestedDrodown from '../../../../../../../components/drop-down/nestedDropDown';

const columnStyles = {
  // backgroundColor: '#fff',
  border: 'none',
  color: '#212529',
  fontWeight: 500,
  fontSize: '14px'
};

const NavbarPopoverEl = (name, menuList = [], hideIcon = false, title = '', onItemClick) => {
  const tipEl = (
    <div style={{ width: '160px', padding: '2px 10px' }}>
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

const BrandBanking = (props) => {
  const { brandCode, setDialogConfig } = props;
  const dispatch = useDispatch();
  const inputEl = useRef(null);

  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankStatements, setBankStatements] = useState({});
  const [docList, setDocList] = useState([]);
  const [selectedTabAccount, setSelectedAccount] = useState({});
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [targetDocData, setTargetDocData] = useState({});
  const [isCheckboxVisible, toggleCheckbox] = useState(false);
  const [allChecked, toggleAllCheckbox] = useState(false);
  const [selectedRowIDs, setSelectedRows] = useState([]);
  const [page, setPage] = useState(10);
  const [query, setQueryConfig] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const showMultiActionbar = selectedRowIDs.length > 0;
  const otherBankAccounts = bankAccounts.filter((account) => account.id !== selectedTabAccount?.id) || [];

  MoreMenuList[0].subList = [];
  MoreMenuList[0].subList.push(...otherBankAccounts.map((account) => account?.bank.code));

  useEffect(() => {
    if (brandCode) getBankAcconts();
  }, [brandCode]);

  useEffect(() => {
    if (bankAccounts.length > 0) {
      handleAccordionToggle(bankAccounts[0].id, true); // fetch selected bank documents
      setSelectedAccount(bankAccounts[0]);
    }
  }, [bankAccounts]);

  useEffect(() => {
    if (Object.keys(bankStatements)?.length > 0) {
      const fileList = bankStatements[selectedTabAccount.id]
        ? Object.keys(bankStatements[selectedTabAccount.id])
          .map((key) => bankStatements[selectedTabAccount.id][key]
            .map((a) => a.files)
            .flat(Infinity)
          )
          .flat(Infinity)
        : [];
      setDocList(fileList);
    }
  }, [bankStatements, selectedTabAccount]);

  useEffect(() => {
    sortDocuments();
  }, [query]);

  useEffect(() => {
    if (allChecked && docList?.length > 0) {
      setSelectedRows(docList.map((file) => file.id));
    } else {
      setSelectedRows([]);
    }
  }, [allChecked]);

  const getBankAcconts = () => {
    getAccounts(brandCode).then((res) => {
      if (res.data) {
        setBankAccounts(res.data);
      }
    });
  };

  const handleAccordionToggle = (accId, expanded) => {
    if (expanded) {
      getBankDocs(accId);
    }
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    if (query.order?.status !== isDesc) {
      if (sortBy[0]?.desc) {
        setQueryConfig({ ...query, order: { status: 'DESC' } });
      } else {
        setQueryConfig({ ...query, order: { status: 'ASC' } });
      }
    }
  };

  const setFiles = (id, response = {}) => {
    const groupedDocs = groupBy(response.data, 'docType');
    if (Object.keys(groupedDocs).length) {
      setBankStatements((prevState) => ({
        ...prevState,
        [id]: groupedDocs
      }));
      setSelectedRows([]); // reset row selections
    }
  };

  const sortDocuments = () => {
    const selectedBankStatements = bankStatements[selectedTabAccount?.id];
    if (selectedBankStatements) {
      const docArray = Object.values(selectedBankStatements)[0];
      if (docArray?.length > 0) {
        getDocsbyId(docArray[0]?.id, query)
          .then((res) => {
            setFiles(selectedTabAccount?.id, { data: [res.data] });
          });
      }
    }
  };

  const getBankDocs = (id) => {
    getDocs(id, 'BANK_ACCOUNT').then((res) => {
      if (res.data) {
        setFiles(id, res);
      }
    });
  };

  const getTargetDocData = (target) => {
    const targetAccount = bankAccounts.find((account) => account.bank.code === target);
    const { id } = targetAccount;
    if (bankStatements[id]?.BANK_STATEMENT) {
      handleMoveFiles(bankStatements[id]?.BANK_STATEMENT[0]?.id);
      return;
    }
    getDocs(id, 'BANK_ACCOUNT').then((res) => {
      if (res.data) {
        handleMoveFiles(res.data[0]?.id);
      }
    });
  };

  const handleCheckboxChange = (id, checked) => {
    setSelectedAccounts((prevState) => ({ ...prevState, [id]: checked }));
  };

  const handleFetchDetails = () => {
    // const accIds = Object.keys(selectedAccounts).filter(
    //   (s) => selectedAccounts[s]
    // );
    if (!selectedTabAccount?.id) return;
    parseAccount([selectedTabAccount?.id]).then((res) => {
      if (res.message) {
        dispatch({
          type: 'show',
          payload: 'Parse request Raised Successfully',
          msgType: 'success'
        });
        toggleCheckbox(false);
        setSelectedAccounts({});
      }
    });
  };

  const getFileCount = (accountId) => {
    if (
      bankStatements[accountId]
      && Object.keys(bankStatements[accountId]).length
    ) {
      return !Object.keys(bankStatements[accountId]).includes('BANK_STATEMENT');
    }
    return true;
  };

  const handleCentralCheckbox = (val) => {
    toggleAllCheckbox(val);
  };

  const handleChange = (newValue) => {
    const accountID = bankAccounts[newValue]?.id;
    setSelectedAccount(bankAccounts[newValue]);
    handleAccordionToggle(accountID, true);
  };

  const fetchData = (limit, offset) => { };

  const handleRowsChange = (rowNo) => {
    // setRowsPerPage(rowNo);
    fetchData(rowNo, 2);
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
        getBankDocs(selectedTabAccount.id);
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
        getBankDocs(selectedTabAccount.id);
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
      case parent === MoreMenuOptions.RUN_FINBIT:
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
        <div className={styles.selectionBox}>
          <CustomCheckBox
            onChange={(val) => handleCheckChange(val, row.row?.original.id)}
            defaultChecked={selectedRowIDs.includes(row.row?.original.id)}
          />
        </div>
      )
    },
    {
      Header: 'Document Name',
      accessor: 'fileName',
      customStyle: { ...columnStyles, marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          <img
            src={getImageByFormat(row.row?.original?.contentType)}
            alt="Document"
            // className={styles.fileImage}
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
      customStyle: columnStyles,
      disableSortBy: true,
      Cell: (row) => {
        const moreMenuList = [...MoreMenuList];
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

  const bankAccountsTab = bankAccounts.map((account) => ({
    label: `${account.bank.code} ${account.accountNumber
      ? account.accountNumber.substr(
        account.accountNumber.length - 4
      )
      : ''}`,
    content: (
      <Grid container={true}>
        <Grid item={true} xs={12} className={styles.bankSummary}>
          <p className={styles.bankName}>{selectedTabAccount?.bank?.name}</p>
          <p className={styles.accountType}>{selectedTabAccount?.accountType && `${selectedTabAccount.accountType} Account`}</p>
          <p className={styles.passwordLabel}>
            Statement Password:
            <span className={styles.password}>
              {` `}
              {selectedTabAccount.statementPassword || 'N.A.'}
            </span>
          </p>
          {showMultiActionbar && (
          <>
            <p className={styles.selected}>
              {`${selectedRowIDs.length} files selected`}
            </p>
            <p className={styles.moveFiles}>
              {otherBankAccounts?.length > 0 && (
                NavbarPopoverEl('Move files', otherBankAccounts.map((item) => item.bank.code), false, 'Move to', getTargetDocData)
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
              {MoreMenuOptions.RUN_FINBIT}
            </p>
          ) : (
            <div style={{ marginLeft: showMultiActionbar ? '20px' : 'auto' }}>
              <Tooltip
                anchorOriginVertical="center"
                anchorOriginHorizontal="right"
                transformOriginHorizontal="right"
                title="Please move Bank statements to the approved status to run Finbit."
              >
                <p
                  className={styles.menuLabelDisable}
                >
                  {MoreMenuOptions.RUN_FINBIT}
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
              columnWidth={[1, 35, 15, 15, 15, 10]}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }));

  return (
    <Grid container={true}>
      <Grid container={true}>
        <Tabs tabList={bankAccountsTab} refTab={(ref) => { const tabRef = ref; }} onChange={handleChange} scrollable={true} />
      </Grid>
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

export default BrandBanking;
