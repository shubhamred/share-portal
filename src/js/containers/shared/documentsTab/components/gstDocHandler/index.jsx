import React, { useEffect, useState } from 'react';
import { Grid, Divider } from '@material-ui/core';
import { getCompanyGstDetails } from 'app/containers/brands/saga';
import { SingleDocument, FileUploader } from 'app/components';
import { getDocs, getPatronDocPresignedUrl, removeFile } from 'app/containers/patrons/saga';
import { saveFile } from 'app/containers/applications/saga';
import { getVerifiedImage } from 'app/utils/utils';
import { isArray } from 'lodash';
import { getStateName } from '../../../../brands/brandDetail/sections/gst/sections/addGst/gstStatesList';

const titleStyle = {
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center'
};

const GstDocuments = (props) => {
  const { application, config } = props;

  const [gstAcc, setGstAcc] = useState([]);
  const [gstFiles, setGstFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const query = {
    where: {
      resourceCode: ''
    },
    take: 50
  };

  const fetchData = () => {
    query.where.resourceCode = application.companyCode;
    getCompanyGstDetails(query).then((res) => {
      if (res.data) {
        // console.log(res);
        setGstAcc(res.data);
        const tempArr = res.data.map((acc) => getDocs(acc.id, 'GST'));
        Promise.all(tempArr).then((values) => {
          const tempArrayOfStatements = [];
          // eslint-disable-next-line consistent-return
          values.forEach((statements) => {
            if (statements.data) {
              const temp = statements.data.filter((doc) => doc.docType === 'GST');
              // console.log(temp);
              if (temp.length) {
                const docs = temp.map((a) => a.files).flat(Infinity);
                // console.log(docs);
                const tempObj = { ...temp[0], files: docs };
                tempArrayOfStatements.push(tempObj);
                return tempObj;
              }
            }
          });
          const finalStatements = tempArrayOfStatements.reduce(
            (obj, item) => ({ ...obj, [item.resourceId]: item.files }),
            {}
          );
          setGstFiles(finalStatements);
        });
      }
    });
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
    if (isArray(resourceId)) {
      const [temp] = resourceId;
      saveFile(resourceId).then((res) => {
        if (res.data) {
          getDocsById(temp.resourceId);
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
        getDocsById(resourceId);
      }
    });
  };

  const getDocsById = (id) => {
    getDocs(id, 'GST').then((res) => {
      if (res.data) {
        const temp = res.data.filter((doc) => doc.docType === 'GST');
        if (temp.length) {
          const docs = temp.map((acc) => acc.files).flat(Infinity);
          setGstFiles((prevState) => ({ ...prevState, [id]: docs }));
        }
      }
    });
  };

  const getGSTDocType = () => {
    const { configuredDocTypes } = config || {};
    const gstDocType = configuredDocTypes?.find((doc) => doc.documentType.key === 'GST');
    if (gstDocType) return gstDocType.documentType;
    return '';
  };

  const handleFileDelete = (fileId, accId) => {
    removeFile(fileId).then((res) => {
      if (res.data) {
        getDocsById(accId);
      }
    });
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        {gstAcc.length ? (
          <Grid container={true}>
            {gstAcc.map((acc) => (
              <Grid item={true} xs={12} key={acc.id} container={true}>
                <Grid
                  item={true}
                  xs={12}
                  container={true}
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item={true}>
                    <p style={titleStyle}>
                      {getStateName(acc.stateCode)}
                      {' - '}
                      {' '}
                      {acc.gstin}
                      {getVerifiedImage(acc, 'isVerified')}
                      :
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <FileUploader
                      getPreSignedUrl={getPatronDocPresignedUrl}
                      uploadedDocumentCount={gstFiles[acc.id] ? gstFiles[acc.id].length : null}
                      resourceType="GST"
                      docCategory={config.key}
                      resourceId={acc.id}
                      minNumberOfFiles={1}
                      docType={getGSTDocType() || config.configuredDocTypes[0].documentType}
                      handleSaveMetaData={saveMetaData}
                    />
                  </Grid>
                </Grid>
                {acc.isVerified && !gstFiles[acc.id] ? (
                  <p style={{ color: '#7a7c75' }}>
                    GST documents not found. GSTIN has been authorised from
                    Perfios.
                    {' '}
                  </p>
                ) : (
                  <>
                    {gstFiles[acc.id] ? (
                      gstFiles[acc.id].map((file) => (
                        <Grid
                          item={true}
                          xs={4}
                          key={file.id}
                          style={{ marginBottom: '15px' }}
                        >
                          <SingleDocument
                            id={file.id}
                            name={file.fileName}
                            onDeleteClick={file?.status === 'Verified' ? false : (fileId) => handleFileDelete(fileId, acc.id)}
                          />
                        </Grid>
                      ))
                    ) : (
                      <p style={{ color: '#7a7c75' }}>No GST files Available</p>
                    )}
                  </>
                )}

                <Grid item={true} xs={12}>
                  <Divider width="100%" />
                </Grid>
              </Grid>
            ))}
            <Divider width="100%" />
          </Grid>
        ) : (
          <p>No GST Accounts Available</p>
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(GstDocuments);
