import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl } from '@material-ui/core';
import { Button, Input } from 'app/components';
import styles from './styles.scss';

const PatronForm = (props) => {
  const { onClose, onSubmit, config } = props;
  const [accountType, setAccountType] = useState(config?.type || '');
  const [accountNumber, setAccountNumber] = useState(config?.accountNumber || '');
  const [accountName, setAccountName] = useState(config?.accountName || '');

  const onSubmitHandler = () => {
    const payload = {
      pos_account_type: accountType,
      pos_accouunt_number: accountNumber,
      pos_account_name: accountName
    };
    onSubmit(payload);
  };

  return (
    <Grid item={true} container={true} direction="column" style={{ minWidth: '700px' }}>
      <Grid container={true} sm={12}>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>POS account type</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={accountType}
                input={{ onChange: (val) => setAccountType(val),
                  value: accountType }}
                labelWidth={0}
                disabled={true}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>POS account name</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={accountName}
                input={{ onChange: (val) => setAccountName(val),
                  value: accountName }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>POS account number</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={accountNumber}
                input={{ onChange: (val) => setAccountNumber(val),
                  value: accountNumber }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid sm={12} className={styles.buttons}>
        <Button
          style={{
            color: '#212529',
            backgroundColor: '#fff',
            border: 'none',
            marginRight: '10px',
            fontWeight: '600'
          }}
          type="button"
          label="Cancel"
          onClick={() => {
            onClose();
          }}
        />
        <Button type="button" onClick={onSubmitHandler} label="Save" />
      </Grid>
    </Grid>
  );
};

PatronForm.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  config: PropTypes.shape({})
};

PatronForm.defaultProps = {
  onClose: () => {},
  onSubmit: () => {},
  config: {}
};

export default PatronForm;
