import React, { useState, useEffect } from 'react';
// import { Grid, ButtonBase } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { TabMenu } from 'app/constants/tabMenus';
import { TabSelector } from '../../../../../../components';
import BankingDocumentWrapper from './bankingDocWrapper';
// import styles from './styles.scss';

const Documents = (props) => {
  const { getAccounts, getBankDocs, brandDetail, bankDocs, postMetaData, getDocType, viewImage, removeFile,
    getBankPreSignedURL, saveMetaData, metaData, bankData, updateDocumentStatus, docType, cancelMetaData,
    parseAccount, messageType, clearError } = props;
  const companyId = brandDetail && brandDetail.company && brandDetail.company.id;
  const [selectedTab, setSelectedTab] = useState('Pending');
  const onChangeTab = (tabName) => {
    setSelectedTab(tabName);
  };

  useEffect(() => {
    if (getAccounts && companyId) {
      getAccounts(companyId);
    }
    if (getDocType) {
      getDocType();
    }
  }, []);
  const bankIdList = bankData && bankData.map((account) => account.id);
  const bankIdString = bankIdList && bankIdList.join();
  useEffect(() => {
    if (getBankDocs && bankData && bankData.length > 0 && bankIdString && bankIdString !== '') {
      getBankDocs('BANK_ACCOUNT', bankIdString);
    }
  }, [bankIdString]);

  const handleStatementUpload = ({ ...args }) => {
    postMetaData({ ...args, bankIdString });
  };

  return (
    <div>
      <TabSelector
        menuItems={TabMenu.documents}
        onChangeTab={onChangeTab}
        selectedTab={selectedTab}
      />
      {selectedTab === 'Verified'
        && (
          <Grid>
            <BankingDocumentWrapper
              status="Verified"
              bankData={bankData}
              docType={docType}
              cancelMetaData={cancelMetaData}
              postMetaData={handleStatementUpload}
              bankDocs={bankDocs}
              saveMetaData={saveMetaData}
              metaData={metaData}
              viewImage={viewImage}
              parseAccount={parseAccount}
              removeFile={removeFile}
              getPreSignedUrl={getBankPreSignedURL}
              companyId={companyId}
              resourceType="BANK_ACCOUNT"
              bankIdString={bankIdString}
              updateDocumentStatus={updateDocumentStatus}
              messageType={messageType}
              clearError={clearError}
            />
          </Grid>
        )}
      {selectedTab === 'Pending'
        && (
          <Grid>
            <BankingDocumentWrapper
              status="Pending"
              parseAccount={parseAccount}
              saveMetaData={saveMetaData}
              bankData={bankData}
              cancelMetaData={cancelMetaData}
              postMetaData={handleStatementUpload}
              bankDocs={bankDocs}
              docType={docType}
              viewImage={viewImage}
              removeFile={removeFile}
              metaData={metaData}
              getPreSignedUrl={getBankPreSignedURL}
              companyId={companyId}
              bankIdString={bankIdString}
              resourceType="BANK_ACCOUNT"
              updateDocumentStatus={updateDocumentStatus}
            />
          </Grid>
        )}
      {selectedTab === 'Received'
        && (
          <Grid>
            <BankingDocumentWrapper
              status="Received"
              bankDocs={bankDocs}
              bankData={bankData}
              parseAccount={parseAccount}
              viewImage={viewImage}
              removeFile={removeFile}
              cancelMetaData={cancelMetaData}
              postMetaData={handleStatementUpload}
              saveMetaData={saveMetaData}
              docType={docType}
              metaData={metaData}
              getPreSignedUrl={getBankPreSignedURL}
              companyId={companyId}
              bankIdString={bankIdString}
              resourceType="BANK_ACCOUNT"
              updateDocumentStatus={updateDocumentStatus}
            />
          </Grid>
        )}
    </div>
  );
};

export default Documents;
