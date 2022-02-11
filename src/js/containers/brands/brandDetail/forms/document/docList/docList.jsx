import React, { useState } from 'react';
// import { Grid, ButtonBase } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { TabMenu } from 'app/constants/tabMenus';
import { TabSelector } from '../../../../../../components';
import DocList from '../../../../../patrons/patronDetail/forms/documents/docList';
// import styles from './styles.scss';

const Documents = (props) => {
  const { resourceId, resourceType } = props;
  const [selectedTab, setSelectedTab] = useState('Pending');
  const onChangeTab = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <div>
      <TabSelector
        menuItems={TabMenu.documents}
        onChangeTab={onChangeTab}
        selectedTab={selectedTab}
      />
      {selectedTab === 'Verified'
        && (
          <Grid>
            <DocList
              status="Verified"
              resourceId={resourceId}
              resourceType={resourceType}
            />
          </Grid>
        )}
      {selectedTab === 'Pending'
        && (
          <Grid>
            <DocList
              status="Pending"
              resourceId={resourceId}
              resourceType={resourceType}
            />
          </Grid>
        )}
      {selectedTab === 'Received'
        && (
          <Grid>
            <DocList
              status="Received"
              resourceId={resourceId}
              resourceType={resourceType}
            />
          </Grid>
        )}
    </div>
  );
};

export default Documents;
