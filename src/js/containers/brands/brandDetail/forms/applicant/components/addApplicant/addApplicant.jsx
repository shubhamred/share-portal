import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Field } from 'redux-form';
import { Button, Input, PhoneInput, DropDown } from 'app/components';
import { customerCompanyAssociationTypes } from 'app/constants/misc';
import styles from './styles.scss';

const NewApplicant = (props) => {
  const { handleSubmit, formTitle, handleCancelButton } = props;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAssociationType, setSelectedAssociationType] = useState('');

  return (
    <Grid className={styles.inviteForm} container={true}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Grid className={styles.headerStyle} item={true} xs={12}>
          {formTitle}
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="firstName"
            component={Input}
            label="First Name"
            type="text"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="lastName"
            component={Input}
            label="Last Name"
            type="text"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="mobile"
            component={PhoneInput}
            label="Mobile"
            country="IN"
            onChange={(value) => setPhoneNumber(value)}
            placeholder="Mobile"
            propValue={phoneNumber}
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="email"
            component={Input}
            label="Email"
            type="text"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="associationType"
            options={customerCompanyAssociationTypes}
            placeholder="Select association type"
            selectedOption={selectedAssociationType}
            component={DropDown}
            label="Association Type"
            handleSelectedOption={(value) => {
              setSelectedAssociationType(value);
            }}
          />
        </Grid>

        <Grid className={styles.buttonStyle} container={true} justify="space-around">
          <Grid item={true}><Button type="submit" label="Save" /></Grid>
          <Grid item={true}><Button label="Cancel" onClick={handleCancelButton} /></Grid>
        </Grid>
      </form>
    </Grid>
  );
};

NewApplicant.propTypes = {
  handleSubmit: PropTypes.func,
  formTitle: PropTypes.string,
  handleCancelButton: PropTypes.func
};

NewApplicant.defaultProps = {
  handleSubmit: () => { },
  handleCancelButton: () => { },
  formTitle: ''
};

export default NewApplicant;
