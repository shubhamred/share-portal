import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context, getHashPositionValue } from 'app/utils/utils';
import { getBrandIntegrations } from 'app/containers/brands/saga';
import Accounts from './sections/accounts';
import MarketplaceOverview from './sections/overview';

const Marketplace = (props) => {
  const { brandCode, setBreadcrumbsData, position } = props;
  let tabRef = null;
  const [data, setData] = useState([]);
  const TABS_LIST = [
    {
      label: 'Marketplace',
      content: <MarketplaceOverview />
    }
  ];

  const [tabsList, setTabsList] = useState(TABS_LIST);

  const buildSectionTabs = (tabData) => {
    const adsComponent = tabData.map((item) => {
      const { type } = item;
      return {
        label: type,
        content: <Accounts item={item} />
      };
    });
    urlManager([...TABS_LIST, ...adsComponent]);
  };

  const fetchMarketplaceData = () => {
    getBrandIntegrations(brandCode, 'MARKETPLACE').then((res) => {
      if (res?.data?.length) {
        setData(res.data);
        buildSectionTabs(res.data);
      }
    });
  };

  const urlManager = (listOfData = TABS_LIST) => {
    setTabsList(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(
          mData.replace('#', '').replace(new RegExp('_', 'g'), ' '),
          'i'
        );
        const TabValue = listOfData.findIndex(
          (list) => list.label.match(re) !== null
        );
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].label, position);
        } else {
          setBreadcrumbsData(
            listOfData[TabValue].label,
            position,
            false,
            () => {},
            true
          );
        }
      } else {
        setBreadcrumbsData(listOfData[0].label, position);
      }
    }
  };

  useEffect(() => {
    if (brandCode) {
      fetchMarketplaceData();
    }
  }, [tabRef, brandCode]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(
      tabsList[newValue].label,
      position,
      false,
      () => {},
      true
    );
  };

  return (
    <Context.Provider
      value={{
        marketplaceData: data,
        brandCode,
        fetchMarketplaceData
      }}
    >
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs
            tabList={tabsList}
            refTab={(ref) => {
              tabRef = ref;
            }}
            scrollable={true}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};

Marketplace.propTypes = {
  brandCode: PropTypes.string,
  setBreadcrumbsData: PropTypes.func,
  position: PropTypes.number
};

Marketplace.defaultProps = {
  brandCode: null,
  setBreadcrumbsData: () => {},
  position: 3
};

export default Marketplace;
