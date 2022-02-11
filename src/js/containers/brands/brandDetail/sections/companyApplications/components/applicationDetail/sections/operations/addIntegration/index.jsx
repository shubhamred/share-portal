/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControl,
  OutlinedInput,
  FormControlLabel,
  NativeSelect,
  InputBase,
  withStyles
} from '@material-ui/core';
import { Button, Switch, Input, DropDown } from 'app/components';
import styles from '../styles.scss';

const PatronForm = (props) => {
  const { onClose, onSubmit, PGTypeList, POSTypeList, MarketplaceTypeList, CODTypeList } = props;
  const categoryList = [
    {
      label: 'PG',
      value: 'PG'
    },
    {
      label: 'POS',
      value: 'POS'
    },
    {
      label: 'Marketplace',
      value: 'MARKETPLACE'
    },
    {
      label: 'COD',
      value: 'COD'
    }
  ];
  const [category, setCategory] = useState('PG');
  const [typeList, setTypeList] = useState(PGTypeList);
  const [type, setType] = useState(PGTypeList?.length ? PGTypeList[0].value : '');
  const [isPrimary, setIsPrimary] = useState(false);
  const [minContribution, setMinContribution] = useState('');
  const [splitPercentage, setSplitPercentage] = useState('');

  const onChangeTypeHandler = (value) => {
    setCategory(value);
    if (value === 'PG') {
      if (PGTypeList?.length) {
        setType(PGTypeList[0]?.value || '');
      }
      setTypeList(PGTypeList);
    } else if (value === 'POS') {
      if (POSTypeList?.length) {
        setType(POSTypeList[0]?.value || '');
      }
      setTypeList(POSTypeList);
    } else if (value === 'MARKETPLACE') {
      if (MarketplaceTypeList?.length) {
        setType(MarketplaceTypeList[0]?.value || '');
      }
      setTypeList(MarketplaceTypeList);
    } else {
      if (CODTypeList?.length) {
        setType(CODTypeList[0]?.value || '');
      }
      setTypeList(CODTypeList);
    }
  };

  // const BootstrapInput = withStyles((theme) => ({
  //   root: {
  //     'label + &': {
  //       marginTop: theme.spacing(3)
  //     }
  //   },
  //   input: {
  //     borderRadius: 4,
  //     position: 'relative',
  //     border: '1px solid #ced4da',
  //     fontSize: 16,
  //     padding: '10px 26px 10px 12px',
  //     transition: theme.transitions.create(['border-color', 'box-shadow']),
  //     '&:focus': {
  //       borderRadius: 4,
  //       borderColor: '#80bdff',
  //       boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
  //     }
  //   }
  // }))(InputBase);

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
              <DropDown
                style={{ minWidth: '250px' }}
                selectedOption={category}
                input={{ value: category,
                  onChange: (val) => {
                    onChangeTypeHandler(val);
                  } }}
                options={categoryList?.map((item) => ({
                  key: item.value,
                  value: item.label
                }))}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Type</p>
          <Grid sm={11}>
            <FormControl variant="outlined" className={styles.formControl}>
              <DropDown
                style={{ minWidth: '250px' }}
                selectedOption={type}
                input={{ value: type,
                  onChange: (val) => {
                    setType(val);
                  } }}
                options={
                  typeList?.map((item) => ({
                    key: item.value,
                    value: item.label
                  }))
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Min Contribution(%)</p>
          <Grid sm={10}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={minContribution}
                inputType="number"
                input={{ onChange: (val) => setMinContribution(val), value: minContribution }}
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
        <Grid item={true} sm={6} className={styles.inputGap}>
          <p className={styles.inputHeading}>Split Percentage(%)</p>
          <Grid sm={10}>
            <FormControl variant="outlined" className={styles.formControl}>
              <Input
                className={styles.inputHeight}
                value={splitPercentage}
                inputType="number"
                input={{ onChange: (val) => setSplitPercentage(val), value: splitPercentage }}
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
  PGTypeList: PropTypes.shape([]),
  POSTypeList: PropTypes.shape([]),
  MarketplaceTypeList: PropTypes.shape([]),
  CODTypeList: PropTypes.shape([])
};

PatronForm.defaultProps = {
  onClose: () => {},
  onSubmit: () => {},
  PGTypeList: [],
  POSTypeList: [],
  MarketplaceTypeList: [],
  CODTypeList: []
};

export default PatronForm;
