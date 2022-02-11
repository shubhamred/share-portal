import React, { useContext, useState, useEffect } from 'react';
import { Grid, Divider } from '@material-ui/core';
import { Context } from 'app/utils/utils';
import { SingleDocument, FileUploader } from 'app/components';
import { getPatronDocPresignedUrl } from 'app/containers/patrons/saga';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import { saveFile } from 'app/containers/applications/saga';
import styles from '../../styles.scss';

const BrandDocumentsHandler = (props) => {
  const { config, getDocs } = props;
  const { companyId, documents } = useContext(Context);
  const [configuredDocTypes, setConfiguredDocTypes] = useState([]);
  useEffect(() => {
    if (config) {
      getConfiguredDocumentTypes('BRAND', config.documentCategoryId).then((res) => {
        if (res?.data?.length) {
          setConfiguredDocTypes(res.data.filter((list) => list.isArchived === false));
        }
      });
    }
  }, [config]);

  const getDocsByCategory = (doctype) => {
    if (!documents || !documents.length) return [];
    const { documentCategory } = config;
    const docs = documents.filter((doc) => doc.docCategory === documentCategory.key);
    const files = docs.find((doc) => doc.docType === doctype);
    return files?.files || [];
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
        getDocs();
      }
    });
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        {configuredDocTypes && configuredDocTypes.length ? (
          configuredDocTypes.map((type) => (
            <Grid container={true} key={type.id}>
              <Grid item={true} xs={12}>
                <Grid
                  container={true}
                  item={true}
                  xs={12}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item={true}>
                    <p>
                      {type?.documentType?.name}
                      :
                    </p>
                  </Grid>
                  <Grid item={true}>
                    {type.documentType?.maximumFiles !== null
                    && getDocsByCategory(type.documentType.key).length
                      < type.documentType?.maximumFiles ? (
                        <FileUploader
                          getPreSignedUrl={getPatronDocPresignedUrl}
                          uploadedDocumentCount={null}
                          resourceType="BRAND"
                          docCategory={config.documentCategory.key}
                          resourceId={companyId}
                          minNumberOfFiles={1}
                          docType={type.documentType}
                          handleSaveMetaData={saveMetaData}
                        />
                    ) : null}
                  </Grid>
                </Grid>
                <Grid container={true} alignItems="center">
                  {getDocsByCategory(type.documentType.key).length ? (
                    getDocsByCategory(type.documentType.key).map((file) => (
                      <Grid item={true} xs={4} key={file.id} className={styles.mb10}>
                        <SingleDocument name={file.fileName} id={file.id} />
                      </Grid>
                    ))
                  ) : (
                    <p>No Files available</p>
                  )}
                </Grid>
              </Grid>
              <Divider width="100%" />
            </Grid>
          ))
        ) : (
          <p>No Document Config Found</p>
        )}
      </Grid>
    </Grid>
  );
};
export default BrandDocumentsHandler;
