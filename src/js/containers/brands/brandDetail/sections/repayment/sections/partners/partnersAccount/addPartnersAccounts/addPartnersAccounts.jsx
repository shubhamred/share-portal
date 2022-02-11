import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControlLabel, Grid } from '@material-ui/core';
import { Button, Input, Switch } from 'app/components';
import styles from './styles.scss';

const AddPartnersAccounts = (props) => {
  const { handleSubmit, onSubmit, onClose, vendor, accountId, change } = props;
  const [selectedDealType, setSelectedDealType] = useState(false);
  const isKotak = vendor === 'kotak' && accountId;

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      isActive: selectedDealType ? 1 : 0
    });
  };

  useEffect(() => {
    if (isKotak) {
      change('vendor', vendor);
    }
  }, [vendor, accountId]);

  return (
    <Grid className={styles.inviteForm} container={true}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid
          className={styles.formLabelStyle}
          container={true}
          justify="space-between"
        >
          <Grid className={styles.childDivWidth} item={true} xs={12}>
            <Field
              name="accountId"
              component={Input}
              label={isKotak ? 'Beneficiery Account Number' : 'Account Id'}
              type="text"
            />
          </Grid>
        </Grid>
        {isKotak && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field
                name="name"
                component={Input}
                label="Beneficiery name"
                type="text"
              />
            </Grid>
          </Grid>
        )}
        {isKotak && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field
                name="email"
                component={Input}
                label="Beneficiery Email"
                type="text"
              />
            </Grid>
          </Grid>
        )}
        {isKotak && (
          <Grid
            className={styles.formLabelStyle}
            container={true}
            justify="space-between"
          >
            <Grid className={styles.childDivWidth} item={true} xs={12}>
              <Field name="ifsc" component={Input} label="IFSC" type="text" />
            </Grid>
          </Grid>
        )}
        <Grid
          className={styles.formLabelStyle}
          container={true}
          justify="space-between"
        >
          <div className={styles.label}>Status</div>
          <FormControlLabel
            control={
              <Switch
                checked={selectedDealType}
                onChange={({ target }) => {
                  setSelectedDealType(target.checked);
                }}
              />
            }
          />
        </Grid>
        <Grid
          container={true}
          className={styles.buttonStyle}
          alignItems="center"
        >
          <Grid
            onClick={() => onClose()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            <Grid style={{ padding: '4px', color: '#1518AF' }}>Cancel</Grid>
          </Grid>
          <Button type="submit" label="Add Partner Account" />
        </Grid>
      </form>
    </Grid>
  );
};

AddPartnersAccounts.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func
};

AddPartnersAccounts.defaultProps = {
  onSubmit: () => {},
  handleSubmit: () => {}
};

export default AddPartnersAccounts;
