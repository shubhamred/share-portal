import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Button } from 'app/components';

import styles from './styles.scss';
import DealHeaderForm from '../dealHeaderForm';

const DealHeader = (props) => {
  const { onButtonClick, brandName, onChangeStatusButtonClick, dealStatus, saveDealProperty } = props;

  // const tabs = ['Activity', 'Save', 'Preview', 'Status', 'Publish'];
  // const applicationId = 'A1234';
  // const brandName = 'Brand Name';
  const statusLabel = (
    <div className={styles.statusWrapper}>
      <div>Status:&nbsp;</div>
      <div className={styles.currentStatus}>{dealStatus}</div>
      <img className={styles.editIcon} src="assets/editWhite.svg" alt="alt" />
    </div>
  );

  const onSubmit = (values) => {
    saveDealProperty(values);
  };

  return (
    <Grid container={true} direction="row" style={{ paddingTop: '42px' }}>
      <Grid className={styles.wrapper} container={true} xs={12} justify="space-between">
        <Grid item={true} className={styles.header}>
          {brandName}
        </Grid>
        <Grid xs={12} md={12} sm={12} lg={7} justify="flex-end" className={styles.tabs}>
          <Grid style={{ padding: '0 10px' }}>
            <Button
              label="Save"
              onClick={() => onButtonClick('Save')}
            // style={{ backgroundColor: selectedButton === buttonName && '#8F8F8F' }}
            />
          </Grid>
          <Grid style={{ padding: '0 10px' }}>
            <Button
              label={statusLabel}
              onClick={() => onChangeStatusButtonClick()}
              style={{ minWidth: '200px' }}
            // style={{ backgroundColor: selectedButton === buttonName && '#8F8F8F' }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container={true} xs={12} sm={12} justify="flex-start" flex-direction="row" style={{ padding: '3% 0' }}>
        <DealHeaderForm onSubmit={(values) => onSubmit(values)} brandName={brandName} />
      </Grid>
    </Grid>
  );
};

DealHeader.propTypes = {
  dealStatus: PropTypes.string.isRequired,
  brandName: PropTypes.string,
  onButtonClick: PropTypes.func,
  onChangeStatusButtonClick: PropTypes.func,
  saveDealProperty: PropTypes.func
};

DealHeader.defaultProps = {
  brandName: '',
  onButtonClick: () => { },
  onChangeStatusButtonClick: () => { },
  saveDealProperty: () => { }
};

export default DealHeader;
