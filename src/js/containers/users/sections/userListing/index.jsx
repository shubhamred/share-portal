import React, { useEffect, useState } from 'react';
import {
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import { DialogComponent, AdvanceTable, CustomeHeader } from 'app/components';
import { getPortalUserList, deletePortalUser } from 'app/containers/users/saga';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import NewPortalUserForm from './components/addUser';
import global from '../../../global.scss';

const UserListing = () => {
  const [selectedUser, setUser] = useState(null);

  // console.log(anchorEl);

  const tableColumns = [
    {
      Header: 'Name',
      accessor: 'firstName',
      disableSortBy: false,
      Cell: ({ row }) => `${row.original.firstName || ''} ${row.original.middleName || ''} ${
        row.original.lastName || ''
      }`
    },
    {
      Header: 'Email',
      accessor: 'email',
      disableSortBy: false
    },
    {
      Header: 'Mobile',
      accessor: 'mobile',
      disableSortBy: false
    },
    {
      Header: 'Role',
      accessor: 'role',
      disableSortBy: true
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableSortBy: true
    },
    {
      Header: 'Actions',
      accessor: 'id',
      disableSortBy: true,
      Cell: (row) => (
        <Grid container={true} alignItems="center">
          <Grid item={true}>
            <IconButton disabled={true} title="Assign Roles">
              <AssessmentIcon />
            </IconButton>
          </Grid>
          <Grid item={true}>
            <IconButton disabled={true} color="secondary" title="Block">
              <BlockIcon />
            </IconButton>
          </Grid>
          <Grid item={true}>
            <IconButton
              onClick={() => {
                toggleDeleteDialogue(true);
                setUser(row.row.original);
              }}
              color="secondary"
              title="Delete"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
      )
    }
  ];

  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [roleDialogueOpen, toggleRoleDialogue] = useState(false);
  const [userDialogueOpen, toggleUserDialogue] = useState(false);
  const [deleteDialogueOpen, toggleDeleteDialogue] = useState(false);
  const [currentSortBy, setSortBy] = useState('DESC');
  const [currentColumnSortBy, setCurrentColumnSortBy] = useState('createdAt');

  const toolbarActions = [
    {
      label: 'Invite User',
      onClick: () => toggleUserDialogue(true),
      variant: 'outlined',
      otherProps: {
        startIcon: <AddIcon />
      }
    }
  ];

  const getData = (limit, offset, order) => {
    const query = {
      take: limit,
      page: offset,
      order: order || { [currentColumnSortBy]: currentSortBy }
    };
    getPortalUserList(query).then((res) => {
      if (res.data) {
        setTableData(res.data);
        setDataCount(res.meta.total);
      }
      setTableLoading(false);
    });
  };

  const onChangeSort = (sortBy) => {
    if (!sortBy.length) {
      return;
    }
    const isDesc = sortBy[0].desc ? 'DESC' : 'ASC';
    const sortColumnList = {
      firstName: 'firstName',
      email: 'email',
      mobile: 'mobile'
    };
    const key = sortColumnList[sortBy[0].id];
    if (isDesc !== currentSortBy || key !== currentColumnSortBy) {
      setSortBy(isDesc);
      setCurrentColumnSortBy(key);
      getData(rowsPerPage, page + 1, { [key]: isDesc });
    }
  };

  useEffect(() => {
    getData(rowsPerPage, page + 1);
  }, []);

  const fetchTableData = (limit, offset, newPage) => {
    getData(limit, newPage + 1);
  };

  const handleDialogueClose = (val) => {
    if (val) {
      getData(rowsPerPage, page + 1);
    }
    toggleUserDialogue(false);
  };

  const handleDeleteClose = () => {
    toggleDeleteDialogue(false);
    setUser(null);
  };

  const handleDeleteUser = () => {
    if (selectedUser?.id) {
      deletePortalUser(selectedUser.id).then((res) => {
        if (res.data) {
          getData(rowsPerPage, page + 1);
          setUser(null);
          toggleDeleteDialogue(false);
        }
      });
    }
  };

  return (
    <Grid direction="column">
      <CustomeHeader isFilter={false} isSearch={false} pageName="All Users" actions={toolbarActions} />
      <Grid item={true} className={global.tableStyle}>
        <AdvanceTable
          isStatusCheckboxRequired={false}
          tableColumns={tableColumns}
          tableData={tableData}
          rowsPerPage={rowsPerPage}
          isLoading={isTableLoading}
          totalCount={totalDataCount}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          fetchNextData={(limit, offset, newPage) => fetchTableData(limit, offset, newPage)}
          onChangeSort={onChangeSort}
        />
      </Grid>
      <Grid item={true} xs={12}>
        {roleDialogueOpen && (
          <DialogComponent onClose={() => toggleRoleDialogue(false)}>
            <Grid container={true}>
              <Grid item={12}>
                {selectedUser.name}
                {' '}
                &gt; Assign Roles
              </Grid>
            </Grid>
          </DialogComponent>
        )}
      </Grid>
      <Grid item={true} xs={12}>
        {userDialogueOpen && (
          <DialogComponent onClose={handleDialogueClose} title="Invite User">
            <NewPortalUserForm onClose={handleDialogueClose} />
          </DialogComponent>
        )}
      </Grid>
      <Grid item={true} xs={12}>
        <Dialog
          open={deleteDialogueOpen}
          onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Conform Delete User ?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} color="secondary" autoFocus={true}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default React.memo(UserListing);
