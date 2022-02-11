/* eslint-disable no-nested-ternary */
import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link as RouterLink, Route, MemoryRouter } from 'react-router-dom';
// import { Route, MemoryRouter } from 'react-router';

const breadcrumbNameMap = {
  '/#': 'Home',
  '/': 'Home',
  '/brands': 'Brands',
  '/deals': 'Deals',
  '/patrons': 'Patrons'
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 360
  },
  lists: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

// eslint-disable-next-line react/jsx-props-no-spreading
const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

// eslint-disable-next-line react/no-multi-comp
export default function EnhancedBreadcrumbs() {
  const classes = useStyles();
  // console.log('window.location', window.location);
  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <div className={classes.root}>
        <Route>
          {({ location }) => {
            // const { hash } = window.location;
            // const pathnames = hash.split('/').filter((x) => x);
            // console.log('pathnames', pathnames);
            const pathnames = location.pathname.split('/').filter((x) => x);
            // console.log('pathnames', pathnames);
            return (
              <Breadcrumbs aria-label="breadcrumb">
                <LinkRouter color="inherit" to="/">
                  Home
                </LinkRouter>
                {pathnames.map((_value, index) => {
                  // console.log('_value, index', _value, index);
                  const last = index === pathnames.length - 1;
                  // console.log('last', last);
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                  // console.log('to', to);

                  return last ? (
                    <Typography color="textPrimary" key={to}>
                      {breadcrumbNameMap[to]}
                    </Typography>
                  ) : (
                    <LinkRouter color="inherit" to={to} key={to}>
                      {breadcrumbNameMap[to]}
                    </LinkRouter>
                  );
                })}
              </Breadcrumbs>
            );
          }}
        </Route>
      </div>
    </MemoryRouter>
  );
}
