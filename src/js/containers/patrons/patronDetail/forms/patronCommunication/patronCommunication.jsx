/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getHashPositionValue } from 'app/utils/utils';
import { Grid } from '@material-ui/core';
import styles from './styles.scss';
import { Tabs } from '../../../../../components';
import NumberTabContent from './components/numberTab';
import EmailTabContent from './components/emailTab';
import AddressTabContent from './components/addressTab';
import { resourceTypes } from '../../../../../utils/enums';

const PatronCommunication = ({
  getCommunicationsDetail,
  patronDetail,
  formData,
  setBreadcrumbsData,
  position
}) => {
  let tabRef = null;

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (getCommunicationsDetail && patronDetail && patronDetail !== {} && patronDetail.id) {
      getCommunicationsDetail(patronDetail.id);
    }
  }, [patronDetail, tabRef]);

  useEffect(() => {
    if (tabRef && formData?.data?.id) {
      urlManager([
        {
          label: 'Number',
          content: <NumberTabContent resourceId={formData.data.id} resource="Customer" />
        },
        {
          label: 'Email',
          content: <EmailTabContent resourceId={formData.data.id} resource="Customer" />
        },
        {
          label: 'Address',
          content: (
            <AddressTabContent
              resourceId={formData.data.id}
              resourceCode={formData.data.patronCode}
              resource={resourceTypes.PATRON}
            />
          )
        }
      ]);
    }
  }, [formData, tabRef]);

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
    <Grid container={true} className={styles.wrapper} wrap="nowrap" direction="row">
      <Grid className={styles.contentWrapper} container={true} item={true} direction="row">
        <Tabs
          tabList={tabs}
          refTab={(ref) => {
            tabRef = ref;
          }}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

PatronCommunication.propTypes = {
  formData: PropTypes.shape({}),
  patronDetail: PropTypes.shape({
    id: PropTypes.string
  }),
  getCommunicationsDetail: PropTypes.func,
  setBreadcrumbsData: PropTypes.func,
  position: PropTypes.number
};

PatronCommunication.defaultProps = {
  formData: {},
  patronDetail: null,
  getCommunicationsDetail: () => {},
  setBreadcrumbsData: () => {},
  position: 3
};

export default PatronCommunication;
