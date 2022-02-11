import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { ControlledAccordion } from 'app/components';
import PartnersAccount from './partnersAccount/partnersAccount';
import styles from '../../styles.scss';

function List(props) {
  const { list, brandCode, brandId, fetchData } = props;
  const { vendor } = list;
  const [expanded, setExpanded] = useState(false);

  const handleAccChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCancel = () => {
    setExpanded(false);
  };

  const getAccountId = (data = {}) => (vendor === 'kotak' ? data.accountNumber : data.appId);

  const rowHtml = (data) => (
    <Grid container={true}>
      <Grid item={true} xs={12} className={styles.mb10}>
        <Grid
          container={true}
          alignItems="flex-start"
          justify="space-between"
          className={styles.headerMainPartners}
        >
          <Grid item={true} xs={3}>
            <img src={data.img} alt={data.alt} />
          </Grid>
          <Grid item={true} xs={3}>
            <Grid className={styles.headerValue2}>{vendor === 'kotak' ? 'Kotak V Account Number' : 'App Id'}</Grid>
            <Grid className={styles.headerHeading2}>
              <Typography noWrap={true}>{getAccountId(data) || '-'}</Typography>
            </Grid>
          </Grid>
          <Grid item={true} xs={3}>
            <Grid className={styles.headerValue2}>Total Split %</Grid>
            <Grid className={styles.headerHeading2}>
              {data.overallSplitPercentage}
            </Grid>
          </Grid>
          <Grid item={true} xs={3}>
            <Grid className={styles.headerValue2}># Active accounts</Grid>
            <Grid className={styles.headerHeading2}>{data.activeAccounts}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <ControlledAccordion
      key={`list-of-${list?.appId || list?.accountNumber}=${list.vendor}`}
      fullWidth={true}
      heading={rowHtml(list)}
      expanded={expanded}
      id={list?.id}
      handleChange={handleAccChange}
      unmountOnExit={true}
    >
      <Grid container={true} item={true} xs={12}>
        <PartnersAccount
          brandId={brandId}
          brandCode={brandCode}
          vendor={list.vendor}
          handleCancel={handleCancel}
          fetchData={fetchData}
          list={list}
        />
      </Grid>
    </ControlledAccordion>
  );
}

export default List;
