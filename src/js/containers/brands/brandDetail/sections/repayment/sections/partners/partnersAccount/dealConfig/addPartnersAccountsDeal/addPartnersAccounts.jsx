import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { FormControlLabel, Grid } from '@material-ui/core';
import { Button, AutocompleteCustom, NumberField, Switch } from 'app/components';
import { getDealLeadPool } from 'app/containers/deals/saga';
import styles from './styles.scss';

const AddPartnersAccounts = (props) => {
  const { handleSubmit, onSubmit, onClose, brandId } = props;
  const [selectedDealType, setSelectedDealType] = useState(false);
  const [dealList, setDealList] = useState([]);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      split: +values.split,
      isActive: selectedDealType ? 1 : 0
    });
  };

  const handleAutocomplete = (value) => {
    getDealLeadPool(25, 1, null, null, brandId, value).then((res) => {
      if (res?.data) {
        setDealList(res.data);
      }
    });
  };

  useEffect(() => {
    if (brandId) {
      handleAutocomplete('');
    }
  }, []);

  return (
    <Grid className={styles.inviteForm} container={true}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid className={styles.formLabelStyle} container={true} justify="space-between">
          <Grid className={styles.childDivWidth} item={true} xs={12}>
            <Field
              name="deal"
              options={dealList}
              component={AutocompleteCustom}
              debouncedInputChange={handleAutocomplete}
              label="Deal Name"
              selector="name"
              type="dropdown"
              required={true}
              isArray={false}
            />
          </Grid>
        </Grid>
        <Grid className={styles.formLabelStyle} container={true} justify="space-between">
          <Grid className={styles.childDivWidth} item={true} xs={12}>
            <Field name="split" component={NumberField} label="Split %" type="text" />
          </Grid>
        </Grid>
        <Grid className={styles.formLabelStyle} container={true} justify="space-between">
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
        <Grid container={true} className={styles.buttonStyle} alignItems="center">
          <Grid onClick={onClose} className={styles.cancelButtonDiv}>
            <Grid className={styles.cancelButtonStyle}>Cancel</Grid>
          </Grid>
          <Button type="submit" label="Add Deal Config" />
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
