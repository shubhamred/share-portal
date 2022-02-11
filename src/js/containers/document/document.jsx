/* eslint-disable no-unused-expressions */
import React from 'react';
// import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
// import { Input, Button, DropDown } from 'app/components';

import styles from './styles.scss';
import DocumentElement from './documentElement';
import { sortArrayWithKey } from '../../utils/utils';

const DocumentList = (props) => {
  const { dataConfig, dataDocs, applicationId, getPreSignedUrl, saveMetaData, metaData, fullDocList, status,
    postMetaData, viewImage, updateDocumentStatus, removeFile, resourceId, resourceType, cancelMetaData } = props;

  const configList = dataConfig && dataConfig.filter((config) => dataDocs
    .some((doc) => doc.docCategory === config.key));
  let configData = configList;

  if (status === 'Pending') {
    const docsNotUploaded = dataConfig && dataConfig.filter((config) => fullDocList && !fullDocList
      .some((doc) => doc.docCategory === config.key && config.noOfDocTypesRequired < 2));
    const pendingConfig = docsNotUploaded && docsNotUploaded.filter((config) => configList && !configList
      .some((configuration) => configuration.key === config.key));
    configData = configList && configList.concat(pendingConfig);
  }
  const sortedConfigData = sortArrayWithKey(configData, 'displayOrder');
  // console.log({ sortedConfigData, configList, dataConfig, dataDocs });
  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      {sortedConfigData && sortedConfigData.map((config) => (
        <DocumentElement
          key={config.id}
          getPreSignedUrl={getPreSignedUrl}
          applicationId={applicationId}
          saveMetaData={saveMetaData}
          postMetaData={postMetaData}
          resourceId={resourceId}
          resourceType={resourceType}
          metaData={metaData}
          statusFilter={status}
          cancelMetaData={cancelMetaData}
          docCategory={config.key}
          categoryId={config.id}
          docCategoryLabel={config.name}
          isMandatory={config.isMandatory}
          noOfDocTypesRequired={config.noOfDocTypesRequired}
          docTypes={config.configuredDocTypes}
          fullDocList={fullDocList}
          uploadedDocs={dataDocs}
          viewImage={viewImage}
          updateDocumentStatus={updateDocumentStatus}
          removeFile={removeFile}
        />))}
    </Grid>
  );
};

DocumentList.propTypes = {
};

DocumentList.defaultProps = {
};

export default DocumentList;
