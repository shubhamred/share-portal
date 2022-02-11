/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { getHashPositionValue } from 'app/utils/utils';
import styles from './styles.scss';
import Overview from './components/overview';
import { Tabs } from '../../../../../components';
import AddressTabContent from '../../../../patrons/patronDetail/forms/patronCommunication/components/addressTab';

const BusinessInfo = (props) => {
  const { brandDetail, entityType, position, setBreadcrumbsData, companyId, companyCode } = props;

  let tabRef = null;
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (companyId && companyCode && tabRef && brandDetail) {
      urlManager([
        { label: 'Overview', content: <Overview entityType={entityType} /> },
        {
          label: 'Address',
          content: (
            <AddressTabContent resourceId={companyId} resourceCode={companyCode} resource="Company" />
          )
        }
      ]);
    }
  }, [companyId, companyCode, tabRef, brandDetail]);

  const urlManager = (listOfData) => {
    setTabs(listOfData);
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
    setBreadcrumbsData(tabs[newValue].label, position, false, () => {}, true);
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
  entityType: PropTypes.string,
  position: PropTypes.number,
  setBreadcrumbsData: PropTypes.func
};

BusinessInfo.defaultProps = {
  brandDetail: null,
  entityType: 'Company',
  position: 3,
  setBreadcrumbsData: () => {}
};

export default BusinessInfo;
