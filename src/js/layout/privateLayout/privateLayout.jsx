import React from 'react';
// import clsx from 'clsx';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from 'app/react-auth0-spa';

import AppBar from './components/appBar/appBar';
import Snackbar from './components/snackbar/index';
import FullScreenLoader from './components/loader';

// import BreadCrumbs from './components/breadCrumbs/breadCrumbs';

// import styles from './styles.scss';
import routes from './routes';

// const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
    // marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }
}));

const PrivateLayout = () => {
  // let currentTab = 'Patrons';
  // if (window.location.href.indexOf('brands') > -1) {
  //   currentTab = 'Brands';
  // }
  // if (window.location.href.indexOf('deals') > -1) {
  //   currentTab = 'Deals';
  // }
  // const [selectedTab, setSelectedTab] = React.useState(currentTab);
  const classes = useStyles();
  // const { isAuthenticated, logout, user, loading } = useAuth0();
  const { user, loading } = useAuth0();
  // const history = useHistory();

  // useEffect(() => {
  //   setSelectedTab(currentTab);
  // }, [currentTab]);

  if (loading && !user) {
    return <p>Loading</p>;
  }

  // for future reference
  // <main
  //   className={clsx(classes.content, {
  //     [classes.contentShift]: open
  //   })}
  // >
  return (
    <div className={classes.root}>
      <AppBar />
      <Snackbar />
      <FullScreenLoader />
      {
        // <BreadCrumbs />
      }
      <div className={classes.content}>
        <Switch>
          {routes.map((route) => <Route path={route.path} component={route.component} exact />)}
        </Switch>
      </div>
    </div>
  );
};

export default PrivateLayout;
