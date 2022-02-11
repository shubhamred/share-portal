import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context, getHashPositionValue } from 'app/utils/utils';
import { getBrandIntegrations } from 'app/containers/brands/saga';
import Accounts from './sections/accounts';
import CODOverview from './sections/overview';

const COD = (props) => {
  const { brandCode, setBreadcrumbsData, position } = props;
  let tabRef = null;
  const [data, setData] = useState([]);
  const TABS_LIST = [
    {
      label: 'COD',
      content: <CODOverview />
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

  const fetchCODData = () => {
    getBrandIntegrations(brandCode, 'COD').then((res) => {
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
      fetchCODData();
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
        codData: data,
        brandCode,
        fetchCODData
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

COD.propTypes = {
  brandCode: PropTypes.string,
  setBreadcrumbsData: PropTypes.func,
  position: PropTypes.number
};

COD.defaultProps = {
  brandCode: null,
  setBreadcrumbsData: () => {},
  position: 3
};

export default COD;
