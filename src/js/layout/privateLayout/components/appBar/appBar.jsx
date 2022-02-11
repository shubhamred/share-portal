import React from 'react';
import clsx from 'clsx';
import { groupBy } from 'lodash';
import { alpha, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/MoreVert';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth0 } from 'app/react-auth0-spa';
import { Tooltip } from '../../../../components';
import routes from '../../routes';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    height: '64px'
  },
  appBar: {
    backgroundColor: '#4959D3'
  },
  menuButton: {
    marginRight: theme.spacing()
  },
  title: {
    display: 'none',
    fontSize: '18px',
    lineHeight: '22px',
    paddingTop: '10px',
    paddingLeft: '5px',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logoutSection: {
    top: '39px !important'
  },
  navMenu: {
    margin: 'auto'
  },
  drawerImgContainer: {
    '& img': {
      width: '25px',
      height: '25px'
    }
  },
  outerProfile: {
    marginRight: '5px',
    marginLeft: '10px'
  },
  outerNavigation: {
    cursor: 'pointer',
    margin: 'auto',
    padding: '0 5px',
    display: 'flex',
    alignItems: 'center'
  },
  listItemContainer: {
    '&:hover': {
      backgroundColor: 'unset'
    }
  },
  profileSeaction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  profileSeactionImg: {
    height: '45px',
    width: '45px',
    borderRadius: '50%'
  },
  profileSeactionName: {
    color: '#212529',
    paddingTop: '6px',
    fontSize: '16px',
    marginRight: 'auto'
  },
  profileSeactionEmail: {
    color: '#212529cc',
    fontSize: '14px',
    marginRight: 'auto'
  },
  navbarPadding: {
    paddingTop: '0',
    paddingBottom: '0'
  }
}));

export default function EnhancedAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { logout, user } = useAuth0();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted={true}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.logoutSection}
    >
      <MenuItem>
        <div className={classes.profileSeaction}>
          <img
            className={classes.profileSeactionImg}
            src={
              user.picture
              || `https://ui-avatars.com/api/?name=${user.name}&size=60&background=1518AF&color=fff`
            }
            alt="UserImage"
          />
          <div className={classes.profileSeactionName}>{user.name || ''}</div>
          <div className={classes.profileSeactionEmail}>{user.email || ''}</div>
        </div>
      </MenuItem>
      <Divider style={{ margin: '10px 0' }} />
      <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Logout</MenuItem>
    </Menu>
  );

  const NavbarPopoverEl = (name, routeList) => {
    const tipEl = (
      <div>
        {routeList.map((route) => {
          if (route.redirect || route.sidebar === false) return null;
          const routeKey = `drawer-route-${route.title.toString().replace(/\s+/g, '-')}`;
          return route.link ? (
            <>
              <ListItem
                className={classes.navbarPadding}
                button={true}
                key={routeKey}
                component={RouterLink}
                to={route.link}
                target={route.target ? route.target : '_blank'}
                rel="noopener"
              >
                <ListItemIcon className={classes.drawerImgContainer}>{route.icon}</ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                className={classes.navbarPadding}
                button={true}
                to={route.path}
                component={RouterLink}
                key={routeKey}
              >
                <ListItemIcon className={classes.drawerImgContainer}>{route.icon}</ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItem>
              {route.divider ? <Divider style={{ margin: '10px 0' }} /> : null}
            </>
          );
        })}
      </div>
    );
    const renderEl = (
      <div className={classes.navMenu}>
        <Tooltip title={tipEl}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              margin: name === 'Others' ? 'auto 15px auto 10px' : 'auto 20px'
            }}
          >
            {name === 'Others' ? (
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                style={{ padding: '0' }}
              >
                <MoreIcon style={{ color: '#fff' }} />
              </IconButton>
            ) : (
              <>
                {name}
                <ArrowDropDownIcon />
              </>
            )}
          </div>
        </Tooltip>
      </div>
    );
    return renderEl;
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted={true}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar>
            {user.name.split(' ')[0][0]}
            {user.name.split(' ').length > 1
              ? user.name.split(' ')[user.name.split(' ').length - 1][0]
              : null}
          </Avatar>
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  const RouterList = groupBy(routes, 'category');
  return (
    <div className={classes.grow}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar)}
      >
        <Toolbar>
          <Link to="/" style={{ width: '72px', padding: '8px', paddingLeft: '0px' }}>
            <img alt="Klub" src="/assets/klub-logo-white.svg" />
          </Link>
          <Typography className={classes.title} variant="h5" noWrap={true}>
            Portal
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {Object.keys(RouterList).map((list) => (list !== 'undefined' && NavbarPopoverEl(list, RouterList[list])))}
            <IconButton
              className={classes.outerProfile}
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar style={{ width: '20px', height: '20px', padding: '10px' }}>
                {user.name.split(' ')[0][0]}
                {user.name.split(' ').length > 1
                  ? user.name.split(' ')[user.name.split(' ').length - 1][0]
                  : null}
              </Avatar>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
