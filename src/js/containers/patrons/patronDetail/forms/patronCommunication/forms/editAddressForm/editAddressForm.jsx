import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import capitalize from 'lodash/capitalize';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button, Input, DropDown, TextArea, DialogComponent } from 'app/components';
import stateList from 'app/constants/stateList';
import styles from './styles.scss';

const EditAddressForm = (props) => {
  const { handleSubmit, addressTypelist, onSubmit, ownershipList, initialize, initialValues, resourceId, resource, communicationDetailsUpdate } = props;
  const [disabled, setDisabled] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const { state } = initialValues;
  initialValues.state = state && state.split(' ').length === 1 ? capitalize(state) : state;
  const handleSaveClick = (values) => {
    if (values) {
      onSubmit({ ...values, premiseOwnership: values.premiseOwnership.split(' ').join('_'), id: initialValues.id, resourceId, resource });
      setDisabled(!disabled);
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 1000);
    }
  };
  return (
    <Grid container={true}>
      <form onSubmit={handleSubmit(handleSaveClick)} className={styles.editForm}>
        <Grid container={true} xs={12} direction="row" className={styles.addressGroup}>
          <Grid item={true} xs={4}>
            <Field
              name="addressType"
              options={addressTypelist}
              component={DropDown}
              label="Type of Address"
              type="dropdown"
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Field
              name="pincode"
              component={Input}
              label="Pincode"
              type="number"
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Field
              name="city"
              component={Input}
              label="City"
              type="text"
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12} className={styles.addressGroup} alignItems="center">
          <Grid item={true} xs={4}>
            <Field
              name="state"
              placeholder="Select State"
              component={DropDown}
              options={stateList}
              selectedOption={capitalize(selectedState)}
              label="State"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedState(val);
              }}
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Field
              name="country"
              component={Input}
              label="Country"
              type="text"
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Field
              name="premiseOwnership"
              options={ownershipList}
              component={DropDown}
              label="Ownership"
              type="dropdown"
              placeholder="Select OwnerShip"
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12} className={styles.addressGroup} direction="row">
          <Grid item={true} xs={6}>
            <Field
              component={TextArea}
              type="textarea"
              name="line1"
              label="Address line 1"
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <Field
              component={TextArea}
              type="textarea"
              name="line2"
              label="Address line 2"
              disabled={disabled}
            />
          </Grid>
        </Grid>
        <Grid className={styles.addressGroup}>
          <Grid container={true} xs={6} direction="row" justify="space-between">
            {!disabled && (
              <Grid container={true} direction="row">
                <Grid item={true}>
                  <Button type={disabled ? 'button' : 'submit'} label="Save" style={{ backgroundColor: '#4754D6', minWidth: 97, marginRight: 8 }} />
                </Grid>
                <Grid item={true}>
                  <Button
                    onClick={() => {
                      initialize(initialValues);
                      setDisabled(true);
                    }}
                    label="Discard"
                    style={{ backgroundColor: '#fff', color: '#4754D6', minWidth: 97, border: '1px solid #4754D6' }}
                  />
                </Grid>
              </Grid>
            )}
            {disabled && (
              <Grid item={true}>
                <Button onClick={() => setDisabled(false)} label="Edit" style={{ backgroundColor: '#fff', color: '#4754D6', minWidth: 97, border: '1px solid #4754D6' }} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </form>
      {communicationDetailsUpdate && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {communicationDetailsUpdate === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {communicationDetailsUpdate === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Save failed</div>
                <div className={styles.messageIcon}><ErrorIcon style={{ fill: 'red' }} /></div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

EditAddressForm.propTypes = {
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})),
  addressTypelist: PropTypes.arrayOf(PropTypes.shape([])),
  ownershipList: PropTypes.arrayOf(PropTypes.shape([]))
};

EditAddressForm.defaultProps = {
  initialize: () => { },
  handleSubmit: () => { },
  onSubmit: () => { },
  initialValues: {},
  addressTypelist: [],
  ownershipList: []
};

export default EditAddressForm;
