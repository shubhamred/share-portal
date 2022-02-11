/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CustomCheckBox from '../../../../components/check-box/custom-checkbox';
import CustomDatePicker from '../../../../components/datePickerNew';
import Autocomplete from '../../../../components/autocomplete';
import Input from '../../../../components/input/input';
import { FilterInputTypes } from '../data/data';

import styles from '../style.scss';

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

const TabFilters = () => <p>Tab Filters</p>;
const DrawerFilters = (props) => {
  const { data = {}, changeHendler, index } = props;
  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    if (data && data?.type === FilterInputTypes.AutoComplete) {
      const { selectedValue, selector, valueSelector } = data;
      if (selectedValue?.value?.length) {
        setSelectedOption({ [selector]: selectedValue?.search || '', [valueSelector]: selectedValue.value[0] });
      } else {
        setSelectedOption({ [selector]: 'All', [valueSelector]: '' });
      }
    }
  }, []);

  const getFilterUI = (propsData) => {
    const { type, name, value, isSearchable, selectedValue, selector, handleInputChange, valueSelector } = propsData;
    switch (type) {
      case FilterInputTypes.AutoComplete:
        return (
          <div className={styles.filter}>
            <p className={styles.name}>{name}</p>
            <Autocomplete
              options={[{ [selector]: 'All', [valueSelector]: '' }, ...value]}
              selector={selector}
              isArray={false}
              selectedOption={selectedOption}
              handleSelectedOption={(e, selected) => {
                setSelectedOption(selected);
                changeHendler(selected[selector], propsData, index, 'search');
                changeHendler(selected[valueSelector], propsData, index, 'value');
              }}
              debouncedInputChange={handleInputChange}
            />
          </div>
        );
      case FilterInputTypes.MultiSelect:
        return (
          <div className={styles.filter}>
            <p className={styles.name}>{name}</p>
            {isSearchable && (
              <div className={styles.search}>
                <Input
                  placeholder={`Search ${name}`}
                  customClass={styles.filterSearch}
                  value={selectedValue?.search || ''}
                  onChange={(event) => {
                    changeHendler(event.target.value, propsData, index, 'search');
                  }}
                />
              </div>
            )}
            {value?.map((item) => (
              <CustomCheckBox
                label={item.label}
                value={item.value}
                defaultChecked={selectedValue?.value?.findIndex((list) => list === item.value) >= 0}
                onChange={(checked) => changeHendler({ checked, value: item.value }, propsData, index, 'value')}
              />
            ))}
          </div>
        );
      case FilterInputTypes.SingleSelect:
        return (
          <div className={styles.filter}>
            <p className={styles.name}>{name}</p>
            {isSearchable && (
              <div className={styles.search}>
                <Input
                  placeholder={`Search ${name}`}
                  customClass={styles.filterSearch}
                  value={selectedValue?.search || ''}
                  onChange={(event) => {
                    changeHendler(event.target.value, propsData, index, 'search');
                  }}
                />
              </div>
            )}
            <NativeSelect
              id="demo-customized-select-native"
              style={{ minWidth: '250px' }}
              value={
                value?.findIndex(
                  (list) => list.value === (selectedValue?.value?.length ? selectedValue.value[0] : '')
                ) >= 0
                  ? selectedValue.value[0]
                  : ''
              }
              onChange={({ target }) => {
                changeHendler(target.value, propsData, index, 'value');
              }}
              input={<BootstrapInput />}
            >
              {/* <option aria-label="None" value="" /> */}
              <option value="">All</option>
              {value?.map((item) => (
                <option value={item.value}>{item.label}</option>
              ))}
            </NativeSelect>
          </div>
        );
      case FilterInputTypes.DateRange:
        return (
          <div className={styles.filter}>
            <p className={styles.name}>{name}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CustomDatePicker
                initialValue={selectedValue?.value?.length ? selectedValue.value[0] : ''}
                onDateSelect={(values) => changeHendler(values, propsData, index)}
                placeholder="Select Date Range"
              />
              <Grid onClick={() => changeHendler('', propsData, index)} style={{ paddingTop: '14px', cursor: 'pointer' }}>Clear</Grid>
            </div>
          </div>
        );
      default:
        return <div>default</div>;
    }
  };

  return (
    <div>
      {getFilterUI(data)}
    </div>
  );
};

DrawerFilters.defaultProps = {
  data: {},
  changeHendler: () => {},
  index: 1
};

export { TabFilters, DrawerFilters };
