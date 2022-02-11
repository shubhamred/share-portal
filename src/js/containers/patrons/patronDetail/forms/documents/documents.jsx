import React, { useEffect, useState } from 'react';
import DocumentsTab from 'app/containers/shared/documentsTab';
import { updateDocumentStatus } from 'app/containers/patrons/saga';
// import { Grid, ButtonBase } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

// import styles from './styles.scss';

const Documents = (props) => {
  const { patronDetail, getConfig, getDocs, setBreadcrumbsData, position } = props;
  const [docCat, setDocCat] = useState([]);
  const [cusDoc, setCusDoc] = useState([]);

  const fetchData = () => {
    getConfig('CUSTOMER').then((res) => {
      if (res.data && res.data.length) {
        setDocCat(res.data);
      }
    });
    if (patronDetail?.id) {
      getDocs(patronDetail.id, 'CUSTOMER').then((res) => {
        if (res.data) {
          setCusDoc(res.data);
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [patronDetail]);

  const updateStatus = (id, status) => {
    updateDocumentStatus(id, status).then((res) => {
      if (res.data) {
        getDocs(patronDetail.id, 'CUSTOMER').then((docs) => {
          if (docs.data) {
            setCusDoc(docs.data);
          }
        });
      }
    });
  };

  return (
    <div>
      <DocumentsTab resourceCode="CUSTOMER" docCat={docCat} cusDoc={cusDoc} showStatus={true} updateStatus={updateStatus} setBreadcrumbsData={setBreadcrumbsData} position={position} />
    </div>
  );
};

export default Documents;
