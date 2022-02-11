import React, { useEffect, useState } from 'react';
import { Button, Divider, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { getHashPositionValue } from 'app/utils/utils';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import { SingleDocument, FileUploader } from 'app/components';
import { chain, startCase } from 'lodash';
import BankingDocuments from './components/bankingDocHandler';
import GstDocuments from './components/gstDocHandler';

const useStyles = makeStyles(() => ({
  background: {
    background: '#fff',
    boxShadow: '0px 7px 9px -5px #dad5d5',
    maxHeight: '50px'
  },
  shadowHide: {
    boxShadow: 'none'
  },
  btn: {
    color: '#1518af'
  },
  margin20: {
    margin: '20px'
  },
  tabBtn: {
    fontWeight: '600',
    textTransform: 'capitalize',
    '&>:nth-child(2)': {
      pointerEvents: 'unset',
      '&:hover': {
        borderBottom: '1.5px solid'
      }
    }
  }
}));

const ApplicationDetails = (props) => {
  // console.log(props);
  const classes = useStyles();
  const {
    docCat,
    cusDoc,
    showStatus,
    updateStatus,
    showUpload,
    onUploadClick,
    onAddDocClick,
    application,
    saveMetaData,
    getPatronDocPresignedUrl,
    integrationData,
    setBreadcrumbsData,
    position,
    resourceCode
  } = props;

  const [value, setValue] = useState(0);
  const [currentDocCat, setCurrentDocCat] = useState({});
  const [docStatus, setDocStatus] = useState('');
  const [showStatusUpdate, toggleStatusUpdate] = useState({
    open: false,
    data: null
  });
  const [docOptions, setDocOptions] = useState([]);

  const loadDocType = (docCategory, index = 0) => {
    const resource = docCategory.documentCategory.key === 'ADDITIONAL_DOCUMENTS'
      ? application.applicationCode
      : (resourceCode || docCategory.resourceCode);
    getConfiguredDocumentTypes(resource, docCategory.documentCategoryId).then((res) => {
      const configuredDocTypes = res.data.filter((list) => list.isArchived === false);
      setCurrentDocCat({
        ...docCategory,
        key: docCategory.documentCategory.key,
        configuredDocTypes: res?.data?.length ? configuredDocTypes : []
      });
      setValue(index);
    });
  };

  useEffect(() => {
    if (docCat && docCat.length && currentDocCat.key === 'ADDITIONAL_DOCUMENTS') {
      const findIndex = docCat.findIndex(
        (list) => list.documentCategory.key === 'ADDITIONAL_DOCUMENTS'
      );
      loadDocType(docCat[findIndex], findIndex);
    }
  }, [docCat]);

  useEffect(() => {
    if (docCat && docCat.length) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = docCat.findIndex((list) => list.documentCategory.name.match(re) !== null);
        if (TabValue >= 0) {
          loadDocType(docCat[TabValue], TabValue);
          setBreadcrumbsData(docCat[TabValue].documentCategory.name, position, false);
        } else {
          loadDocType(docCat[0], 0);
          setBreadcrumbsData(docCat[0].documentCategory.name, position, false, () => {}, true);
        }
      } else {
        loadDocType(docCat[0], 0);
        setBreadcrumbsData(docCat[0].documentCategory.name, position);
      }
    }
  }, [docCat]);

  const allFiles = (cusDoc && cusDoc.filter((doc) => doc.docCategory === currentDocCat?.key)) || [];

  const mergeFiles = (arr) => chain(arr)
    .groupBy('docType')
    .mapValues((v) => ({
      ...v[0],
      files: chain(v).map('files').flattenDeep().value()
    }))
    .value();

  const currentDocs = Object.values(mergeFiles(allFiles));

  const handleChange = (event, newValue) => {
    loadDocType(docCat[newValue], newValue);
    setBreadcrumbsData(docCat[newValue].documentCategory.name, position, false, () => {}, true);
  };

  const handleDocStatusUpdate = () => {
    if (docStatus) {
      updateStatus(showStatusUpdate.open, docStatus);
      toggleStatusUpdate({ open: false, data: null });
    }
  };

  const handleUploadClick = () => {
    onUploadClick(currentDocCat);
  };

  const updateStatusClick = (data) => {
    const DOC_STATUS = [];
    if (data.status) {
      if (data.status === 'Pending') {
        DOC_STATUS.push('Received');
        setDocOptions(DOC_STATUS);
      } else if (data.status === 'Received') {
        DOC_STATUS.push('Verified');
        setDocOptions(DOC_STATUS);
      }
    }
    toggleStatusUpdate({ open: data.id, data });
  };

  const getAdditionalDocTypes = () => {
    const uploadedTypes = currentDocs.map((type) => type.docType);
    if (currentDocCat?.configuredDocTypes?.length) {
      const allTypes = [...currentDocCat?.configuredDocTypes];
      // eslint-disable-next-line array-callback-return,consistent-return
      const filteredTypes = allTypes.filter((type) => {
        const isUploaded = uploadedTypes.find((docType) => docType === type.documentType.key);
        return !isUploaded;
      });
      return filteredTypes;
    }
    return [];
  };

  const getIntegrationDocTypes = () => {
    if (!integrationData?.length || !currentDocCat?.configuredDocTypes?.length) return [];
    return integrationData.filter((integrationAcc) => currentDocCat.configuredDocTypes.find((type) => type.documentType.key.toLowerCase().includes(integrationAcc.type.toLowerCase())));
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Paper square={true} className={classes.shadowHide}>
          <AppBar position="static" elevation={2} className={classes.background}>
            <Tabs
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#1518AF',
                  color: '#1518AF'
                }
              }}
              classes={{ scrollButtons: classes.btn }}
              value={value}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleChange}
            >
              {docCat
                && docCat.map((document) => (
                  <Tab
                    className={classes.tabBtn}
                    key={document.documentCategoryId}
                    label={document.documentCategory.name}
                  />
                ))}
            </Tabs>
          </AppBar>
        </Paper>
      </Grid>
      {/* eslint-disable-next-line no-nested-ternary */}
      {currentDocCat && currentDocCat?.key?.includes('BANKING') ? (
        <Grid item={true} xs={12} className={classes.margin20}>
          <BankingDocuments application={application} config={currentDocCat} />
        </Grid>
      ) : currentDocCat && currentDocCat?.key?.includes('GST') ? (
        <Grid item={true} xs={12} className={classes.margin20}>
          <GstDocuments application={application} config={currentDocCat} />
        </Grid>
      ) : (
        <Grid item={true} xs={12} className={classes.margin20}>
          <Grid container={true} justify="space-between" alignItems="center">
            <Grid item={true} />
            <Grid item={true} container={true} justify="flex-end">
              {currentDocCat && currentDocCat.key === 'ADDITIONAL_DOCUMENTS' ? (
                <Button onClick={onAddDocClick} color="primary" style={{ fontWeight: '600' }}>
                  Add Document Type
                </Button>
              ) : null}
              {showUpload && currentDocCat && currentDocCat.key !== 'ADDITIONAL_DOCUMENTS' ? (
                <Button
                  disabled={!currentDocCat?.configuredDocTypes?.length}
                  onClick={handleUploadClick}
                  color="primary"
                  style={{ fontWeight: '600' }}
                >
                  Upload Documents
                </Button>
              ) : null}
            </Grid>
          </Grid>
          {currentDocCat?.key === 'ADDITIONAL_DOCUMENTS' ? (
            <Grid container={true}>
              {getAdditionalDocTypes().length ? <p>Requested Documents:</p> : null}
              {getAdditionalDocTypes().map((type) => (
                <Grid
                  item={true}
                  xs={12}
                  container={true}
                  key={type.documentType?.id}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item={true}>
                    <p>{type.documentType?.name}</p>
                  </Grid>
                  <Grid item={true}>
                    <FileUploader
                      resourceType="APPLICATION"
                      docCategory="ADDITIONAL_DOCUMENTS"
                      resourceId={application?.id}
                      minNumberOfFiles={1}
                      getPreSignedUrl={getPatronDocPresignedUrl}
                      handleSaveMetaData={saveMetaData}
                      docType={type.documentType}
                    />
                  </Grid>
                  <Divider width="100%" />
                </Grid>
              ))}
            </Grid>
          ) : null}

          {getIntegrationDocTypes().length ? (
            <Grid container={true}>
              {getIntegrationDocTypes().map((acc) => (
                <>
                  <Grid
                    item={true}
                    xs={12}
                    container={true}
                    alignItems="center"
                    justify="space-between"
                  >
                    <Grid item={true} xs={12}>
                      <p>
                        <b>{acc.type}</b>
                      </p>
                      <p style={{ display: 'flex' }}>
                        {' '}
                        <img
                          style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '20px',
                            padding: '0 5px'
                          }}
                          src="assets/ApprovedIcon.svg"
                          alt="verified"
                        />
                        {' '}
                        {acc.viewAccess
                          ? 'Shared view access at data@klubworks.com.'
                          : `Account connected by OAuth. Access data from ${
                            currentDocCat.name || ''
                          } section or MetaBase
                        `}
                      </p>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : null}

          <Grid container={true}>
            {currentDocs.length && currentDocCat?.key === 'ADDITIONAL_DOCUMENTS' ? (
              <p>Uploaded Documents:</p>
            ) : null}
            {/* eslint-disable-next-line no-nested-ternary */}
            {currentDocs?.length ? (
              currentDocs.map((doc) => (
                <>
                  <Grid
                    item={true}
                    xs={12}
                    container={true}
                    alignItems="center"
                    justify="space-between"
                  >
                    <Grid item={true}>
                      <p>{startCase(doc.docType)}</p>
                    </Grid>
                    <Grid
                      item={true}
                      xs={5}
                      container={true}
                      justify="flex-end"
                      alignItems="center"
                      style={{ display: showStatus ? 'flex' : 'none' }}
                    >
                      {showStatusUpdate.open === doc.id ? (
                        <>
                          <Grid item={true} xs={6}>
                            <FormControl style={{ width: '100%' }}>
                              <InputLabel id="doc-status">Document Status</InputLabel>
                              <Select
                                labelId="doc-status"
                                value={docStatus}
                                onChange={(event) => setDocStatus(event.target.value)}
                              >
                                <MenuItem value="" disabled={true}>
                                  Select Status
                                </MenuItem>
                                {docOptions.map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item={true}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleDocStatusUpdate}
                            >
                              Update Status
                            </Button>
                          </Grid>
                        </>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => updateStatusClick(doc)}
                        >
                          Update Document Status
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                  {showStatus ? (
                    <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
                      {doc.status}
                      {' '}
                      Documents:
                    </Grid>
                  ) : null}

                  {doc.files && doc.files.length ? (
                    doc.files.map((file) => (
                      <Grid item={true} xs={4} key={file.id} style={{ marginBottom: '15px' }}>
                        <SingleDocument id={file.id} name={file.fileName} />
                      </Grid>
                    ))
                  ) : (
                    <p>No Document Available</p>
                  )}
                  <Divider width="100%" />
                </>
              ))
            ) : getIntegrationDocTypes().length ? null : (
              <p>No Document Available</p>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

ApplicationDetails.propTypes = {
  docCat: PropTypes.arrayOf(PropTypes.object),
  cusDoc: PropTypes.arrayOf(PropTypes.object),
  showStatus: PropTypes.bool,
  showUpload: PropTypes.bool,
  position: PropTypes.number,
  onUploadClick: PropTypes.func,
  onAddDocClick: PropTypes.func,
  setBreadcrumbsData: PropTypes.func
};

ApplicationDetails.defaultProps = {
  docCat: [],
  cusDoc: [],
  showStatus: false,
  showUpload: false,
  position: 0,
  onUploadClick: () => {},
  onAddDocClick: () => {},
  setBreadcrumbsData: () => {}
};

export default ApplicationDetails;
