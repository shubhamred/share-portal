import React, { useEffect, useState } from 'react';
import {
  Grid,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button
} from '@material-ui/core';
import { startCase, isArray } from 'lodash';
import Documents from 'app/containers/shared/documentsTab';
import { DialogComponent, FileUploader } from 'app/components';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
  getDocs,
  getPatronDocPresignedUrl
} from 'app/containers/patrons/saga';
import AddDocumentSection from 'app/containers/products/productDetail/sections/documents/addDocument';
import {
  postNewDocType,
  saveFile,
  getConfig
} from 'app/containers/applications/saga';
import { getIntegrationData } from 'app/containers/brands/saga';
import { getDocConfigByProduct } from 'app/containers/docsService/saga';

const ApplicationDocuments = (props) => {
  const { application, setBreadcrumbsData, position } = props;
  const [docCat, setDocCat] = useState([]);
  const [applicationDoc, setApplicationDoc] = useState([]);
  const [configuredDocTypes, setConfiguredDocTypes] = useState([]);
  const [modalOpen, toggleModal] = useState(false);
  const [additionalDocModalOpen, toggleAdditionalDocModal] = useState(false);
  const [docTypeUpload, setDocTypeUpload] = useState('');
  const [selectedDocConfig, setSelectedDocConfig] = useState('');
  const [isAdditionalDocSection, toggleAdditionalSection] = useState(false);
  const [additionalDocCat, setAdditionalDocCat] = useState([]);
  const [integrationData, setIntegrationData] = useState([]);
  const [selectedCat, setAdditionalCat] = useState('');

  useEffect(() => {
    if (application && application.product) {
      fetchConfig();

      getDocs(application.id, 'APPLICATION').then((res) => {
        if (res.data) {
          setApplicationDoc(res.data);
        }
      });

      getIntegrationData(application.companyCode).then((res) => {
        if (res.data) {
          setIntegrationData(res.data);
        }
      });
    }
  }, [application]);

  const fetchConfig = () => {
    getDocConfigByProduct(application.product.productCode).then((res) => {
      if (res.data) {
        const formattedList = [];
        // eslint-disable-next-line no-unused-expressions
        res.data?.forEach((doc) => {
          if (doc.resources?.length) {
            doc.resources.map((cat) => formattedList.push(cat));
          }
        });
        getConfig(application.applicationCode).then((additional) => {
          if (additional?.data?.length) {
            setDocCat([...formattedList]);
          } else {
            setDocCat([...formattedList]);
          }
        });
      }
    });
  };

  const handleChange = (event) => {
    setSelectedDocConfig('');
    const { value } = event.target;
    if (isAdditionalDocSection) {
      const config = configuredDocTypes.documentTypes.find(
        (doc) => doc.id === value
      );
      if (config) {
        setDocTypeUpload(value);
        setTimeout(() => {
          setSelectedDocConfig({ documentType: { ...config } });
        }, 500);
      }
    } else {
      const config = configuredDocTypes.find((doc) => doc.id === value);
      if (config) {
        setDocTypeUpload(value);
        setTimeout(() => {
          setSelectedDocConfig(config);
        }, 500);
      }
    }
  };

  const handleModalOpen = (type) => {
    // eslint-disable-next-line array-callback-return,consistent-return
    const temp = type.configuredDocTypes.filter((doc) => {
      if (doc.documentType || doc.documentTypes) {
        // return { ...doc, documentType: doc.documentType || doc.documentTypes };
        return doc;
      }
    });
    // console.log({ type, temp });
    if (temp.length) {
      if (type.key === 'ADDITIONAL_DOCUMENTS') {
        toggleAdditionalSection(true);
        setAdditionalDocCat(temp);
        setDocTypeUpload('');
        setSelectedDocConfig('');
      } else {
        toggleAdditionalSection(false);
        setDocTypeUpload(temp[0]?.id);
        setSelectedDocConfig(temp[0]);
        setConfiguredDocTypes(temp);
      }
      toggleModal(true);
    }
  };

  const handleCatChange = (event) => {
    const { value } = event.target;
    setAdditionalCat(value);
    const temp = additionalDocCat.find((cat) => cat.id === value);
    // console.log(additionalDocCat, value, temp);
    setDocTypeUpload('');
    setConfiguredDocTypes(temp);
    // setSelectedDocConfig(temp[0]);
    // setConfiguredDocTypes(temp);
  };

  const getDocCat = (config) => {
    if (isAdditionalDocSection) return 'ADDITIONAL_DOCUMENTS';
    const configTemp = docCat.find((list) => list.documentCategoryId === config.documentCategoryId);
    return configTemp?.documentCategory?.key;
  };

  const handleModalClose = () => {
    setConfiguredDocTypes([]);
    setDocTypeUpload('');
    toggleModal(false);
    setAdditionalCat('');
  };

  const saveMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    // console.log({ resourceId,
    //   resourceType,
    //   name,
    //   type,
    //   size,
    //   docType,
    //   docCategory,
    //   key });
    if (isArray(resourceId)) {
      saveFile(resourceId).then((res) => {
        if (res.data) {
          getDocs(application.id, 'APPLICATION').then((data) => {
            if (data.data) {
              setApplicationDoc(data.data);
            }
          });
        }
      });
      return;
    }

    saveFile({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      if (res.data) {
        getDocs(application.id, 'APPLICATION').then((data) => {
          if (data.data) {
            setApplicationDoc(data.data);
          }
        });
      }
    });
  };

  const handleAdditionalDocAdd = () => {
    toggleAdditionalDocModal(true);
  };

  const onSave = (data) => {
    const configuredDocumentTypes = data.docsArr.map((type, index) => ({
      documentTypeId: type.docType,
      isMandatory: type.isMandatory,
      description: type.description,
      displayOrder: index + 1
    }));
    const payload = {
      resource: application.applicationCode,
      // resource: 'APPLICATION',
      // resourceCode: application.applicationCode,
      documentCategoryId: data.selectedDocCat,
      configuredDocumentTypes
    };
    // console.log(payload);
    postNewDocType(payload).then((res) => {
      if (res.data) {
        // fetchConfig(); //Commented out as the tab selection is resetting to first
        fetchConfig();
        toggleAdditionalDocModal(false);
      }
    });
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Documents
          resourceCode={application?.product?.productCode || ''}
          application={application}
          docCat={docCat}
          cusDoc={applicationDoc}
          integrationData={integrationData}
          showStatus={false}
          showUpload={true}
          setBreadcrumbsData={setBreadcrumbsData}
          position={position}
          onUploadClick={handleModalOpen}
          onAddDocClick={handleAdditionalDocAdd}
          getPatronDocPresignedUrl={getPatronDocPresignedUrl}
          saveMetaData={saveMetaData}
        />
      </Grid>
      <Grid item={true} xs={12}>
        {modalOpen && (
          <DialogComponent
            title="Select Document Type"
            onClose={handleModalClose}
          >
            <Grid container={true}>
              {isAdditionalDocSection ? (
                <Grid item={true} xs={12}>
                  <FormControl style={{ width: '100%' }}>
                    <InputLabel id="select-Category">
                      Select Document Category
                    </InputLabel>
                    <Select
                      labelId="select-Category"
                      value={selectedCat}
                      onChange={handleCatChange}
                    >
                      {additionalDocCat.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ) : null}
              <Grid item={true} xs={12}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="select-label">
                    Select Document Type
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    value={docTypeUpload}
                    onChange={handleChange}
                  >
                    {isAdditionalDocSection
                      ? configuredDocTypes?.documentTypes?.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {startCase(type?.name)}
                        </MenuItem>
                      ))
                      : configuredDocTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {startCase(type?.documentType?.name)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item={true} xs={12} style={{ marginTop: '20px' }}>
                <Grid container={true} justify="flex-end" alignItems="center">
                  <Button onClick={handleModalClose}>Cancel</Button>
                  <div style={{ width: 'auto' }}>
                    {selectedDocConfig && selectedDocConfig.documentType ? (
                      <FileUploader
                        uploadedDocumentCount={null}
                        resourceType="APPLICATION"
                        docCategory={getDocCat(selectedDocConfig)}
                        resourceId={application.id}
                        minNumberOfFiles={1}
                        getPreSignedUrl={getPatronDocPresignedUrl}
                        handleSaveMetaData={saveMetaData}
                        docType={selectedDocConfig.documentType}
                        onBtnClick={(val) => toggleModal(val)}
                      />
                    ) : (
                      <Button
                        startIcon={<CloudUploadIcon />}
                        disabled={true}
                        color="primary"
                      >
                        Upload
                      </Button>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </DialogComponent>
        )}
        {additionalDocModalOpen && (
          <DialogComponent
            title="Additional documents"
            closeButton={false}
            customWidth="790px"
          >
            <AddDocumentSection
              onSave={onSave}
              application={application}
              isAdditionalDoc={true}
              docCategoryDisable={true}
              onClose={() => toggleAdditionalDocModal(false)}
            />
          </DialogComponent>
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(ApplicationDocuments);
