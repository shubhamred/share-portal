import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import routes from '../../routes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    overflowX: 'hidden'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between'
  },
  draweLogo: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px'
  },
  title: {
    padding: '8px'
  },
  drawerImgContainer: {
    '& img': {
      width: '25px',
      height: '25px'
    }
  },
  menuBtn: {
    color: '#2c2fb7'
  }
}));

export default function EnhancedDrawer(props) {
  const classes = useStyles();
  const { open, handleClose } = props;

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <div className={classes.draweLogo}>
          <Link to="/" style={{ width: '72px' }}>
            <img alt="Klub" src="/assets/klub-logo.svg" />
          </Link>
          <Typography className={classes.title} variant="h5" noWrap={true}>
            Portal
          </Typography>
        </div>
        <IconButton onClick={handleClose} className={classes.menuBtn}>
          <MenuIcon />
        </IconButton>
      </div>
      <Divider />
      <List
        onKeyDown={handleClose}
        onClick={handleClose}
        style={{ overflowX: 'hidden' }}
      >
        {routes.map((route) => {
          if (route.redirect || route.sidebar === false) return null;
          const routeKey = `drawer-route-${route.title.toString().replace(/\s+/g, '-')}`;
          return route.link ? (
            <>
              <ListItem
                button={true}
                key={routeKey}
                component={RouterLink}
                to={route.link}
                target={route.target ? route.target : '_blank'}
                rel="noopener"
              >
                <ListItemIcon className={classes.drawerImgContainer}>
                  {route.icon}
                </ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button={true} to={route.path} component={RouterLink} key={routeKey}>
                <ListItemIcon className={classes.drawerImgContainer}>
                  {route.icon}
                </ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItem>
              {
                route.divider ? (
                  <Divider style={{ margin: '10px 0' }} />
                ) : null
              }
            </>
          );
        })}
      </List>
    </Drawer>
  );
}
