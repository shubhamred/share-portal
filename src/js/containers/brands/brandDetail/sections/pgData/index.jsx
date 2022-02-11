import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context, getHashPositionValue } from 'app/utils/utils';
// eslint-disable-next-line no-unused-vars
import { getIntegrationData, getBrandIntegrations } from 'app/containers/brands/saga';
import RazerPay from './sections/razorpay';
import PGOverview from './sections/overview';

const AdData = (props) => {
  const { brandCode, setBreadcrumbsData, position } = props;
  let tabRef = null;
  const [data, setData] = useState([]);
  const TABS_LIST = [
    {
      label: 'PG',
      content: <PGOverview />
    }
  ];

  const [tabsList, setTabsList] = useState(TABS_LIST);

  const buildSectionTabs = (tabData) => {
    // eslint-disable-next-line array-callback-return,consistent-return
    const adsComponent = tabData.map((item) => {
      const { type } = item;
      return {
        label: type,
        content: <RazerPay item={item} />
      };
      // const { type } = item;
      // switch (type) {
      //   case 'Razorpay':
      //     return {
      //       label: 'Razorpay',
      //       content: <RazerPay item={item} />
      //     };
      //   default:
      //     break;
      // }
    });
    urlManager([...TABS_LIST, ...adsComponent]);
  };

  const fetchPGData = () => {
    getBrandIntegrations(brandCode, 'PG').then((res) => {
      if (res?.data?.length) {
        setData(res.data);
        buildSectionTabs(res.data);
      }
    });
    // getIntegrationData(brandCode).then((res) => {
    //   if (res.data) {
    //     const PGDATA = res.data.filter((tab) => ['Razorpay'].includes(tab.type));
    //     setData(PGDATA);
    //     buildSectionTabs(PGDATA);
    //   }
    // });
  };

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

  useEffect(() => {
    if (brandCode) {
      fetchPGData();
    }
    // setBreadcrumbsData(tabsList[0].label, position);
  }, [tabRef, brandCode]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabsList[newValue].label, position, false, () => {}, true);
  };

  return (
    <Context.Provider
      value={{
        pgData: data,
        brandCode,
        fetchPGData
      }}>
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs tabList={tabsList} refTab={(ref) => { tabRef = ref; }} scrollable={true} onChange={handleChange} />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};
export default AdData;
