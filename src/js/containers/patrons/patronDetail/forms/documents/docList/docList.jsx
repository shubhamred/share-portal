import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import DocumentList from '../../../../../document';
import { filterDocumentBasedOnStatus } from '../../../../../../utils/utils';

const DocList = (props) => {
  // console.log(props);
  const { metaData, resourceType, resourceId, status,
    getPatronDocPresignedUrl, saveMetaData, cancelMetaData,
    getConfig, getDocs, docConfig, postMetaData, dataDocs, viewImage, updateDocumentStatus, removeFile } = props;
  // const paramValues = getParameterValuesFromHash('/patrons/lead/:patronId');
  // const { patronId } = paramValues;
  let showDocList = false;
  if (status === 'Pending' || (dataDocs && dataDocs.length !== 0)) {
    showDocList = true;
  }

  useEffect(() => {
    if (getDocs && resourceId) {
      getDocs(resourceId, resourceType);
    }
    if (getConfig && resourceType) getConfig(resourceType);
  }, [resourceId]);
  const docList = dataDocs && dataDocs.length !== 0 ? filterDocumentBasedOnStatus(dataDocs, status) : [];

  return (
    <Grid style={{ width: '100%' }} justify="center">
      {showDocList && (<DocumentList
        resourceType={resourceType}
        resourceId={resourceId}
        postMetaData={postMetaData}
        saveMetaData={saveMetaData}
        dataConfig={docConfig}
        status={status}
        cancelMetaData={cancelMetaData}
        fullDocList={dataDocs}
        dataDocs={docList}
        metaData={metaData}
        getConfig={getConfig}
        getDocs={getDocs}
        getPreSignedUrl={getPatronDocPresignedUrl}
        viewImage={viewImage}
        updateDocumentStatus={updateDocumentStatus}
        removeFile={removeFile}
      />)}
    </Grid>
  );
};

DocList.propTypes = {
  businessInformation: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string
  }),
  applicantInformation: PropTypes.shape({
    id: PropTypes.string
  }),
  entityInformation: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  docConfig: PropTypes.shape({})
};

DocList.defaultProps = {
  businessInformation: {
    id: '',
    status: ''
  },
  applicantInformation: {
    id: ''
  },
  entityInformation: {
    id: '',
    name: ''
  },
  docConfig: null
};

export default DocList;
