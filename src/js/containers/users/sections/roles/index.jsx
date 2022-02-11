import React from 'react';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { CustomeHeader } from 'app/components';
import AddIcon from '@material-ui/icons/Add';

const UserRoles = () => {
  const toolbarActions = [
    {
      label: 'Create Role',
      otherProps: {
        startIcon: <AddIcon />
      },
      onClick: () => {}
    }
  ];

  const roles = [
    {
      name: 'Admin',
      description: 'A role with all privileges'
    },
    {
      name: 'Customer',
      description: `This role is for Klub's Approved Customers`
    }
  ];

  return (
    <Grid container={true}>
      <CustomeHeader pageTitle="Roles" isSearch={false} isFilter={false} actions={toolbarActions} />
      <Grid item={true} xs={12} style={{ padding: '0px 24px' }}>
        <p>
          Create and manage Roles for your applications. Roles contain collections of Permissions
          and can be assigned to Users.
        </p>
      </Grid>
      <Grid item={true} xs={12} style={{ padding: '0px 24px' }}>
        <List>
          <ListItem divider={true}>
            <ListItemText>
              <Grid container={true}>
                <Grid item={true} xs={4}>
                  Name
                </Grid>
                <Grid item={true}>Description</Grid>
              </Grid>
            </ListItemText>
            <ListItemSecondaryAction>View Details</ListItemSecondaryAction>
          </ListItem>
          {roles.map((role) => (
            <ListItem divider={true}>
              <ListItemText>
                <Grid container={true}>
                  <Grid item={true} xs={4}>
                    {role.name}
                  </Grid>
                  <Grid item={true}>{role.description}</Grid>
                </Grid>
              </ListItemText>
              <ListItemSecondaryAction>
                <Button>View Details</Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default UserRoles;
