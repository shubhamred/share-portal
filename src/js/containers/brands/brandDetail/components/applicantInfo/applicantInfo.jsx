import React, { useState } from 'react';
// import { Grid, ButtonBase } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

import { TabSelector } from '../../../../../components';
import { TabMenu } from '../../../../../constants/tabMenus';
import ApplicantBasicInfoForm from '../../forms/applicant/components/applicantForm';
import AddressTabContent from '../../../../patrons/patronDetail/forms/patronCommunication/components/addressTab';
import NumberTabContent from '../../../../patrons/patronDetail/forms/patronCommunication/components/numberTab';
import EmailTabContent from '../../../../patrons/patronDetail/forms/patronCommunication/components/emailTab';

// import styles from './styles.scss';

const ApplicantInfo = ({ selectedApplicant, companyId }) => {
  const [selectedTab, setSelectedTab] = useState('basic_info');
  const onChangeTab = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <div>
      <TabSelector
        menuItems={TabMenu.brands_applicants}
        onChangeTab={onChangeTab}
        selectedTab={selectedTab}
      />
      {selectedTab === 'basic_info' && (
        <ApplicantBasicInfoForm
          selectedApplicant={selectedApplicant}
          companyId={companyId}
        />
      )}
      {selectedTab === 'number' && (
        <NumberTabContent
          resourceId={selectedApplicant.id}
        />
      )}
      {selectedTab === 'email' && (
        <EmailTabContent
          resourceId={selectedApplicant.id}
        />
      )}
      {selectedTab === 'address' && (
        <AddressTabContent
          resourceId={selectedApplicant.id}
        />
      )}
    </div>
  );
};

export default ApplicantInfo;
