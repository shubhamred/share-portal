import React, { useState } from 'react';
import { Grid, FormControlLabel, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { updateApplication } from 'app/containers/brands/saga';
import { Switch } from 'app/components';
import styles from '../../styles.scss';

const ApplicationList = (props) => {
  const { accountNumber, dialogueOpen, brandCode, vendor, fetchData, getApplicationList, handleLinkApplication, applications } = props;
  const [isHidden, setIsHidden] = useState(true);

  const toggleHandler = (data = {}) => {
    const payload = {
      ...data,
      isActive: data?.isActive === 1 ? 0 : 1
    };
    updateApplication(brandCode, vendor, data?.applicationCode, payload).then(() => {
      fetchData();
      getApplicationList();
    });
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        {applications?.length > 0 && !isHidden && applications.map((application) => (
          <Grid item={true} xs={12}>
            <Grid
              container={true}
              className={styles.labelContainer}
              alignItems="flex-start"
              justify="space-between"
            >
              <Grid item={true} xs={3}>
                Application
              </Grid>
              <Grid item={true} xs={3}>
                Revenue Sources
              </Grid>
              <Grid item={true} xs={3}>
                Split percentage
              </Grid>
              <Grid item={true} xs={2}>
                Status
              </Grid>
              <Grid item={true} xs={1} className={styles.editAccount} onClick={() => dialogueOpen(application)}>
                EDIT
              </Grid>
            </Grid>
            <Grid
              container={true}
              className={styles.headerHeading2}
              justify="space-between"
            >
              <Grid item={true} xs={3} className={styles.applicationCode}>
                {application.applicationCode}
              </Grid>
              <Grid item={true} xs={3} className={styles.revenueSources}>
                <Grid container={true} item={true} xs={12} spacing={2}>
                  {application.revenueSource?.length && application.revenueSource.map((source) => (
                    <Grid item={true} xs={4} xl={3} className={styles.revenueSourceContainer}>
                      <div className={styles.revenueSource}>{source}</div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item={true} xs={3}>
                {`${application.split}%`}
              </Grid>
              <Grid item={true} xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      disabled={true}
                      onChange={() => toggleHandler(application)}
                      checked={application.isActive}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
        {((applications?.length > 0 && !isHidden) || (applications?.length === 0)) && (
          <Grid item={true} xs={12} container={true} justify="space-between">
            <Grid item={true} style={{ marginLeft: '0px' }}>
              <Button
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => handleLinkApplication(accountNumber)}
              >
                Link Application
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      {applications?.length > 0 && (
        <Button
          onClick={() => setIsHidden(!isHidden)}
          style={{ color: '#5064E2', fontWeight: 600, paddingLeft: 0 }}
        >
          {isHidden ? (
            <Grid className={styles.seeMoreButton}>
              <KeyboardArrowDownIcon />
              See More
            </Grid>
          ) : (
            <Grid className={styles.seeMoreButton}>
              <KeyboardArrowUpIcon />
              See Less
            </Grid>
          )}
        </Button>
      )}
    </Grid>
  );
};

export default ApplicationList;
