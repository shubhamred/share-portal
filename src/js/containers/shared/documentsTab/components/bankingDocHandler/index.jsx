import React, { useEffect, useState } from 'react';
import { Grid, Divider } from '@material-ui/core';
import { getAccounts } from 'app/containers/brands/saga';
import { SingleDocument, FileUploader } from 'app/components';
import { getDocs, getPatronDocPresignedUrl, removeFile } from 'app/containers/patrons/saga';
import { saveFile, getBanks } from 'app/containers/applications/saga';
import { getVerifiedImage } from 'app/utils/utils';
import { isArray } from 'lodash';

const titleStyle = {
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center'
};

const BankingDocuments = (props) => {
  const { application, config } = props;

  const [bankAcc, setBankAcc] = useState([]);
  const [bankStatements, setStatements] = useState({});
  const [bankNames, setBankNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getAccounts(application.companyCode).then((res) => {
      if (res.data && res.data.length) {
        // console.log(res.data);
        setBankAcc(res.data);
        const bankIdArr = res.data.map((acc) => acc.bankId);
        getBanksNames([...new Set(bankIdArr)]);

        const tempArr = res.data.map((acc) => getDocs(acc.id, 'BANK_ACCOUNT'));
        Promise.all(tempArr).then((values) => {
          const tempArrayOfStatements = [];
          // eslint-disable-next-line consistent-return
          values.forEach((statements) => {
            if (statements.data) {
              const temp = statements.data.filter(
                (doc) => doc.docType === 'BANK_STATEMENT'
              );
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
          setStatements(finalStatements);
        });
      }
    });
  };

  const getBanksNames = (bankIdArr) => {
    const params = {
      where: {
        id: {
          in: bankIdArr
        }
      }
    };
    getBanks(params).then((res) => {
      if (res.data) {
        setBankNames(res.data);
      }
    });
  };

  const getBankName = (bankId) => {
    const name = bankNames.find((bank) => bank.id === bankId);
    return name?.name || 'N/A';
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
    getDocs(id, 'BANK_ACCOUNT').then((res) => {
      if (res.data) {
        const temp = res.data.filter(
          (doc) => doc.docType === 'BANK_STATEMENT'
        );
        if (temp.length) {
          const docs = temp.map((acc) => acc.files).flat(Infinity);
          setStatements((prevState) => ({ ...prevState, [id]: docs }));
        }
      }
    });
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
        {bankAcc.length ? (
          <Grid container={true}>
            {bankAcc.map((acc) => (
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
                      {getBankName(acc.bankId)}
                      {' '}
                      -
                      {acc.accountType}
                      {getVerifiedImage(acc, 'isAccountVerified') }
                      :
                    </p>
                  </Grid>
                  <Grid item={true}>
                    <FileUploader
                      getPreSignedUrl={getPatronDocPresignedUrl}
                      uploadedDocumentCount={bankStatements[acc.id] ? bankStatements[acc.id].length : null}
                      resourceType="BANK_ACCOUNT"
                      docCategory={config.key}
                      resourceId={acc.id}
                      minNumberOfFiles={1}
                      docType={config.configuredDocTypes[0].documentType}
                      handleSaveMetaData={saveMetaData}
                    />
                  </Grid>
                </Grid>
                {
                  acc.isAccountVerified && !bankStatements[acc.id] ? (
                    <p style={{ color: '#7a7c75' }}> Bank Statements not found. Bank has been authorised from Finbit. </p>
                  ) : (
                    <>
                      {bankStatements[acc.id] ? (
                        bankStatements[acc.id].map((file) => (
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
                        <p style={{ color: '#7a7c75' }}>No Statements Available</p>
                      )}
                    </>
                  )
                }

                <Grid item={true} xs={12}>
                  <Divider width="100%" />
                </Grid>
              </Grid>
            ))}
            <Divider width="100%" />
          </Grid>
        ) : (
          <p>No Bank Accounts Available</p>
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(BankingDocuments);
