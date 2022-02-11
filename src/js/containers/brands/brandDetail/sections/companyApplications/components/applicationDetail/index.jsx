import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { getHashPositionValue } from 'app/utils/utils';
import SanctionedAmount from './sections/sanctionAmount';
import ApplicationDocuments from './sections/documents';
import Operations from './sections/operations';
import Overview from './sections/overview';

const ApplicationDetail = (props) => {
  const { id, application, position, setBreadcrumbsData } = props;
  let tabRef = null;

  const tabList = [
    {
      label: 'Overview',
      // eslint-disable-next-line react/jsx-props-no-spreading
      content: (
        <Overview
          form="overviewForm"
          onSubmit={() => {}}
          handleCancel={() => {}}
          initialValues={{
            requestedAmount: application.requestedAmount,
            fundingRequiredFor: application.fundingRequiredFor,
            conditionsSubsequentStatus: application.conditionsSubsequentStatus,
            productId: application.productId,
            revenue: application.revenue,
            operationalFrom: application.operationalFrom,
            softSanctionQuantum: application.softSanctionQuantum || 0,
            softSanctionRevenueShare: application.softSanctionRevenueShare || 0,
            softSanctionTenure: application.softSanctionTenure || 0,
            softSanctionYield: application.softSanctionYield || 0
          }}
          {...props}
        />
      )
    },
    {
      label: 'Documents',
      containSpace: 'no',
      content: <ApplicationDocuments applicationId={id} application={application} setBreadcrumbsData={setBreadcrumbsData} position={position + 1} />
    },
    {
      label: 'Sanction',
      content: (
        <SanctionedAmount
          applicationId={id || ''}
          application={application || {}}
          form="sanctionAmountForm"
          onSubmit={() => {}}
          handleCancel={() => {}}
          initialValues={{
            sanctionedAmount: application.sanctionedAmount,
            sanctionedRate: application.sanctionedRate,
            sanctionedTenure: application.sanctionedTenure,
            sanctionValidTill: application.sanctionValidTill,
            revenueShare: application.revenueShare,
            hardThresholdAmount: application.hardThresholdAmount || 0,
            softThresholdAmount: application.softThresholdAmount || 0,
            baseRevenueAmount: application.baseRevenueAmount || 0,
            lowerCapRevenuePercentage: application.lowerCapRevenuePercentage || 0,
            upperCapRevenuePercentage: application.upperCapRevenuePercentage || 0
          }}
        />
      )
    },
    {
      label: 'Operations',
      content: <Operations applicationId={id} brandCode={application?.companyCode} applicationCode={application?.applicationCode} type="application" />
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
        } else {
          setBreadcrumbsData(tabList[0].label, position, true, () => {}, true);
        }
      } else {
        setBreadcrumbsData(tabList[0].label, position);
      }
    }
  }, [tabRef]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabList[newValue].label, position, true, () => {}, true);
  };

  return (
    <>
      <Grid container={true}>
        <Grid item={true} xs={12} container={true}>
          <Grid item={true} xs={12}>
            <Tabs tabList={tabList} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

ApplicationDetail.propTypes = {
  setBreadcrumbsData: PropTypes.func,
  position: PropTypes.number
};

ApplicationDetail.defaultProps = {
  setBreadcrumbsData: () => {},
  position: 0
};

export default React.memo(ApplicationDetail);
