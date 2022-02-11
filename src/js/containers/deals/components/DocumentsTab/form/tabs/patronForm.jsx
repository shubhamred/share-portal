import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  OutlinedInput,
  FormControlLabel,
  TextField
} from '@material-ui/core';
import { Button, RichTextEditor, Switch, DropDown, AutocompleteCustom } from 'app/components';
import { updateObject } from 'app/utils/utils';
import styles from '../styles.scss';

const PatronForm = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { onClose, config, onSubmit, formType, editable, inputGrid = 4 } = props;
  const [formData, setFormData] = useState(config || {});

  const onSubmitHandler = () => {
    const mData = { ...formData };
    let payload = {};
    Object.keys(mData).map((formElKey) => {
      payload = {
        ...payload,
        [formElKey]: mData[formElKey].value
      };
      return null;
    });
    onSubmit(payload, formType);
  };

  const onChangeHandler = (value, objectKey) => {
    const mData = { ...formData };
    const updatedControls = updateObject(mData, {
      [objectKey]: updateObject(mData[objectKey], {
        value
      })
    });
    setFormData(updatedControls);
  };

  const elementHandler = (data, formElKey) => {
    const { label, value, type, options, disabled } = data;
    switch (type) {
      case 'input':
        return (
          <Grid item={true} sm={inputGrid} className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={10}>
              {/* <FormControl className={styles.formControl}> */}
              <TextField
                className={styles.inputHeight}
                value={value}
                title={value}
                // id="outlined-adornment-weight"
                // aria-describedby="outlined-weight-helper-text"
                // inputProps={{
                //   'aria-label': 'search'
                // }}
                onChange={({ target }) => onChangeHandler(target.value, formElKey)}
                labelWidth={0}
                disabled={disabled}
              />
              {/* </FormControl> */}
            </Grid>
          </Grid>
        );
      case 'switch':
        return (
          <Grid item={true} sm={4} className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={10} className={styles.switchContainer}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={({ target }) => {
                      onChangeHandler(target.checked, formElKey);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        );
      case 'select':
        return (
          <Grid item={true} sm={6} className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={11}>
              <FormControl variant="outlined" className={styles.formControl}>
                <DropDown
                  style={{ minWidth: '250px' }}
                  selectedOption={value}
                  input={{ value,
                    onChange: (val) => {
                      onChangeHandler(val, formElKey);
                    } }}
                  options={
                    options?.map((item) => ({
                      key: item.value,
                      value: item.label
                    }))
                }
                />
              </FormControl>
            </Grid>
          </Grid>
        );
      case 'autocomplete':
        return (
          <Grid item={true} sm={6} className={styles.inputGap}>
            <Grid sm={11}>
              <FormControl variant="outlined" className={styles.formControl}>
                <AutocompleteCustom
                  label={label}
                  options={
                    options?.map((item) => ({
                      key: item.value,
                      value: item.label
                    }))
                  }
                  handleSelectedOption={(eve, val) => {
                    onChangeHandler(val, formElKey);
                  }}
                  selector="value"
                  freeSolo={true}
                  isArray={false}
                  selectedOption={value}
                />
              </FormControl>
            </Grid>
          </Grid>
        );
      case 'richTextBox':
        return (
          <Grid item={true} sm={12} className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={12}>
              <FormControl variant="outlined" className={styles.formControl}>
                <RichTextEditor
                  propValue={value}
                  onChange={({ target }) => onChangeHandler(target.value, formElKey)}
                  disabled={disabled}
                />
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Grid className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={6}>
              <FormControl variant="outlined" className={styles.formControl}>
                <OutlinedInput
                  className={styles.inputHeight}
                  value={value}
                  onChange={({ target }) => onChangeHandler(target.value, formElKey)}
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    'aria-label': 'search'
                  }}
                  labelWidth={0}
                />
              </FormControl>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <Grid item={true} container={true} direction="column">
      <Grid container={true} sm={12}>
        {Object.keys(formData).map((formElKey) => elementHandler(formData[formElKey], formElKey))}
      </Grid>
      <Grid sm={12} className={styles.buttons}>
        <Button
          style={{
            color: '#212529',
            backgroundColor: '#fff',
            border: 'none',
            fontWeight: '600',
            paddingRight: '0px',
            marginRight: '0px',
            textAlign: 'right'
          }}
          type="button"
          label="Close"
          onClick={() => {
            onClose();
          }}
        />
        {editable && (
        <Button type="button" onClick={onSubmitHandler} label="Save" style={{ marginLeft: '40px' }} />
        )}
      </Grid>
    </Grid>
  );
};

PatronForm.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  config: PropTypes.shape({}),
  formType: PropTypes.string
};

PatronForm.defaultProps = {
  onClose: () => {},
  onSubmit: () => {},
  config: {},
  formType: ''
};

export default PatronForm;
