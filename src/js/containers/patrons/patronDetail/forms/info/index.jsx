/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import { getHashPositionValue } from 'app/utils/utils';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Tabs } from '../../../../../components';
import BasicInfoForm from '../basicInfoForm';
import PatronCommunication from '../patronCommunication';
import FundingInfoForm from '../fundingInfoForm';

const Info = (props) => {
  const {
    initialValuesBasicInfoForm,
    position,
    setBreadcrumbsData,
    initialValuesFundingInfoForm,
    switchToDocSection
  } = props;

  let tabRef = null;

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (initialValuesBasicInfoForm && initialValuesFundingInfoForm && tabRef) {
      urlManager([
        {
          label: 'Basic',
          content: (
            <BasicInfoForm
              initialValues={initialValuesBasicInfoForm || {}}
              switchToDocSection={switchToDocSection}
            />
          )
        },
        {
          label: 'Communication',
          containSpace: 'no',
          content: (
            <PatronCommunication position={position + 1} setBreadcrumbsData={setBreadcrumbsData} />
          )
        },
        {
          label: 'Preferences',
          content: <FundingInfoForm initialValues={initialValuesFundingInfoForm} />
        }
      ]);
    }
  }, [tabRef]);

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
    setBreadcrumbsData(tabs[newValue].label, position, true, () => {}, true);
  };

  return (
    <Grid container={true} wrap="nowrap" direction="row">
      <Grid container={true} item={true} direction="row">
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

Info.propTypes = {
  initialValuesBasicInfoForm: PropTypes.shape({}),
  initialValuesFundingInfoForm: PropTypes.shape({}),
  switchToDocSection: PropTypes.func,
  position: PropTypes.number,
  setBreadcrumbsData: PropTypes.func
};

Info.defaultProps = {
  initialValuesBasicInfoForm: {},
  switchToDocSection: () => {},
  position: 0,
  setBreadcrumbsData: () => {},
  initialValuesFundingInfoForm: {}
};

export default Info;
