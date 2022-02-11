import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button, Input, DropDown, AutocompleteCustom } from 'app/components';
import styles from './styles.scss';

const AddAddressForm = (props) => {
  const { handleSubmit, handleCancel, bankNamelist, onSubmit, accountTypelist, handleAutocomplete } = props;
  const [selectedBank, setSelectedBank] = useState(bankNamelist[-1]);
  const [selectedAccount, setSelectedAccount] = useState(accountTypelist[-1]);
  return (
    <Grid container={true} style={{ marginTop: '10px' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12} className={styles.formLabelStyle}>
          <Field
            name="bankName"
            options={bankNamelist}
            selectedOption={selectedBank}
            component={AutocompleteCustom}
            label="Bank Name"
            type="dropdown"
            isArray={true}
            required={true}
            handleSelectedOption={(eve, val) => setSelectedBank(val)}
            debouncedInputChange={handleAutocomplete}
          />
        </Grid>
        <Grid item={true} xs={11} className={styles.formLabelStyle}>
          <Field
            name="accountHolder"
            component={Input}
            isRequiredField={true}
            label="Account Holder"
            type="text"
          />
        </Grid>
        <Grid item={true} xs={12} className={styles.formLabelStyle}>
          <Field
            name="accountType"
            options={accountTypelist}
            selectedOption={selectedAccount}
            component={DropDown}
            label="A/C Type"
            required={true}
            type="dropdown"
            handleSelectedOption={setSelectedAccount}
          />
        </Grid>
        <Grid item={true} xs={11} className={styles.formLabelStyle}>
          <Field
            name="accountNumber"
            component={Input}
            isRequiredField={true}
            label="A/C Number"
            type="number"
          />
        </Grid>
        <Grid item={true} xs={11} className={styles.formLabelStyle}>
          <Field
            name="statementPassword"
            component={Input}
            label="Statement Password"
            type="text"
          />
        </Grid>
        <Grid container={true} xs={12} className={styles.formLabelStyle}>
          <Grid item={true} xs={6} />
          <Grid item={true} xs={3}>
            <Button onClick={handleCancel} label="Cancel" style={{ backgroundColor: '#fff', color: '#4754D6', minWidth: 100, border: '1px solid #4754D6', width: '85%', margin: '0 auto', display: 'block' }} />
          </Grid>
          <Grid item={true} xs={3}>
            <Button type="submit" label="Save" style={{ backgroundColor: '#4754D6', minWidth: 100, width: '85%', margin: '0 auto', display: 'block' }} />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

AddAddressForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  handleAutocomplete: PropTypes.func,
  bankNamelist: PropTypes.arrayOf(PropTypes.shape([])),
  accountTypelist: PropTypes.arrayOf(PropTypes.shape({}))
};

AddAddressForm.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {},
  handleAutocomplete: () => {},
  bankNamelist: [],
  accountTypelist: []
};

export default AddAddressForm;
