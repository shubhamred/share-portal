import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context } from 'app/utils/utils';
import { getBrandIntegrations } from 'app/containers/brands/saga';
import PosAccount from './sections/account';
import PoSOverview from './sections/overview';

const AdData = (props) => {
  const { brandCode, setBreadcrumbsData, position } = props;
  const [data, setData] = useState([]);
  const TABS_LIST = [
    {
      label: 'PoS',
      content: <PoSOverview />
    }
  ];

  const [tabsList, setTabsList] = useState(TABS_LIST);

  const buildSectionTabs = (tabData) => {
    // eslint-disable-next-line array-callback-return,consistent-return
    const adsComponent = tabData.map((item) => {
      const { type } = item;
      return {
        label: type,
        content: <PosAccount item={item} />
      };
    });
    setTabsList([...TABS_LIST, ...adsComponent]);
  };

  const fetchPOSData = () => {
    getBrandIntegrations(brandCode, 'POS').then((res) => {
      if (res?.data?.length) {
        setData(res.data);
        buildSectionTabs(res.data);
      }
    });
  };

  useEffect(() => {
    fetchPOSData();
    setBreadcrumbsData(tabsList[0].label, position);
  }, []);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabsList[newValue].label, position);
  };

  return (
    <Context.Provider
      value={{
        pgData: data,
        brandCode,
        fetchPOSData
      }}
    >
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs tabList={tabsList} scrollable={true} onChange={handleChange} />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};
export default AdData;
