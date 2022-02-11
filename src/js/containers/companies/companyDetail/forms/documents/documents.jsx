import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { getHashPositionValue } from 'app/utils/utils';
import { Tabs } from 'app/components';

const Documents = (props) => {
  const { setBreadcrumbsData, position } = props;
  let tabRef = null;
  const tabList = [
    {
      label: 'ENTITY kyc',
      content: <p>ENTITY kyc</p>
    },
    {
      label: 'PERSON KYC',
      content: <p>PERSON KYC</p>
    }
  ];

  useEffect(() => {
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = tabList.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(tabList[TabValue].label, position);
        } else {
          setBreadcrumbsData(tabList[0].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(tabList[0].label, position);
      }
    }
  }, [tabRef]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabList[newValue].label, position, false, () => {}, true);
  };

  useEffect(() => {
    // setBreadcrumbsData(tabList[0].label, position);
  }, []);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Tabs tabList={tabList} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default Documents;
