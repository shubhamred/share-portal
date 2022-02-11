import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button, PhoneInput, DropDown, CheckBox, DialogComponent } from 'app/components';
import styles from './styles.scss';

const EditNumberForm = (props) => {
  const { initialize, handleSubmit, numberTypelist, type, onSubmit, initialValues, resourceId, resource, communicationDetailsUpdate } = props;
  const [phoneNumber, setPhoneNumber] = useState(initialValues.contact);
  const [disabled, setDisabled] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);

  const handleSaveClick = (values) => {
    if (values) {
      onSubmit({ ...values, phoneType: values.phoneType.split(' ').join(''), id: initialValues.id, resourceId, resource });
      setDisabled(!disabled);
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 1000);
    }
  };
  return (
    <Grid container={true}>
      <form
        onSubmit={handleSubmit(handleSaveClick)}
        className={styles.editForm}
      >
        <Grid
          container={true}
          xs={12}
          direction="row"
          className={styles.addressGroup}
        >
          <Grid item={true} xs={4}>
            <Field
              name="phoneType"
              options={numberTypelist}
              component={DropDown}
              label="Type of Number"
              type="dropdown"
              disabled={disabled}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Field
              name="contact"
              component={PhoneInput}
              label="Number"
              country="IN"
              onChange={setPhoneNumber}
              placeholder="Mobile"
              propValue={phoneNumber}
              disabled={disabled}
            />
          </Grid>
          <Grid container={true} xs={4} direction="column">
            <Field
              name="contactType"
              component={CheckBox}
              values={type}
              disabled={disabled}
              label=" "
            />
          </Grid>
          <Grid xs={12} className={styles.addressGroup}>
            <Grid container={true} direction="row" justify="space-between">
              {!disabled && (
                <Grid container={true} direction="row">
                  <Grid item={true}>
                    <Button
                      type={disabled ? 'button' : 'submit'}
                      label="Save"
                      style={{
                        backgroundColor: '#4754D6',
                        minWidth: 97,
                        marginRight: 8
                      }}
                    />
                  </Grid>
                  <Grid item={true}>
                    <Button
                      onClick={() => {
                        setPhoneNumber(initialValues.contact);
                        initialize(initialValues);
                        setDisabled(true);
                      }}
                      label="Discard"
                      style={{
                        backgroundColor: '#fff',
                        color: '#4754D6',
                        minWidth: 97,
                        border: '1px solid #4754D6'
                      }}
                    />
                  </Grid>
                </Grid>
              )}
              {disabled && (
                <Grid item={true}>
                  <Button
                    onClick={() => setDisabled(false)}
                    label="Edit"
                    style={{
                      backgroundColor: '#fff',
                      color: '#4754D6',
                      minWidth: 97,
                      border: '1px solid #4754D6'
                    }}
                  />
                </Grid>
              )}
            </Grid>
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
                <div className={styles.messageIcon}>
                  <CheckCircleIcon style={{ fill: 'green' }} />
                </div>
              </div>
            )}
            {communicationDetailsUpdate === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Save failed</div>
                <div className={styles.messageIcon}>
                  <ErrorIcon style={{ fill: 'red' }} />
                </div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

EditNumberForm.propTypes = {
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})),
  numberTypelist: PropTypes.arrayOf(PropTypes.shape([])),
  type: PropTypes.arrayOf(PropTypes.shape({}))
};

EditNumberForm.defaultProps = {
  initialize: () => { },
  handleSubmit: () => { },
  onSubmit: () => { },
  initialValues: {},
  numberTypelist: [],
  type: []
};

export default EditNumberForm;
