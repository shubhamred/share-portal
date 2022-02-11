import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Input, Radio, Button, Switch, TextArea } from 'app/components';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AccountTypes } from '../../../../../data/enum';
import styles from './styles.scss';

const EditAccount = (props) => {
  const { handleSubmit, onClose, onSubmit, initialValues, isNBFC } = props;

  const handleFormSubmit = (values) => {
    const submittedData = { ...values };
    onSubmit({
      ...submittedData,
      isActive: isActive ? 1 : 0,
      type: accountType
    });
  };

  const fetchOptions = () => {
    if (isNBFC) {
      setOptions(['NBFC']);
      setSelectedAccType('NBFC');
    } else {
      setOptions(['Brand']);
      setSelectedAccType('Brand');
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [isNBFC]);

  const [accountType, setSelectedAccType] = useState('');
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const [options, setOptions] = useState([]);

  return (
    <Grid container={true} className={styles.addPartnerForm}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid item={true} xs={12} container={true} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={`${styles.childDivWidth}`}>
                <Radio
                  options={options}
                  handleChange={(value) => {
                    setSelectedAccType(value);
                  }}
                  selected={accountType}
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="name"
                  component={Input}
                  label="Account Name*"
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="accountNumber"
                  component={Input}
                  label="Account No*"
                  type="text"
                  disabled={isNBFC}
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="ifsc"
                  component={Input}
                  label="IFSC Code*"
                  type="text"
                />
              </Grid>
            </Grid>
            {accountType === AccountTypes.NBFC && (
              <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
                <Grid item={true} xs={12} className={styles.headerHeading3}>Status</Grid>
                <Grid item={true} xs={12} className={`${styles.headerValue3} ${styles.switchStyle}`}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={() => setIsActive((isChecked) => !isChecked)}
                        checked={isActive}
                      />
                    }
                  />
                </Grid>
              </Grid>
            )}
            {accountType === AccountTypes.BRAND && (
              <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
                <Grid item={true} xs={12} className={styles.childDivWidth}>
                  <Field
                    name="narration"
                    component={TextArea}
                    label="Description*"
                    type="text"
                    maxLength={20}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid
            container={true}
            className={styles.buttonStyle}
            alignItems="center"
          >
            <Grid
              onClick={() => onClose()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              <Grid style={{ padding: '4px', color: '#1518AF' }}>Cancel</Grid>
            </Grid>
            <Button type="submit" label="Edit Account" />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

EditAccount.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};

EditAccount.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  onClose: () => {}
};

export default EditAccount;
