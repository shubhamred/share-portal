import React, { useState, useEffect } from 'react';
// import DocumentsTab from 'app/containers/shared/documentsTab';
// import { Grid, ButtonBase } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { isEqual } from 'lodash';
import DocTabs from './docTabs/docTabs';
import DocList from './docList';
import BankingDocList from './bankingDocList';
// import styles from './styles.scss';

const Documents = (props) => {
  const { brandDetail, applicantList, getApplicantList } = props;
  useEffect(() => {
    // if (clearValues) clearValues();
    if (getApplicantList && brandDetail && brandDetail.company && brandDetail.company.id) {
      getApplicantList(brandDetail && brandDetail.company && brandDetail.company.id);
    }
  }, brandDetail && brandDetail.company && brandDetail.company.id);

  const tabs = ['Applicants', 'Business', 'Financials', 'Banking'];
  const [activeTab, setActiveTab] = useState('Applicants');
  const [showList, setShowList] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState((applicantList && applicantList[0].customer
    && applicantList[0].customer.firstName));
  useEffect(() => {
    setSelectedApplicant({
      name: applicantList && applicantList[0].customer
        && applicantList[0].customer.firstName,
      id: applicantList && applicantList[0].customer
        && applicantList[0].customer.id
    });
  }, [applicantList]);

  const handleApplicantSelection = (value) => {
    if (!isEqual(value, selectedApplicant)) {
      setSelectedApplicant(value);
    }
    setShowList(false);
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Applicants': return (
        <DocList
          resourceId={selectedApplicant.id}
          resourceType="CUSTOMER"
        />
      );
      case 'Business': return (
        <DocList
          resourceId={brandDetail && brandDetail.company && brandDetail.company.id}
          resourceType="COMPANY"
        />
      );
      case 'Financials': return (
        <DocList
          resourceId={brandDetail && brandDetail.id}
          resourceType="APPLICATION"
        />
      );
      case 'Banking': return (
        <BankingDocList />
      );

      default: return (
        <DocList
          resourceId={brandDetail && brandDetail.company && brandDetail.company.id}
          resourceCategory="COMPANY"
        />
      );
    }
  };
  return (
    <Grid container={true}>
      {applicantList && applicantList[0] && (
        <DocTabs
          tabs={tabs}
          activeTab={activeTab}
          applicantList={applicantList}
          showList={showList}
          handleListTabClick={() => setShowList(!showList)}
          handleTabClick={(tab) => {
            setActiveTab(tab);
            if (tab !== ' Applicant') {
              setShowList(false);
            }
          }}
          handleApplicantSelection={handleApplicantSelection}
          selectedApplicant={selectedApplicant}
        // style={styles.tabWrapper}
        >
          {renderTabContent(activeTab)}
        </DocTabs>
      )}
    </Grid>
  );
};

export default Documents;
