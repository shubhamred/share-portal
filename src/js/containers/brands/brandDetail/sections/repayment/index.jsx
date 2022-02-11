import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { Context, getHashPositionValue } from 'app/utils/utils';
import Accounts from './sections/accounts';
import Partners from './sections/partners/index';
import Payouts from './sections/payouts';
import Settlements from './sections/transactions';

const BrandDocuments = ({ companyId, company, setBreadcrumbsData, position }) => {
  let tabRef = null;
  const tabs = [
    {
      label: 'Accounts',
      content: <Accounts companyId={companyId} company={company} />
    },
    {
      label: 'Partners',
      content: <Partners companyId={companyId} company={company} />
    },
    {
      label: 'Klub Revenue Share',
      content: <Payouts companyId={companyId} company={company} />
    },
    {
      label: 'Partner Settlement',
      content: <Settlements companyId={companyId} company={company} />
    }
  ];

  useEffect(() => {
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = tabs.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(tabs[TabValue].label, position);
        } else {
          setBreadcrumbsData(tabs[0].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(tabs[0].label, position);
      }
    }
  }, [tabRef]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabs[newValue].label, position, false, () => {}, true);
  };

  return (
    <Context.Provider value={{
      company,
      companyId
    }}
    >
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs tabList={tabs} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};

export default BrandDocuments;
