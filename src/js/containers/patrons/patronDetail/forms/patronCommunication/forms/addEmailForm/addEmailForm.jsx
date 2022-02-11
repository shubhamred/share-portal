import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button, Input, DropDown, CheckBox } from 'app/components';
import styles from './styles.scss';

const AddEmailForm = (props) => {
  const { formTitle, handleSubmit, handleCancel, emailTypelist, type, onSubmit } = props;
  const [selectedType, setSelectedType] = useState('');
  return (
    <Grid container={true} className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item={true} xs={12} className={styles.headerStyle}>
          {formTitle}
        </Grid>
        <Grid container={true} xs={12} direction="row">
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field
              name="emailType"
              options={emailTypelist}
              selectedOption={selectedType}
              component={DropDown}
              label="Type of Email"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedType(val);
              }}
              placeholder="Select email type"
            />
          </Grid>
          <Grid item={true} xs={6} className={styles.formLabelStyle}>
            <Field
              name="contact"
              component={Input}
              label="Email ID"
              type="text"
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12}>
          <Grid item={true} className={styles.formLabelStyle}>
            <Field
              name="contactType"
              component={CheckBox}
              values={type}
            />
          </Grid>
        </Grid>
        <Grid>
          <Grid container={true} xs={12} className={styles.formLabelStyle}>
            <Grid item={true} xs={6}>
              <Button type="submit" label="Save" style={{ backgroundColor: '#4754D6', minWidth: 100, width: '85%', margin: '0 auto', display: 'block' }} />
            </Grid>
            <Grid item={true} xs={6}>
              <Button onClick={handleCancel} label="Cancel" style={{ backgroundColor: '#fff', color: '#4754D6', minWidth: 100, border: '1px solid #4754D6', width: '85%', margin: '0 auto', display: 'block' }} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

AddEmailForm.propTypes = {
  formTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  emailTypelist: PropTypes.arrayOf(PropTypes.shape([])),
  type: PropTypes.arrayOf(PropTypes.shape({}))
};

AddEmailForm.defaultProps = {
  formTitle: '',
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {},
  emailTypelist: [],
  type: []
};

export default AddEmailForm;
