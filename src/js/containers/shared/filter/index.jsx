/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-multi-comp */
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import Button from '../../../components/button/button';
import FIlterDrawer from '../../../components/drawer/filterDrawer';
import { DrawerFilters, TabFilters } from './components/filters';
import FilterTypes, { FilterData, FilterInputTypes } from './data/data';

import styles from './style.scss';

const Filters = ({ type = FilterTypes.TAB }) => {
  if (type === FilterTypes.TAB) {
    return <TabFilters />;
  }

  if (type === FilterTypes.DRAWER) {
    return <DrawerFilters data={FilterData} />;
  }

  return null;
};

export { Filters };

const FilterProvider = ({ type = FilterTypes.TAB, children, onApplyFilter, customFilterData }) => {
  const [open, handleDrawer] = useState(false);
  const [FiltersList, setFiltersList] = useState([]);

  useEffect(() => {
    if (customFilterData.length) {
      const mData = [...customFilterData];
      if (FiltersList.length) {
        for (let index = 0; index < mData.length; index += 1) {
          const elemData = mData[index];
          for (let ind = 0; ind < FiltersList.length; ind += 1) {
            const elemAutoComplete = FiltersList[ind];
            if (elemAutoComplete.key === elemData.key) {
              elemData.selectedValue = elemAutoComplete.selectedValue;
            }
          }
        }
      }
      setFiltersList(mData);
    }
  }, [customFilterData]);

  const handleFilters = (value, metaData, index, types) => {
    const { type: fieldType } = metaData;
    const copyState = [...FiltersList];
    const oprationalData = copyState[index];
    if (metaData?.isCallBack === true && metaData?.callBack) {
      metaData.callBack(value);
    }
    switch (fieldType) {
      case FilterInputTypes.MultiSelect:
        if (types === 'search') {
          oprationalData.selectedValue.search = value;
        }
        if (types === 'value') {
          if (value?.checked) {
            oprationalData.selectedValue.value.push(value?.value || '');
          } else {
            const indexs = oprationalData.selectedValue.value.indexOf(value.value);
            if (indexs > -1) {
              oprationalData.selectedValue.value.splice(indexs, 1);
            }
          }
        }
        break;
      case FilterInputTypes.SingleSelect:
        if (types === 'search') {
          oprationalData.selectedValue.search = value;
        }
        if (types === 'value') {
          oprationalData.selectedValue.value = [value];
        }
        break;
      case FilterInputTypes.DateRange:
        oprationalData.selectedValue.value = [value];
        break;
      case FilterInputTypes.AutoComplete:
        if (types === 'search') {
          oprationalData.selectedValue.search = value;
        } else {
          oprationalData.selectedValue.value = [value];
        }
        break;
      default:
    }
    copyState[index] = oprationalData;
    setFiltersList(copyState);
  };

  const selectedFilters = () => {
    const copyState = [...FiltersList];
    const mDatas = [];
    for (let index = 0; index < copyState.length; index += 1) {
      const element = copyState[index];
      const obj = {
        key: element.key,
        isSearchable: element?.isSearchable || false,
        searchKey: element?.searchKey || `${element.key}search`,
        search: element.selectedValue.search,
        value: element.selectedValue.value
      };
      mDatas.push(obj);
    }
    return mDatas;
  };

  return (
    <div>
      <div onClick={() => handleDrawer(true)}>{children}</div>

      <FIlterDrawer
        open={open}
        anchor="right"
        title="Filters"
        handleClose={() => handleDrawer(false)}
        contentStyle={{}}
      >
        <div className={styles.filterWrapper}>
          {/* <DrawerFilters
            data={customFilterData.length === 0 ? FilterData : customFilterData}
            selectedFilters={selectedFilters}
            handleFilters={handleFilters}
            type={type}
          /> */}
          {FiltersList?.length
            && FiltersList.map((list, index) => {
              const keyMaker = `${list.key}-${list.name}`;
              return (
                <DrawerFilters
                  key={keyMaker}
                  data={list}
                  index={index}
                  changeHendler={handleFilters}
                  type={type}
                />
              );
            })}
          <div className={styles.actionWrapper}>
            <div className={styles.cancelLink}>
              <Grid onClick={() => handleDrawer(false)}>Cancel</Grid>
            </div>
            <div>
              <Button
                label="Apply Filters"
                onClick={() => {
                  handleDrawer(false);
                  onApplyFilter(selectedFilters());
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </FIlterDrawer>
    </div>
  );
};

FilterProvider.propTypes = {
  type: PropTypes.string,
  children: PropTypes.shape({}),
  customFilterData: PropTypes.arrayOf(PropTypes.object),
  onApplyFilter: PropTypes.func
};

FilterProvider.defaultProps = {
  type: FilterTypes.TAB,
  children: {},
  onApplyFilter: () => {},
  customFilterData: FilterData
};

export default FilterProvider;
