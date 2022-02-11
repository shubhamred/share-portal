/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import {
  updateConfiguredDocCategory,
  updateDocType,
  addDocConfig,
  archiveConfiguredDocCategory,
  updateConfiguration
} from 'app/containers/docsService/saga';
import { isEqual } from 'lodash';
import { getDocs } from 'app/containers/patrons/saga';
import AddDocConfig from '../form/addDocConfig';
import EditDocType from '../form/editDocType';
import UploadDoc from '../form/addTemplateConfig/uploadDoc';
import DocType from '../docType';
import styles from '../../styles.scss';
import { DialogComponent } from '../../../../components';

const DocCategory = (props) => {
  const { config, handleCancel, currentResource, resourceTypes, fetchConfigData } = props;
  const dispatch = useDispatch();
  const [docTypes, setDocTypes] = useState([]);
  const [docTypeData, setDocTypeData] = useState({});
  const [deleteId, setDeleteId] = useState('');
  const [isFormUpdated, toggleFormUpdated] = useState(false);
  const [openDialog, setOpenDialogstatus] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [openEditDialog, setOpenEditDialogstatus] = useState(false);
  const [uploadDoc, setUploadDocConfig] = useState({ });
  const [isDelete, toggleIsDelete] = useState(false);
  const [docs, setDocs] = useState({});

  useEffect(() => {
    loadData();
  }, [config]);

  const loadData = () => {
    if (config?.documentCategoryId) {
      setDocTypes(config.documentTypes?.filter((list) => list.isArchived === false));
    }
  };

  const handelDeleteFun = (id) => {
    setDeleteId(id);
    toggleIsDelete(true);
  };

  const handleDeleteOld = (id) => {
    const mData = [...docTypes];
    const index = mData.findIndex((list) => list.id === id);
    if (index >= 0) {
      archiveConfiguredDocCategory(id).then((res) => {
        if (res.message === 'OK') {
          fetchConfigData();
          toggleIsDelete(false);
        }
      });
    }
  };

  const getDocuments = (data = {}) => {
    const { id, resource } = data;
    getDocs(id, resource).then((res) => {
      if (res.data) {
        setDocs((prevState) => ({ ...prevState, [id]: res.data }));
      }
    });
  };

  const handleOptionChange = (fieldType, value, fieldObj) => {
    toggleFormUpdated(true);
    setDocTypes((prevState) => prevState.map((type) => {
      if (type.id === fieldObj.id) {
        return {
          ...type,
          [fieldType]: value
        };
      }
      return type;
    }));
  };

  const handleSubmit = (data) => {
    const payload = {
      resource: typeof data.resource !== 'string' ? data.resource?.key || data.resource?.title : data.resource,
      isMandatory: data?.isMandatory || false,
      description: data?.description || null,
      defaultTemplate: data?.defaultTemplate || null,
      displayOrder: docTypes.length + 1,
      documentCategoryId: config?.documentCategoryId || '',
      isTemplateRequired: data?.isTemplate || false,
      isSignatureRequired: data?.isDocSigning || false,
      product: data.product,
      applicationStatus: data.applicationStatus
    };
    if (data.isDoc) {
      payload.documentType = {
        name: data?.name || '',
        maximumFiles: data?.maximumFiles || 0,
        maximumFileSize: data.maximumFileSize * (1024 * 1024) || 0,
        allowedContentTypes: data?.fileType || []
      };
      addConfig(payload);
    } else {
      payload.documentTypeId = data?.docType?.id || '';
      addConfig(payload, data?.isTemplate);
    }
  };

  const addConfig = (payload, isTemplate) => {
    addDocConfig(payload).then((res) => {
      if (res.data) {
        // setOpenDialogstatus(false);
        setUploadDocConfig(res.data);
        if (isTemplate) {
          setOpenDialogstatus(false);
          setOpenDocDialog(true);
          setUploadDocConfig(res.data);
        } else {
          setOpenDialogstatus(false);
        }
        fetchConfigData();
      } else {
        dispatch({
          type: 'show',
          payload: res?.message || '',
          msgType: 'error'
        });
      }
    });
  };

  const handleUpdateType = (docConfig, isTemplate) => {
    if (isTemplate) {
      setOpenDocDialog(true);
      setUploadDocConfig(docConfig);
    }
    setUploadDocConfig(docConfig);
    setOpenDialogstatus(false);
    fetchConfigData();
  };

  const handleEditFun = (data) => {
    setOpenEditDialogstatus(true);
    setDocTypeData(data);
  };

  const handleEditSubmit = async (data) => {
    const payload = {
      name: data.name,
      maximumFiles: data.maximumFiles,
      maximumFileSize: data.maximumFileSize * (1024 * 1024),
      allowedContentTypes: data.fileType
    };

    const configPayload = {
      description: data.description || null,
      resource: data?.resource?.name,
      applicationStatus: data?.applicationStatus?.name,
      isSignatureRequired: data.isDocSigning,
      isTemplateRequired: data.isTemplate
    };
    await updateConfiguration(docTypeData.id, configPayload);

    updateDocType(payload, data.documentTypeId).then((res) => {
      if (res.data) {
        setOpenEditDialogstatus(false);
      }
      fetchConfigData();
    });
  };

  const handleSave = () => {
    const isOldDataChanged = !isEqual(docTypes, config.configuredDocTypes);
    if (isOldDataChanged) {
      const payload = docTypes.map((type) => ({
        configuredDocumentTypeId: type.id,
        isMandatory: type.isMandatory,
        displayOrder: type.displayOrder,
        description: type?.description || null,
        defaultTemplate: type?.defaultTemplate || null
      }));
      updateConfiguredDocCategory({ configuredDocumentTypes: payload }).then((res) => {
        if (res.data) {
          toggleFormUpdated(false);
          fetchConfigData();
        }
      });
    } else {
      toggleFormUpdated(false);
    }
  };

  const tag = (
    uploadDoc?.documentType?.name
      ? (
        <Grid item={true} className={styles.tag}>
          {uploadDoc?.documentType?.name}
        </Grid>
      ) : ''
  );

  return (
    <Grid container={true} xs={12} item={true}>
      {docTypes.map((type, index) => (
        <Grid item={true} xs={12} key={type.id}>
          <DocType
            type={{
              ...type,
              isMultiple: type.documentType.maximumFiles > 1,
              noOfFiles: type.documentType.maximumFiles
            }}
            handleOptionChange={handleOptionChange}
            handleDelete={handelDeleteFun}
            handleEdit={handleEditFun}
            isLastDocType={docTypes.length - 1 === index}
            config={config}
            docs={docs}
            getDocuments={getDocuments}
          />
        </Grid>
      ))}
      <Grid className={styles.mt14} item={true} xs={12} container={true} justify="space-between">
        <Grid item={true}>
          <Button
            className={`${styles.fontStyle} ${styles.buttonStyle}`}
            color="primary"
            variant="contained"
            onClick={() => setOpenDialogstatus(true)}
          >
            Add Doc Type
          </Button>
        </Grid>
        <Grid item={true} className={styles.accBtnContainer}>
          {isFormUpdated && (
            <>
              <Button
                className={`${styles.fontStyle} ${styles.outlineButtonStyle}`}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className={`${styles.fontStyle} ${styles.buttonStyle}`}
                color="primary"
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      {isDelete && (
        <DialogComponent
          title="Document types"
          onClose={() => {
            toggleIsDelete(false);
            setDeleteId('');
          }}
        >
          <Grid item={true} xs={12}>
            <Grid item={true} xs={12} container={true} className={styles.message}>
              Are you sure you want to delete this document type?
            </Grid>
            <Grid
              item={true}
              xs={12}
              container={true}
              className={styles.buttonContainer}
              justify="flex-end"
            >
              <>
                <Button
                  onClick={() => {
                    toggleIsDelete(false);
                    setDeleteId('');
                  }}
                >
                  No
                </Button>
                <Button
                  color="primary"
                  className={styles.btnSpacing}
                  variant="contained"
                  onClick={() => {
                    handleDeleteOld(deleteId);
                  }}
                >
                  Yes
                </Button>
              </>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
      {openDialog && (
        <DialogComponent
          title="Add Document Type"
          customWidth="600px"
          closeButton={false}
          onClose={() => setOpenDialogstatus(false)}
          disableFocus={true}
        >
          <AddDocConfig
            selectedResource={currentResource}
            resourceTypes={resourceTypes}
            uploadDoc={uploadDoc}
            config={config}
            onSubmit={handleSubmit}
            handleUpdateType={handleUpdateType}
            handleCancel={() => {
              setOpenDialogstatus(false);
            }}
          />
        </DialogComponent>
      )}
      {openDocDialog && (
        <DialogComponent
          title="Upload Templates"
          customWidth="600px"
          closeButton={false}
          tag={tag}
          onClose={() => setOpenDocDialog(false)}
        >
          <UploadDoc
            uploadDoc={uploadDoc}
            handleCancel={
              () => {
                getDocuments(uploadDoc);
                setOpenDocDialog(false);
              }
            }
          />
        </DialogComponent>
      )}
      {openEditDialog && (
        <DialogComponent
          closeButton={false}
          title="Edit Document Type"
          customWidth="800px"
          onClose={() => setOpenEditDialogstatus(false)}
          disableFocus={true}
        >
          <EditDocType
            onSubmit={handleEditSubmit}
            resourceTypes={resourceTypes}
            selectedResource={currentResource}
            docTypeData={docTypeData}
            handleCancel={() => {
              setOpenEditDialogstatus(false);
            }}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default React.memo(DocCategory);
