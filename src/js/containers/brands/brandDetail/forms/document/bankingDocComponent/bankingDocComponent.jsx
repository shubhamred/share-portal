/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Checkbox, FormControlLabel } from '@material-ui/core';

import UploadedDocumentElement from 'app/containers/document/uploadedDocument';
import { postMetaDataBulk } from 'app/containers/patrons/saga';
import styles from './styles.scss';
import { Button, FileUploader } from '../../../../../../components';
import Popper from '../../../../../document/popper/popper';

const BankingDocumentComponent = (props) => {
  const { metaData, getPreSignedUrl, bank, bankIdString, cancelMetaData, resourceType,
    selectedBanks, handleCheckBoxClick, bankDocs, updateDocumentStatus, viewImage,
    removeFile, saveMetaData, docType, status } = props;
  const uploadedDocValue = bankDocs && bankDocs.find((doc) => doc.resourceId === bank.id);
  const [docStatus, setStatus] = useState((uploadedDocValue && uploadedDocValue.status) || 'Pending');
  const [editStatus, setEditStatus] = useState(false);
  const initialDocStatus = (uploadedDocValue && uploadedDocValue.status) || 'Pending';
  const updateStatus = () => {
    updateDocumentStatus(uploadedDocValue.id, docStatus, bank.id, resourceType, bankIdString);
    setEditStatus(false);
  };

  const isSelected = (id) => selectedBanks.indexOf(id) !== -1;

  // useEffect(() => {
  //   if (input && input.value && input.value !== '') {
  //     getDocsbyId(input.value);
  //   }
  // }, []);
  return (
    <div style={{ display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      marginLeft: status === 'Verified' ? '0' : '30px' }}
    >
      {status === 'Verified'
      && <FormControlLabel
        control={<Checkbox
          checked={isSelected(bank.id)}
          color="primary"
          onClick={(event) => handleCheckBoxClick(event, bank.id)}
        />}
      />}
      <Grid className={styles.container} item={true} justify="space-between" direction="column" container={true}>
        <Grid className={styles.bankingContainer} item={true} justify="space-between" direction="row" container={true}>
          <Grid item={true} container={true} xs={2}>
            <Grid item={true} className={styles.title} xs={12}>
              Bank name
            </Grid>
            <Grid item={true} className={styles.value} xs={12}>
              {bank?.bank?.name}
            </Grid>
          </Grid>
          <Grid item={true} container={true} xs={2}>
            <Grid item={true} className={styles.title} xs={12}>
              Account type
            </Grid>
            <Grid item={true} className={styles.value} xs={12}>
              {bank.accountType}
            </Grid>
          </Grid>
          <Grid item={true} container={true} xs={2}>
            <Grid item={true} className={styles.title} xs={12}>
              Account number
            </Grid>
            <Grid item={true} className={styles.value} xs={12}>
              {bank.accountNumber}
            </Grid>
          </Grid>
          <Grid item={true} container={true} xs={3}>
            <Grid item={true} className={styles.title} xs={12}>
              Password
            </Grid>
            <Grid item={true} className={styles.value} xs={12}>
              {bank.statementPassword}
            </Grid>
          </Grid>
          {uploadedDocValue && (
            <Grid item={true} container={true} xs={3} direction="column">
              <Grid item={true} className={styles.title} style={{ marginBottom: '0px' }}>
                Status
              </Grid>
              <Grid container={true} item={true} className={styles.statusText}>
                <div style={{ alignItems: 'center' }}>{(uploadedDocValue && uploadedDocValue.status) || 'Pending'}</div>
                <IconButton
                  onClick={() => setEditStatus(!editStatus)}
                  className={styles.navIcons}
                >
                  <img
                    src="assets/edit.svg"
                    alt="alt"
                    width={16}
                    height={16}
                  />
                </IconButton>
                {editStatus && (
                  <Popper
                    initialStatus={initialDocStatus}
                    handleStatusChange={(value) => setStatus(value)}
                    currentStatus={docStatus}
                    updateStatus={updateStatus}
                  />
                )}
              </Grid>
            </Grid>)}
        </Grid>
        <Grid item={true} className={styles.uploadContainer} justify="space-between" direction="row" container={true}>
          <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
            {docType && (<FileUploader
              resourceId={bank.id}
              uploadedDocumentCount={null}
              resourceType="BANK_ACCOUNT"
              maxNumberOfFiles={docType.maximumFiles || 1}
              minNumberOfFiles={1}
              getPreSignedUrl={getPreSignedUrl}
              docType={docType}
              docCategory={null}
              handleSaveMetaData={saveMetaData}
              isMetaPending={!!(metaData && metaData.length)}
            />)}
          </Grid>
          {(metaData && metaData.length && metaData[0].resourceId === bank.id) && (
            <>
              <Grid item={true} className={styles.uploadedFile} xs={3}>
                <div style={{
                  width: '90%',
                  borderBottom: '1px solid #CAD1DF',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                >
                  {metaData && metaData.map((file) => (<p>{file.name}</p>))}
                </div>
              </Grid>
              <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                <Button
                  type="button"
                  label="Save"
                  onClick={() => postMetaDataBulk(metaData, bankIdString)}
                />
              </Grid>
              <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                <Button
                  type="button"
                  label="Cancel"
                  style={{ backgroundColor: 'white', color: '#5A74ED' }}
                  onClick={() => cancelMetaData(metaData)}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid
          container={true}
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          justify="center"
          className={styles.uploadedDocContainer}
        >
          <UploadedDocumentElement
            uploadedDocument={bankDocs && bankDocs.find((doc) => doc.resourceId === bank.id)}
            viewImage={viewImage}
            removeFile={removeFile}
            bankIdString={bankIdString}
            resourceId={bank.id}
            resourceType="BANK_ACCOUNT"
          />
        </Grid>
      </Grid>
    </div>
  );
};

BankingDocumentComponent.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  getPreSignedUrl: PropTypes.func,
  // postMetaData: PropTypes.func,
  viewImage: PropTypes.func,
  removeFile: PropTypes.func,
  bankDocs: PropTypes.arrayOf()
};

BankingDocumentComponent.defaultProps = {
  input: {
    onChange: () => { },
    value: ''
  },
  getPreSignedUrl: () => { },
  // postMetaData: () => { },
  viewImage: () => { },
  removeFile: () => { },
  bankDocs: null
};

export default BankingDocumentComponent;
