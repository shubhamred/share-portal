import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Input, DropDown, TextArea } from 'app/components';
import stateList from 'app/constants/stateList';
import styles from './styles.scss';

const AddAddressForm = (props) => {
  const {
    formTitle,
    handleSubmit,
    handleCancel,
    addressTypelist,
    onSubmit,
    ownershipList
  } = props;
  const [selectedType, setSelectedType] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isPermanentType, setPermanentType] = useState(false);
  const [isCorrespondenceSelected, toggleIsCorresponded] = useState(false);

  const handleTypeChange = (val) => {
    if (val === 'Permanent') {
      setPermanentType(true);
    } else {
      setPermanentType(false);
      toggleIsCorresponded(false);
    }
  };

  const handleFormSubmit = (values) => {
    if (isPermanentType && isCorrespondenceSelected) {
      const data = {
        ...values,
        addressType: 'Permanent & Correspondence'
      };
      onSubmit(data);
    } else {
      onSubmit(values);
    }
  };

  return (
    <Grid container={true} className={styles.container}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid item={true} xs={12} className={styles.headerStyle}>
          {formTitle}
        </Grid>
        <Grid container={true} xs={12} direction="row">
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field
              name="addressType"
              options={addressTypelist}
              selectedOption={selectedType}
              component={DropDown}
              label="Type"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedType(val);
                handleTypeChange(val);
              }}
              placeholder="Select address type"
            />
          </Grid>
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field
              name="pincode"
              component={Input}
              label="Pincode"
              type="number"
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12}>
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field name="city" component={Input} label="City" type="text" />
          </Grid>
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field
              name="state"
              component={DropDown}
              options={stateList}
              selectedOption={selectedState}
              label="State"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedState(val);
              }}
              placeholder="Select state"
            />
          </Grid>
        </Grid>
        <Grid container={true} className={styles.formLabelStyle}>
          <Grid item={true} className={styles.formLabelStyle} xs={6}>
            <Field
              name="country"
              component={Input}
              label="Country"
              type="text"
            />
          </Grid>
          <Grid item={true} className={styles.formLabelStyle} xs={6}>
            <Field
              name="premiseOwnership"
              options={ownershipList}
              selectedOption={selectedOwnership}
              component={DropDown}
              label="Ownership"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedOwnership(val);
              }}
              placeholder="Select ownership"
            />
          </Grid>
        </Grid>
        <Grid item={true} className={styles.formLabelStyle}>
          <Field
            component={TextArea}
            type="textarea"
            name="line1"
            label="Address line 1"
          />
        </Grid>
        <Grid item={true} className={styles.formLabelStyle}>
          <Field
            component={TextArea}
            type="textarea"
            name="line2"
            label="Address line 2"
          />
        </Grid>
        {isPermanentType && (
          <Grid container={true} xs={12}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCorrespondenceSelected}
                    onChange={({ target }) => toggleIsCorresponded(target.checked)}
                  />
                }
                label="Is Correspondence Address same as Permanent Address ?"
              />
            </Grid>
          </Grid>
        )}

        <Grid container={true} xs={12} className={styles.formLabelStyle}>
          <Grid item={true} xs={6}>
            <Button
              onClick={handleCancel}
              label="Cancel"
              style={{
                backgroundColor: '#fff',
                color: '#4754D6',
                minWidth: 100,
                border: '1px solid #4754D6',
                width: '85%',
                margin: '0 auto',
                display: 'block'
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <Button
              type="submit"
              label="Save"
              style={{
                backgroundColor: '#4754D6',
                minWidth: 100,
                width: '85%',
                margin: '0 auto',
                display: 'block'
              }}
            />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

AddAddressForm.propTypes = {
  formTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  addressTypelist: PropTypes.arrayOf(PropTypes.shape([])),
  ownershipList: PropTypes.arrayOf(PropTypes.shape({}))
};

AddAddressForm.defaultProps = {
  formTitle: '',
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {},
  addressTypelist: [],
  ownershipList: []
};

export default AddAddressForm;
