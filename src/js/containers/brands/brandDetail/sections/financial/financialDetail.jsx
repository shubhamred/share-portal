import React, { useEffect } from 'react';
import { getHashPositionValue } from 'app/utils/utils';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import styles from './styles.scss';
import { Tabs } from '../../../../../components';
import {
  FinancialOverview,
  FinancialShareholding,
  FinancialProfitAndLoss,
  FinancialBalanceSheet,
  FinancialCharges,
  FinancialLegalHistory
} from './sections';

const FinancialDetail = (props) => {
  const { company, applicationId, getFinancialDetail, setBreadcrumbsData, position, getBrandDetail } = props;
  const companyId = company?.id || '';
  let tabRef = null;

  const fetchCompanyDetails = () => {
    getBrandDetail(applicationId);
  };

  const financialTabs = [
    {
      label: 'Overview',
      content: <FinancialOverview
        company={company}
        applicationId={applicationId}
      />
    },
    {
      label: 'Shareholding',
      content: <FinancialShareholding
        companyId={companyId}
        company={company}
        getFinancialDetail={fetchCompanyDetails}
        applicationId={applicationId}
      />
    },
    {
      label: 'Profit And Loss',
      content: <FinancialProfitAndLoss
        companyId={companyId}
        applicationId={applicationId}
      />
    },
    {
      label: 'Balance Sheet',
      content: <FinancialBalanceSheet
        companyId={companyId}
        applicationId={applicationId}
      />
    },
    {
      label: 'Charges',
      content: <FinancialCharges
        companyId={companyId}
        applicationId={applicationId}
      />
    },
    {
      label: 'Legal History',
      content: <FinancialLegalHistory
        companyId={companyId}
        applicationId={applicationId}
      />
    }
  ];

  useEffect(() => {
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = financialTabs.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(financialTabs[TabValue].label, position);
        } else {
          setBreadcrumbsData(financialTabs[0].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(financialTabs[0].label, position);
      }
    }
  }, [tabRef]);

  useEffect(() => {
    if (getFinancialDetail && companyId) getFinancialDetail(companyId);
  }, [company]);

  // useEffect(() => {
  //   setBreadcrumbsData(financialTabs[0].label, position);
  // }, []);

  const handleChange = (newValue) => {
    setBreadcrumbsData(financialTabs[newValue].label, position, false, () => {}, true);
  };

  return (
    <Grid container={true} className={styles.wrapper} wrap="nowrap" direction="row">
      <Grid container={true} item={true} direction="row">
        {
          // financialDetail && ()
        }
        <Tabs tabList={financialTabs} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

FinancialDetail.propTypes = {
  // financialDetail: PropTypes.shape({
  //   status: PropTypes.string,
  //   id: PropTypes.string
  // }),
  company: PropTypes.object,
  applicationId: PropTypes.string,
  position: PropTypes.number,
  getFinancialDetail: PropTypes.func,
  setBreadcrumbsData: PropTypes.func
};

FinancialDetail.defaultProps = {
  // financialDetail: null,
  company: null,
  applicationId: null,
  position: 0,
  getFinancialDetail: () => { },
  setBreadcrumbsData: () => { }

};

export default FinancialDetail;
