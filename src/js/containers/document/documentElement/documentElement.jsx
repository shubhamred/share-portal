/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Divider } from '@material-ui/core';
import { filterDocumentBasedOnStatus, sortArrayWithKey } from 'app/utils/utils';
import styles from './styles.scss';
import ItemSelector from '../../../components/itemSelector/itemSelector';
import UploadedDocumentElement from '../uploadedDocument/uploadedDocument';
import FileUploader from '../fileUploader';
import Popper from '../popper/popper';
import { Button } from '../../../components';

const MultipleDocs = (props) => {
  const [status, setStatus] = useState((uploadedDocument && uploadedDocument.status) || 'Pending');
  const [editStatus, setEditStatus] = useState(false);
  const { type, getPreSignedUrl, postMetaData, uploadedDocs, docCategory, resourceId, cancelMetaData,
    resourceType, viewImage, removeFile, metaData, updateDocumentStatus, saveMetaData, noDivider } = props;
  const uploadedDocument = uploadedDocs && uploadedDocs.filter((doc) => doc.docCategory === docCategory);
  const uploadDocValue = uploadedDocument && uploadedDocument
    .find((document) => type.documentType.key === document.docType);
  const updateStatus = () => {
    updateDocumentStatus(uploadDocValue.id, status, resourceId, resourceType);
    setEditStatus(false);
  };
  const initialDocumentStatus = (uploadedDocument && uploadedDocument.status) || 'Pending';
  return (
    <>
      <Grid className={styles.containerMultiple} item={true} direction="row" container={true}>
        <Grid item={true} xs={12} sm={2} md={2} lg={2} className={styles.documentLabel}>
          {type.documentType.name}
        </Grid>
        <Grid
          container={true}
          item={true}
          xs={12}
          sm={1}
          md={1}
          lg={1}
          justify="center"
          className={styles.entityWrapper}
        >
          <FileUploader
            resourceId={resourceId}
            uploadedDocumentCount={uploadedDocument && uploadedDocument.files && uploadedDocument.files.length}
            resourceType={resourceType}
            maxNumberOfFiles={1}
            minNumberOfFiles={1}
            getPreSignedUrl={getPreSignedUrl}
            docType={type.documentType}
            docCategory={docCategory}
            handleSaveMetaData={saveMetaData}
          />
        </Grid>
        <Grid container={true} item={true} xs={5} style={{ alignItems: 'center' }} className={styles.entityWrapper}>
          {(metaData && metaData.docType === type.documentType.key) && (
            <>
              <Grid item={true} className={styles.uploadedFile} xs={8}>
                <div style={{
                  width: '90%',
                  borderBottom: '1px solid #CAD1DF'
                }}
                >
                  {metaData && metaData.name}
                </div>
              </Grid>
              <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                <Button
                  type="button"
                  label="Save"
                  onClick={() => postMetaData(metaData)}
                />
              </Grid>
              <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                <Button
                  type="button"
                  label="Cancel"
                  style={{ backgroundColor: 'white', color: '#5A74ED' }}
                  onClick={() => cancelMetaData()}
                />
              </Grid>
            </>
          )}
        </Grid>
        {uploadDocValue && (
        <Grid
          container={true}
          direction="row"
          xs={12}
          sm={2}
          md={2}
          lg={2}
          className={styles.statusText}
        >
          {(uploadDocValue && uploadDocValue.status) || 'Pending'}
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
          {editStatus && <Popper
            initialStatus={initialDocumentStatus}
            handleStatusChange={(value) => setStatus(value)}
            currentStatus={status}
            updateStatus={updateStatus}
          />}
        </Grid>
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
        className={styles.dateWrapper}
      >
        <UploadedDocumentElement
          uploadedDocument={uploadDocValue && uploadDocValue.docType === type.documentType.key && uploadDocValue}
          viewImage={viewImage}
          removeFile={removeFile}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </Grid>
      {!noDivider && (
      <Grid
        container={true}
        item={true}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        justify="center"
      >
        <Divider style={{ backgroundColor: '#eeeeee', width: 'inherit' }} />
      </Grid>)}
    </>
  );
};

const DocumentElement = (props) => {
  const { docCategory, docCategoryLabel, noOfDocTypesRequired, statusFilter, fullDocList,
    viewImage, resourceType, resourceId, postMetaData, metaData, cancelMetaData,
    docTypes, uploadedDocs, getPreSignedUrl, applicationId, saveMetaData, updateDocumentStatus, removeFile } = props;

  const filterDocTypes = docTypes.filter((docType) => docType.documentType);
  const docTypelabels = filterDocTypes && filterDocTypes.map((type) => type.documentType.name);
  const uploadedDocument = uploadedDocs && uploadedDocs.find((doc) => doc.docCategory === docCategory);

  const findDocTypeFromKey = (key) => {
    const type = filterDocTypes && filterDocTypes.find((doc) => doc.documentType.key === key);
    return type && type.documentType;
  };
  const currentDocType = findDocTypeFromKey(uploadedDocument && uploadedDocument.docType);
  const [selectedDocType, setSelectedDocType] = useState(uploadedDocument ? currentDocType : { name: '', key: null });
  const [editStatus, seteditStatus] = useState(false);
  const [status, setstatus] = useState((uploadedDocument && uploadedDocument.status) || 'Pending');
  const initialDocStatus = (uploadedDocument && uploadedDocument.status) || 'Pending';
  const findDocType = (typeLabel) => {
    const type = filterDocTypes && filterDocTypes.find((doc) => doc.documentType.name === typeLabel);
    return type && type.documentType;
  };

  const handleEditStatus = () => {
    seteditStatus(!editStatus);
  };

  const handleStatusChange = (value) => {
    setstatus(value);
  };

  const updateStatus = () => {
    updateDocumentStatus(uploadedDocument.id, status, resourceId, resourceType);
    seteditStatus(false);
  };

  const handleDocumentTypeChange = (docType) => {
    const document = findDocType(docType);
    setSelectedDocType(document);
  };

  const docList = fullDocList && fullDocList.length !== 0 ? filterDocumentBasedOnStatus(fullDocList, statusFilter) : [];
  const configList = filterDocTypes && filterDocTypes.filter((docType) => docList
    .some((doc) => doc.docType === docType.documentType.key));
  let configData = configList;
  if (status === 'Pending') {
    const docsNotUploaded = filterDocTypes && filterDocTypes.filter((docType) => fullDocList && !fullDocList
      .some((doc) => doc.docType === docType.documentType.key));
    configData = configList && configList.concat(docsNotUploaded);
  }

  const sortedConfigData = sortArrayWithKey(configData, 'displayOrder');
  return (
    <Grid className={styles.container} item={true} justify="space-between" direction="row" container={true}>
      <Grid item={true} className={styles.category} xs={12}>
        {docCategoryLabel}
      </Grid>
      {noOfDocTypesRequired === 1 && (
        <>
          <Grid container={true} item={true}>
            <Grid item={true} xs={12} sm={2} md={2} lg={2} justify="flex-start" className={styles.dateWrapper}>
              <ItemSelector
                options={docTypelabels}
                placeholder="Choose document type"
                disabled={uploadedDocument && uploadedDocument.files && uploadedDocument.files.length !== 0}
                selectedOption={selectedDocType && selectedDocType.name}
                handleSelectedOption={handleDocumentTypeChange}
              />
            </Grid>
            <Grid
              container={true}
              item={true}
              xs={12}
              sm={1}
              md={1}
              lg={1}
              justify="center"
              className={styles.entityWrapper}
            >
              {selectedDocType.key && (<FileUploader
                resourceId={resourceId}
                uploadedDocumentCount={uploadedDocument && uploadedDocument.files && uploadedDocument.files.length}
                resourceType={resourceType}
                maxNumberOfFiles={1}
                minNumberOfFiles={1}
                getPreSignedUrl={getPreSignedUrl}
                docType={selectedDocType}
                docCategory={docCategory}
                handleSaveMetaData={saveMetaData}
                applicationId={applicationId}
              />)}
            </Grid>
            <Grid container={true} item={true} xs={6} style={{ alignItems: 'center' }} className={styles.entityWrapper}>
              {(metaData && metaData.docType === (selectedDocType && selectedDocType.key)) && (
                <>
                  <Grid item={true} className={styles.uploadedFile} xs={8}>
                    <div style={{
                      width: '90%',
                      borderBottom: '1px solid #CAD1DF'
                    }}
                    >
                      {metaData && metaData.name}
                    </div>
                  </Grid>
                  <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                    <Button
                      type="button"
                      label="Save"
                      onClick={() => postMetaData(metaData)}
                    />
                  </Grid>
                  <Grid container={true} item={true} xs={2} className={styles.uploadButton}>
                    <Button
                      type="button"
                      label="Cancel"
                      style={{ backgroundColor: 'white', color: '#5A74ED' }}
                      onClick={() => cancelMetaData()}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            {uploadedDocument && (
            <Grid
              container={true}
              direction="row"
              xs={12}
              sm={2}
              md={2}
              lg={2}
              className={styles.statusText}
            >
              <div style={{ alignItems: 'center' }}>{(uploadedDocument && uploadedDocument.status) || 'Pending'}</div>
              <IconButton
                onClick={handleEditStatus}
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
                  handleStatusChange={handleStatusChange}
                  currentStatus={status}
                  updateStatus={updateStatus}
                />
              )}
            </Grid>)}
          </Grid>
          <Grid
            container={true}
            item={true}
            xs={12}
            sm={12}
            md={12}
            lg={12}
            justify="center"
            className={styles.dateWrapper}
          >
            <UploadedDocumentElement
              uploadedDocument={uploadedDocument}
              viewImage={viewImage}
              removeFile={removeFile}
              resourceId={resourceId}
              resourceType={resourceType}
            />
          </Grid>
        </>
      )}
      {noOfDocTypesRequired > 1 && sortedConfigData.map((type, index) => (
        <MultipleDocs
          type={type}
          docType={selectedDocType}
          getPreSignedUrl={getPreSignedUrl}
          viewImage={viewImage}
          removeFile={removeFile}
          statusFilter={statusFilter}
          updateDocumentStatus={updateDocumentStatus}
          uploadedDocs={docList}
          resourceId={resourceId}
          metaData={metaData}
          cancelMetaData={cancelMetaData}
          // uploadedDocumentCount={uploadedDocument && uploadedDocument.files && uploadedDocument.files.length}
          resourceType={resourceType}
          docCategory={docCategory}
          saveMetaData={saveMetaData}
          postMetaData={postMetaData}
          noDivider={index === sortedConfigData.length - 1}
        />
      ))}
    </Grid>
  );
};

DocumentElement.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  })
};

DocumentElement.defaultProps = {
  input: {
    onChange: () => { },
    value: ''
  }
};

export default DocumentElement;
