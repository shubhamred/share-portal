/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { getHashPositionValue } from 'app/utils/utils';
import styles from './styles.scss';
import { Tabs } from '../../../../../components';
import Overview from './components/overview';
import CompanyApplicant from '../../../../shared/companyApplicant';
import AddressTabContent from '../../../../patrons/patronDetail/forms/patronCommunication/components/addressTab';

const BusinessInfo = (props) => {
  const {
    brandDetail,
    getCommunicationsDetail,
    companyId,
    setBreadcrumbsData,
    position,
    brandCode
  } = props;

  let tabRef = null;

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (companyId && brandCode && tabRef && brandDetail) {
      urlManager([
        { label: 'Overview', content: <Overview /> },
        {
          label: 'Address',
          content: (
            <AddressTabContent resourceId={companyId} resourceCode={brandCode} resource="Company" />
          )
        },
        { label: 'Team', content: <CompanyApplicant companyId={companyId} /> }
      ]);
    }
  }, [companyId, brandCode, tabRef, brandDetail]);

  const urlManager = (listOfData) => {
    setTabs(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = listOfData.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          if (TabValue === 1) {
            getCommunication();
          }
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
    if (newValue === 1) {
      getCommunication();
    }
    setBreadcrumbsData(tabs[newValue].label, position, false, () => {}, true);
  };

  const getCommunication = () => {
    if (getCommunicationsDetail && brandDetail && brandDetail !== {}) {
      getCommunicationsDetail(brandDetail?.customer?.id || '');
    }
  };

  return (
    <Grid
      container={true}
      className={styles.wrapper}
      wrap="nowrap"
      direction="row"
    >
      <Grid
        className={styles.contentWrapper}
        container={true}
        item={true}
        direction="row"
      >
        <Tabs tabList={tabs} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

BusinessInfo.propTypes = {
  brandDetail: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string
  }),
  getCommunicationsDetail: PropTypes.func,
  companyId: PropTypes.string,
  position: PropTypes.number,
  brandCode: PropTypes.string,
  setBreadcrumbsData: PropTypes.func
};

BusinessInfo.defaultProps = {
  brandDetail: null,
  getCommunicationsDetail: () => {},
  position: 0,
  setBreadcrumbsData: () => {},
  brandCode: '',
  companyId: ''
};

export default BusinessInfo;
