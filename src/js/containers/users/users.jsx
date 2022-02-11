import React, { useEffect } from 'react';
import { CustomeHeader, Tabs } from 'app/components';
import { Grid } from '@material-ui/core';
import { getHashPositionValue } from 'app/utils/utils';
import UserListing from './sections/userListing';
import UserRoles from './sections/roles';
import global from '../global.scss';
import WithBreadcrumb from '../../hoc/breadcrumbWrapper';

const Users = (porps) => {
  const { setBreadcrumbsData, defaultHashHandler } = porps;
  let tabRef = null;

  const TABS_LIST = [
    {
      label: 'Users',
      content: <UserListing />
    },
    {
      label: 'Roles',
      content: <UserRoles />
    }
  ];

  useEffect(() => {
    defaultHashHandler();
  }, []);

  useEffect(() => {
    if (tabRef) {
      let mData = getHashPositionValue(0);
      if (mData) {
        mData = mData.replace(new RegExp('#', 'g'), '');
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = TABS_LIST.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(TABS_LIST[TabValue].label, 0);
        } else {
          setBreadcrumbsData(TABS_LIST[0].label, 0, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(TABS_LIST[0].label, 0);
      }
    }
  }, [tabRef]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(TABS_LIST[newValue].label, 0, false, () => {}, true);
  };

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader pageName="User Management" isFilter={false} isSearch={false} />
      <Grid item={true} className={global.tableStyle}>
        <Tabs tabList={TABS_LIST} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default WithBreadcrumb(Users, [], 0);
