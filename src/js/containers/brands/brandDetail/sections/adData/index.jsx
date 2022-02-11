import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context, getHashPositionValue } from 'app/utils/utils';
import { getIntegrationData } from 'app/containers/brands/saga';
import FacebookAds from './sections/facebookAds';
import GoogleAds from './sections/googleAds';
import AdAccounts from './sections/adAccounts';

const AdData = (props) => {
  const { brandCode, setBreadcrumbsData, position } = props;
  let tabRef = null;
  const [data, setData] = useState([]);
  const TABS_LIST = [
    {
      label: 'Ad Accounts',
      content: <AdAccounts />
    }
  ];

  const [tabsList, setTabsList] = useState([]);

  const buildSectionTabs = (tabData) => {
    // eslint-disable-next-line array-callback-return,consistent-return
    const adsComponent = tabData.map((item) => {
      const { type } = item;
      switch (type) {
        case 'Facebook': return {
          label: 'Facebook Ads',
          content: <FacebookAds item={item} />
        };
        case 'Google': return {
          label: 'Google Ads',
          content: <GoogleAds item={item} />
        };
        default:
          break;
      }
    });
    urlManager([...TABS_LIST, ...adsComponent]);
  };
  function fetchAdsData() {
    getIntegrationData(brandCode).then((res) => {
      if (res.data) {
        const ADSDATA = res.data.filter((tab) => ['Facebook', 'Google'].includes(tab.type));
        setData(ADSDATA);
        buildSectionTabs(ADSDATA);
      } else {
        urlManager(TABS_LIST);
      }
    });
  }
  useEffect(() => {
    if (brandCode) {
      fetchAdsData();
    }
  }, [tabRef, brandCode]);

  const urlManager = (listOfData = TABS_LIST) => {
    setTabsList(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = listOfData.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].label, position);
        } else {
          setBreadcrumbsData(listOfData[TabValue].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(listOfData[0].label, position);
      }
    }
  };

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabsList[newValue].label, position, false, () => {}, true);
  };

  return (
    <Context.Provider
      value={{
        adsData: data
      }}
    >
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs tabList={tabsList} refTab={(ref) => { tabRef = ref; }} scrollable={true} onChange={handleChange} />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};
export default AdData;
