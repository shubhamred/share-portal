import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  OutlinedInput,
  FormControlLabel,
  NativeSelect,
  InputBase,
  withStyles,
  TextField
} from '@material-ui/core';
import { ControlledAccordion, Button, Switch } from 'app/components';
import styles from '../styles.scss';

const PatronForm = (props) => {
  const { config, onClose, noData } = props;
  const [expanded, setExpanded] = useState('');
  const [accordionData, setAccordionData] = useState(config || []);

  const handleExpanded = (id, tabName, isCallBack, callBack) => {
    if (expanded === id) {
      setExpanded('');
      return;
    }
    if (isCallBack) {
      callBack(tabName, accordionData, id).then((res) => {
        setAccordionData(res);
      });
    }
    setExpanded(id);
  };

  const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3)
      }
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
      }
    }
  }))(InputBase);

  const elementHandler = (data) => {
    const { label, value, type, options, disabled } = data;
    switch (type) {
      case 'input':
        return (
          <Grid item={true} sm={4} className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={10}>
              {/* <FormControl variant="outlined" className={styles.formControl}> */}
              <TextField
                className={styles.inputHeight}
                value={value}
                // id="outlined-adornment-weight"
                // aria-describedby="outlined-weight-helper-text"
                // inputProps={{
                //   'aria-label': 'search'
                // }}
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
              <FormControlLabel control={<Switch checked={value} />} />
            </Grid>
          </Grid>
        );
      case 'select':
        return (
          <Grid className={styles.inputGap}>
            <p className={styles.inputHeading}>{label}</p>
            <Grid sm={6}>
              <FormControl variant="outlined" className={styles.formControl}>
                <NativeSelect
                  id="demo-customized-select-native"
                  style={{ minWidth: '250px' }}
                  value={value}
                  input={<BootstrapInput />}
                >
                  {options?.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </NativeSelect>
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
      <Grid sm={12}>
        {!!accordionData?.length
          && accordionData.map((list) => (
            <ControlledAccordion
              unmountOnExit={true}
              customBasis="95%"
              heading={list.title}
              expanded={expanded}
              id={list.id}
              handleChange={() => handleExpanded(list.id, list.tabName, list.isCallBack, list?.openAccordionListHandler)}
            >
              <Grid container={true} sm={12}>
                {Object.keys(list.formData).map((formElKey) => elementHandler(list.formData[formElKey]))}
              </Grid>
            </ControlledAccordion>
          ))}
      </Grid>

      {noData && <p className={styles.noDataText}>No Data Found</p>}

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
      </Grid>
    </Grid>
  );
};

PatronForm.propTypes = {
  onClose: PropTypes.func,
  config: PropTypes.shape([])
};

PatronForm.defaultProps = {
  onClose: () => {},
  config: []
};

export default PatronForm;
