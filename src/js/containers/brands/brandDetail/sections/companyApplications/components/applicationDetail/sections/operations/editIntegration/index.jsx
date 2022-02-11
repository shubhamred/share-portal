import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  FormControlLabel
} from '@material-ui/core';
import { Button, Switch, Input } from 'app/components';
import styles from '../styles.scss';

const PatronForm = (props) => {
  const { onClose, onSubmit, config } = props;
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState(config?.category || '');
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState(config?.name || '');
  const [isPrimary, setIsPrimary] = useState(config?.isPrimary || false);
  const [minContribution, setMinContribution] = useState(config?.minContribution || '');
  const [splitPercentage, setSplitPercentage] = useState(config?.split || '');

  const onSubmitHandler = () => {
    const payload = {
      category,
      type,
      isPrimary,
      minContribution,
      splitPercentage
    };
    onSubmit(payload);
  };

  return (
    <Grid item={true} container={true} direction="column" style={{ minWidth: '700px' }}>
      <Grid container={true} sm={12}>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Category</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={category}
                disabled={true}
                input={{ onChange: (val) => setMinContribution(val), value: category }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Type</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={type}
                disabled={true}
                input={{ onChange: (val) => setMinContribution(val), value: type }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Min Contribution(%)</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={minContribution}
                inputType="number"
                input={{ onChange: (val) => setMinContribution(val), value: minContribution }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Split Percentage(%)</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={splitPercentage}
                inputType="number"
                input={{ onChange: (val) => setSplitPercentage(val), value: splitPercentage }}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid className={styles.inputGap}>
          <p className={styles.inputHeading}>Is Primary</p>
          <Grid sm={6} className={styles.switchContainer}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPrimary}
                  onChange={({ target }) => {
                    setIsPrimary(target.checked);
                  }}
                />
              }
            />
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
