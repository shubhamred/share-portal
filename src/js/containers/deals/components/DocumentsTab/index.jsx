/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getInvestments } from 'app/containers/deals/saga';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import { DialogComponent } from 'app/components';
import Tooltip from '@material-ui/core/Tooltip';
import {
  getConfig,
  getDocs,
  getPatronDocPresignedUrl,
  getPatrons,
  postMetaData,
  removeFile
} from 'app/containers/patrons/saga';
import { saveFile } from 'app/containers/applications/saga';
import { extend, find, map as lodashMap, pick, uniq, groupBy } from 'lodash';
import FileUploader from 'app/containers/document/fileUploader';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DocumentFile from 'app/components/singleDocument/Document';
import styles from './styles.scss';
import DocListing from './components/docListing';

const DealDocuments = (props) => {
  const KEY = 'INVESTMENT';
  const [customerData, setCustomerData] = useState('');
  const [customerDocsData, setCustomerDocsData] = useState('');
  const [dealDocsData, setDealDocsData] = useState('');
  const [docConfig, setDocConfig] = useState('');
  const [signedDocData, setSignDocs] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [TDSConfig, setTDSConfig] = useState('');
  const [DEALConfig, setDEALConfig] = useState([]);
  const [InvestmentConfig, setInvestmentConfig] = useState([]);
  const [InvestmentDocConfig, setInvestmentDocConfig] = useState({});
  const [DEALDocConfig, setDEALDocumentConfig] = useState({});
  const [dialogStatus, toggleDialog] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(0);
  const { deal, dealDocValidation } = props;
  const { id: dealId } = deal || {};

  const init = () => {
    const params = {
      where: { dealId, status: 'Invested' },
      take: 50,
      page: 1
    };
    getInvestments(params).then((res) => {
      if (res.data) {
        if (!res.data.length) {
          setCustomerData('');
          return;
        }
        const customersIdsArr = uniq(res.data.map((cus) => cus.customerId));
        const customerParams = {
          fields: 'name,firstName,lastName,id',
          where: {
            id: {
              in: customersIdsArr
            },
            isPatron: true
          },
          take: params.take
        };
        getPatrons(customerParams).then((cusData) => {
          const mergedList = lodashMap(res.data, (item) => extend(
            item,
            pick(find(cusData.data, { id: item.customerId }), ['name'])
          ));
          setCustomerData(mergedList);
        });
      } else {
        setCustomerData('');
      }
    });
  };

  const getDocumentsOfCustomer = (resId) => {
    getDocs(resId, 'DEAL').then((res) => {
      setCustomerDocsData((prevState) => ({
        ...prevState,
        [resId]: res.data && res.data[0] && res.data[0].files
      }));
    });
  };

  const handleDialgueClose = () => {
    toggleDialog(false);
    setSelectedInvestor(0);
  };

  const getDealDocs = (isDelete) => {
    getDocs(dealId, 'DEAL').then((res) => {
      if (groupBy(res.data, 'docType')) {
        const filteredDocs = res.data?.filter((data) => data.isArchived === false);
        if (isDelete) {
          setSignDocs(() => ({ ...groupBy(filteredDocs, 'docType') }));
        } else {
          setSignDocs((prevState) => ({ ...prevState, ...groupBy(filteredDocs, 'docType') }));
        }
      }
      setDealDocsData(res.data && res.data[0] && res.data[0].files);
    });
  };

  const getDocUploadConfig = () => {
    getConfig('DEAL').then((res) => {
      const categories = res.data;

      const DEAL_CONFIG = categories?.find((item) => {
        const { documentCategory } = item;
        return documentCategory.key === 'DEAL';
      });

      if (DEAL_CONFIG) {
        setDEALDocumentConfig(DEAL_CONFIG);
        getConfiguredDocumentTypes('DEAL', DEAL_CONFIG.documentCategoryId).then((data) => {
          setDEALConfig(data?.data?.length ? data?.data : []);
        });
      }

      const investConfig = categories && categories.find((cat) => {
        const { documentCategory } = cat;
        return documentCategory.key === KEY;
      });
      if (!investConfig?.documentCategoryId) {
        return;
      }
      getConfiguredDocumentTypes('DEAL', investConfig?.documentCategoryId).then((response) => {
        if (response?.data?.length) {
          const configuredDocTypes = response.data;
          const INVESTMENT_DOCUMENTS = configuredDocTypes
            && configuredDocTypes.find(
              (doc) => doc.documentType.key === 'INVESTMENT_DOCUMENTS'
            );
          const TDS_CERTIFICATES = configuredDocTypes
            && configuredDocTypes.find(
              (doc) => doc.documentType.key === 'TDS_CERTIFICATES'
            );

          setDocConfig(INVESTMENT_DOCUMENTS);
          setTDSConfig(TDS_CERTIFICATES);
        }
      });
    });
    getConfig('INVESTMENT').then((res) => {
      const categories = res.data;

      const INVESTMENT_CONFIG = categories?.find((item) => {
        const { documentCategory } = item;
        return documentCategory.key === 'INVESTMENT';
      });

      if (INVESTMENT_CONFIG) {
        setInvestmentDocConfig(INVESTMENT_CONFIG);
        getConfiguredDocumentTypes('INVESTMENT', INVESTMENT_CONFIG.documentCategoryId).then((data) => {
          setInvestmentConfig(data?.data?.length ? data?.data : []);
        });
      }
    });
  };

  useEffect(() => {
    if (dealId) {
      getDealDocs();
      init();
      getDocUploadConfig();
    }
  }, []);

  const handlePanelToggle = (expanded, id) => {
    if (expanded) {
      getDocumentsOfCustomer(id);
    }
  };

  const handleFileDelete = (fileId, customerId = '') => {
    removeFile(fileId).then((res) => {
      if (res.data) {
        // eslint-disable-next-line no-unused-expressions
        customerId ? getDocumentsOfCustomer(customerId) : getDealDocs();
      }
    });
  };

  const handlePostMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    const payload = {
      key,
      name,
      type,
      size,
      resourceType,
      resourceId,
      docCategory,
      docType
    };
    saveFile(typeof resourceId === 'object' ? resourceId : payload).then((res) => {
      if (res.data) {
        getDealDocs();
        getDocumentsOfCustomer(resourceId);
      }
    });
  };

  return (
    <>
      <Grid container={true}>
        <DocListing
          signedDocData={signedDocData}
          deal={deal}
          getDealDocs={getDealDocs}
          DEALConfig={DEALConfig}
          DEALDocConfig={DEALDocConfig}
          InvestmentConfig={InvestmentConfig}
          InvestmentDocConfig={InvestmentDocConfig}
          dealDocValidation={dealDocValidation}
        />

        <Grid
          className={styles.mb5}
          item={true}
          xs={12}
          container={true}
          justify="space-between"
          alignItems="center"
        >
          <p className={styles.typeHeading}>Deal Documents</p>
          <div>
            {docConfig && (
              <FileUploader
                btnLabel="Upload"
                uploadedDocumentCount={null}
                resourceType="DEAL"
                docCategory={KEY}
                resourceId={dealId}
                minNumberOfFiles={1}
                getPreSignedUrl={getPatronDocPresignedUrl}
                handleSaveMetaData={handlePostMetaData}
                docType={docConfig.documentType}
              />
            )}
          </div>
        </Grid>
        {dealDocsData && dealDocsData.length ? (
          <Grid item={true} xs={12} container={true}>
            {dealDocsData.map((doc) => (
              <Grid
                item={true}
                xs={4}
                key={doc.id}
                style={{ marginBottom: '7px' }}
              >
                <DocumentFile
                  name={doc.fileName}
                  id={doc.id}
                  onDeleteClick={(fileId) => handleFileDelete(fileId)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No Deal Documents Found</Typography>
        )}
        {/* </Grid> */}
        <Divider style={{ margin: '15px 0' }} />
        <Grid container={true}>
          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={styles.mb5}
          >
            <p className={styles.typeHeading}>Patron Documents</p>
            <div>
              <Tooltip
                title={
                !customerData.length
                  ? 'Please move Patrons to ‘Invested’ state to upload Patron docs'
                  : ''
              }
              >
                <div>
                  <Button
                    startIcon={<CloudUploadIcon color="primary" />}
                    onClick={() => toggleDialog(true)}
                    disabled={!customerData.length}
                  >
                    Upload
                  </Button>
                </div>
              </Tooltip>
            </div>
          </Grid>
          <Grid item={true} xs={12}>
            {customerData && customerData.length ? (
              customerData.map((customer) => (
                <Accordion
                  classes={{ root: styles.disableShadow }}
                  onChange={(eve, val) => handlePanelToggle(val, customer.id)}
                  key={customer.id}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    classes={{ root: styles.maxWidth25 }}
                  >
                    <Typography>{customer.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {customerDocsData && customerDocsData[customer.id] ? (
                      <Grid item={true} xs={12} container={true}>
                        {customerDocsData[customer.id].map((doc) => (
                          <Grid
                            item={true}
                            xs={4}
                            key={doc.id}
                            style={{ marginBottom: '7px' }}
                          >
                            <DocumentFile
                              name={doc.fileName}
                              id={doc.id}
                              onDeleteClick={(fileId) => handleFileDelete(fileId, customer.id)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography>No Documents Found</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No Investors Found</Typography>
            )}
          </Grid>
        </Grid>
        {dialogStatus && (
        <DialogComponent
          onClose={handleDialgueClose}
          customWidth="300px"
          customHeight={190}
        >
          <Grid container={true}>
            <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
              <InputLabel id="investor-select">Investor</InputLabel>
              <Select
                style={{ width: '100%' }}
                labelId="investor-select"
                id="investor-select"
                value={selectedInvestor}
                onChange={(eve) => setSelectedInvestor(eve.target.value)}
              >
                <MenuItem value={0} disabled={true}>
                  Select Investor
                  {' '}
                </MenuItem>
                {customerData.map((invester) => (
                  <MenuItem key={invester.id} value={invester.id}>
                    {invester.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item={true} xs={12} style={{ marginTop: '10px' }}>
              {!selectedInvestor ? (
                <Button
                  fullWidth={true}
                  disabled={true}
                  color="default"
                  startIcon={<CloudUploadIcon />}
                >
                  Select File
                </Button>
              ) : null}
              <div>
                {selectedInvestor ? (
                  <FileUploader
                    btnProps={{
                      fullWidth: true,
                      variant: 'outlined',
                      color: 'primary'
                    }}
                    onBtnClick={(val) => !val && handleDialgueClose()}
                    btnLabel="Select File"
                    uploadedDocumentCount={null}
                    resourceType="DEAL"
                    isMetaPending={!selectedInvestor}
                    docCategory={KEY}
                    resourceId={selectedInvestor}
                    minNumberOfFiles={1}
                    getPreSignedUrl={getPatronDocPresignedUrl}
                    handleSaveMetaData={handlePostMetaData}
                    docType={TDSConfig.documentType}
                  />
                ) : null}
              </div>
            </Grid>
          </Grid>
        </DialogComponent>
        )}

      </Grid>
    </>
  );
};

const mapStateToProps = ({ dealReducer, form }) => ({
  dealDocValidation: dealReducer.dealDocValidation
});

export default React.memo(connect(mapStateToProps, null)(DealDocuments));
