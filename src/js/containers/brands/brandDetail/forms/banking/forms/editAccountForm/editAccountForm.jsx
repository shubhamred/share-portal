import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Button, Input, DropDown, DialogComponent, AutocompleteCustom, CheckBox } from 'app/components';
import styles from './styles.scss';

const EditBankingForm = (props) => {
  const {
    handleSubmit,
    bankNamelist,
    onSubmit,
    accountTypeList,
    initialize,
    initialValues,
    handleAutocomplete,
    updateStatus
  } = props;
  const [disabled, setDisabled] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [isPrimary, setPrimary] = useState(initialValues?.isPrimary || false);

  const handleSaveClick = (values) => {
    if (values) {
      onSubmit({ ...values, id: initialValues.id, isPrimary });
      setDisabled(!disabled);
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 1000);
    }
  };

  const primaryOptions = [
    { label: 'is Primary ?', name: 'Primary' }
  ];

  const isAccountVerified = initialValues?.isAccountVerified || false;
  const statusChecker = (val, inputStatus) => (!inputStatus ? (isAccountVerified ? !!val : false) : true);

  return (
    <Grid container={true}>
      <form onSubmit={handleSubmit(handleSaveClick)} className={styles.editForm}>
        <Grid container={true} xs={12} direction="row" alignItems="center" className={styles.fieldGroup}>
          <Grid item={true} xs={3}>
            <Field
              name="bankName"
              options={bankNamelist}
              component={AutocompleteCustom}
              label="Bank Name"
              type="dropdown"
              isArray={true}
              disabled={statusChecker(initialValues?.bankName, disabled)}
              required={true}
              debouncedInputChange={handleAutocomplete}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <Field
              name="accountHolder"
              component={Input}
              label="Account Holder"
              type="text"
              disabled={statusChecker(initialValues?.accountHolder, disabled)}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <Field
              name="accountNumber"
              component={Input}
              label="A/C Number"
              type="number"
              disabled={statusChecker(initialValues?.accountNumber, disabled)}
            />
          </Grid>
          <Grid item={true} xs={3}>
            <Field
              name="accountType"
              options={accountTypeList}
              component={DropDown}
              label="A/C Type"
              type="dropdown"
              disabled={statusChecker(initialValues?.accountType, disabled)}
              required={true}
            />
          </Grid>
          <Grid container={true} className={styles.addressField}>
            <Grid item={true} xs={3}>
              <Field
                name="ifsc"
                component={Input}
                label="IFSC"
                type="text"
                disabled={statusChecker(initialValues?.ifsc, disabled)}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <Field
                name="statementPassword"
                component={Input}
                label="Statement Password"
                type="text"
                disabled={statusChecker(initialValues?.statementPassword, disabled)}
              />
            </Grid>
          </Grid>

          <Grid container={true} xs={12} className={styles.addressField}>
            <Grid item={true} xs={12}>
              <Field
                name="address"
                component={Input}
                label="Address"
                type="text"
                disabled={statusChecker(initialValues?.address, disabled)}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={7} className={styles.fieldItem}>
            <CheckBox
              disabled={disabled}
              input={{
                value: isPrimary ? ['Primary'] : [],
                onChange: (val) => {
                  setPrimary(val?.includes('Primary'));
                }
              }}
              values={primaryOptions}
              name="isDirector"
            />
          </Grid>
        </Grid>
        <Grid className={styles.fieldGroup}>
          <Grid container={true} xs={6} direction="row" justify="space-between">
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
      </form>
      {updateStatus && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {updateStatus === 'success' && (
              <div className={styles.saveMessage}>
                <div>Saved successfully</div>
                <div className={styles.messageIcon}><CheckCircleIcon style={{ fill: 'green' }} /></div>
              </div>
            )}
            {updateStatus === 'failed' && (
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

EditBankingForm.propTypes = {
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleAutocomplete: PropTypes.func,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})),
  bankNamelist: PropTypes.arrayOf(PropTypes.shape([])),
  accountTypeList: PropTypes.arrayOf(PropTypes.shape([]))
};

EditBankingForm.defaultProps = {
  initialize: () => {},
  handleSubmit: () => {},
  onSubmit: () => {},
  handleAutocomplete: () => {},
  initialValues: {},
  bankNamelist: [],
  accountTypeList: []
};

export default EditBankingForm;
