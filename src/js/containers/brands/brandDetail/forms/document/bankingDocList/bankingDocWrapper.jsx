/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import { Checkbox, Grid, FormControlLabel, Divider, Snackbar, SnackbarContent } from '@material-ui/core';

import { filterDocumentBasedOnStatus } from 'app/utils/utils';
import BankingDocumentComponent from '../bankingDocComponent';
import { Button } from '../../../../../../components';

const BankingDocumentWrapper = (props) => {
  const { metaData, getPreSignedUrl, bankData, bankIdString, bankDocs, updateDocumentStatus, postMetaData,
    viewImage, removeFile, saveMetaData, status, resourceType, docType, cancelMetaData, parseAccount,
    messageType, clearError } = props;
  const [selectedBanks, setSelectedBanks] = useState([]);
  // useEffect(() => {
  //   if (input && input.value && input.value !== '') {
  //     getDocsbyId(input.value);
  //   }
  // }, []);
  const docList = bankDocs && bankDocs.length !== 0 ? filterDocumentBasedOnStatus(bankDocs, status) : [];
  const bankFilterByStatus = bankData && bankData.filter((bank) => docList && docList.some((doc) => doc.resourceId === bank.id));
  let bankListByStatus = bankFilterByStatus;

  if (status === 'Pending') {
    const docsNotUploaded = bankData && bankData.filter((bank) => bankDocs && !bankDocs.some((doc) => doc.resourceId === bank.id));
    bankListByStatus = bankFilterByStatus && bankFilterByStatus.concat(docsNotUploaded);
  }
  // const sortedBankingDocList = bankListByStatus && [...bankListByStatus].sort((inputA, inputB) => {
  //   const keyA = inputA.bank.name;
  //   const keyB = inputB.bank.name;
  //   if (keyA < keyB) { return -1; }
  //   if (keyA > keyB) { return 1; }
  //   return 0;
  // });
  const handleAllCheckboxesClick = (event) => {
    if (event.target.checked) {
      const newSelected = bankListByStatus.map((bank) => bank.id);
      setSelectedBanks(newSelected);
    } else {
      const deselected = bankListByStatus.map((bank) => bank.id);
      const newSelected = selectedBanks && selectedBanks.filter((bank) => !deselected.includes(bank));
      setSelectedBanks(newSelected);
    }
  };
  const handleCheckBoxClick = (event, id) => {
    const selectedIndex = selectedBanks.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBanks, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBanks.slice(1));
    } else if (selectedIndex === selectedBanks.length - 1) {
      newSelected = newSelected.concat(selectedBanks.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedBanks.slice(0, selectedIndex),
        selectedBanks.slice(selectedIndex + 1)
      );
    }
    setSelectedBanks(newSelected);
  };
  const newSelected = bankListByStatus.map((bank) => bank.id);

  return (
    <div>
      {bankListByStatus && bankListByStatus.length > 0 && (
        <Grid
          container={true}
          justify="space-between"
          // style={{ fontFamily: 'Rubik !important' }}
          direction="row"
        >
          {status === 'Verified' && <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={newSelected.length === intersection(newSelected, selectedBanks).length}
                onChange={handleAllCheckboxesClick}
              />
            }
            label="Select all"
          />}
          {status === 'Verified' && (<Button
            label="Parse"
            disabled={selectedBanks.length === 0}
            onClick={() => parseAccount(selectedBanks)}
          />)}
        </Grid>
      )}
      {bankListByStatus && bankListByStatus.map((bank) => (
        <>
          <Divider style={{ margin: '15px 0 15px 0', backgroundColor: '#eeeeee' }} />
          <BankingDocumentComponent
            key={bank.id}
            bank={bank}
            docType={docType}
            metaData={metaData}
            handleCheckBoxClick={handleCheckBoxClick}
            selectedBanks={selectedBanks}
            postMetaData={postMetaData}
            getPreSignedUrl={getPreSignedUrl}
            saveMetaData={saveMetaData}
            viewImage={viewImage}
            removeFile={removeFile}
            cancelMetaData={cancelMetaData}
            bankIdString={bankIdString}
            resourceType={resourceType}
            bankDocs={bankDocs}
            status={status}
            updateDocumentStatus={updateDocumentStatus}
          />
        </>))}
      <Snackbar
        open={Boolean(messageType)}
        onClose={() => clearError()}
        autoHideDuration={2000}
        transitionDuration={0}
      >
        <SnackbarContent
          message={(messageType === 'success' && 'Parsing Initiated')
            || (messageType === 'error' && 'Something went wrong. Please try again')}
          style={{ backgroundColor: (messageType === 'success' && '#4caf50') || (messageType === 'error' && '#f44336') }}
        />
      </Snackbar>
    </div>
  );
};

BankingDocumentWrapper.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  getPreSignedUrl: PropTypes.func,
  postMetaData: PropTypes.func,
  viewImage: PropTypes.func,
  removeFile: PropTypes.func,
  clearError: PropTypes.func,
  messageType: PropTypes.string,
  parseAccount: PropTypes.func
};

BankingDocumentWrapper.defaultProps = {
  input: {
    onChange: () => { },
    value: ''
  },
  getPreSignedUrl: () => { },
  postMetaData: () => { },
  viewImage: () => { },
  removeFile: () => { },
  clearError: () => { },
  messageType: '',
  parseAccount: () => { }
};

export default BankingDocumentWrapper;
