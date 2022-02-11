import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button, Input, PhoneInput } from 'app/components';

import styles from './styles.scss';

const CreatePatron = (props) => {
  const { handleSubmit, formTitle, handleCancelButton, patronCreate, errorMsg } = props;

  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <Grid className={styles.inviteForm}>
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
        <Grid className={styles.buttonStyle} container={true} justify="space-around">
          <Grid item={true}><Button type="submit" label="Save" /></Grid>
          <Grid item={true}><Button label="Cancel" onClick={handleCancelButton} /></Grid>
        </Grid>
      </form>
      {patronCreate === 'failed' && (
        <div className={styles.warning}>
          <div>Patron creation failed.</div>
          <div>{`Reason: ${errorMsg}`}</div>
        </div>)}
    </Grid>
  );
};

CreatePatron.propTypes = {
  handleCancelButton: PropTypes.func,
  handleSubmit: PropTypes.func,
  formTitle: PropTypes.string,
  patronCreate: PropTypes.string,
  errorMsg: PropTypes.string
};

CreatePatron.defaultProps = {
  handleCancelButton: () => { },
  handleSubmit: () => { },
  formTitle: '',
  patronCreate: null,
  errorMsg: null
};

export default CreatePatron;
