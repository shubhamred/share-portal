import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button, PhoneInput, DropDown, CheckBox } from 'app/components';
import styles from './styles.scss';

const AddNumberForm = (props) => {
  const { formTitle, handleSubmit, handleCancel, numberTypelist, type, onSubmit } = props;
  const [selectedType, setSelectedType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };
  return (
    <Grid container={true} className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item={true} xs={12} className={styles.headerStyle}>
          {formTitle}
        </Grid>
        <Grid container={true} xs={12} direction="row">
          <Grid item={true} xs={12} className={styles.formLabelStyle}>
            <Field
              name="phoneType"
              options={numberTypelist}
              selectedOption={selectedType}
              component={DropDown}
              label="Type of Number"
              type="dropdown"
              handleSelectedOption={(val) => {
                setSelectedType(val);
              }}
              placeholder="Select number type"

            />
          </Grid>
          <Grid item={true} xs={12} className={styles.formLabelStyle}>
            <Field
              name="contact"
              component={PhoneInput}
              label="Number"
              country="IN"
              onChange={handlePhoneNumberChange}
              placeholder="Mobile"
              propValue={phoneNumber}
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12} className={styles.formLabelStyle}>
          <Grid item={true}>
            <Field
              name="contactType"
              component={CheckBox}
              values={type}
            />
          </Grid>
        </Grid>
        <Grid container={true} xs={12} className={styles.formLabelStyle}>
          <Grid container={true} direction="row" justify="flex-end">
            <Grid item={true} xs={6}>
              <Button
                type="submit"
                label="Save"
                style={{ backgroundColor: '#4754D6', minWidth: 100, width: '85%', margin: '0 auto', display: 'block' }}
              />
            </Grid>
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
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

AddNumberForm.propTypes = {
  formTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  numberTypelist: PropTypes.arrayOf(PropTypes.shape([])),
  type: PropTypes.arrayOf(PropTypes.shape({}))
};

AddNumberForm.defaultProps = {
  formTitle: '',
  handleSubmit: () => { },
  onSubmit: () => { },
  handleCancel: () => { },
  numberTypelist: [],
  type: []
};

export default AddNumberForm;
