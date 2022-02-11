import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/auth/private.route';
import PrivateLayout from './layout/privateLayout';

export default (
  <Route>
    <Switch>
      {/* <Redirect from="/" to="/home" exact={true} />
      <Route path="/home" components={HomePage} exact={true} /> */}
      <PrivateRoute path="/" component={PrivateLayout} />
    </Switch>
  </Route>
);
