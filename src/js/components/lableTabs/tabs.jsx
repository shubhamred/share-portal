/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const a11yProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`
});

const useStyles = makeStyles(() => ({
  tabs: {
    color: 'black',
    backgroundColor: '#f2f0f0',
    marginLeft: 31
  },
  background: {
    background: '#fff',
    boxShadow: '0px 7px 9px -5px #dad5d5',
    maxHeight: '50px'
  },
  root: {
    width: 'fit-content',
    background: '#F7F8F9',
    border: '1px solid rgba(198, 209, 221, 0.5);'
  },
  tabcontainer: {
    fontWeight: '600',
    minWidth: 'fit-content',
    margin: '0px 10px'
  }
}));

const EnhancedTabs = (props) => {
  const { tabList, callbackFunction } = props;
  const tabSize = tabList ? 100 / tabList.length : 100;
  const classes = useStyles({ tabSize });

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    callbackFunction(tabList[newValue], newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        TabIndicatorProps={{
          style: {
            backgroundColor: '#1518AF',
            color: '#1518AF'
          }
        }}
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="standard">
        {tabList.map((tab, index) => (
          <Tab
            className={classes.tabcontainer}
            key={tab.label}
            label={tab.label}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
    </div>
  );
};

// example
// const TABS_LIST = [
//   {
//     label: '3M',
//     value: '3M'
//   },
//   {
//     label: '6M',
//     value: '6M'
//   },
//   {
//     label: '12M',
//     value: '12M'
//   }
// ];
// <LableTabs tabList={TABS_LIST} callbackFunction={(value) => {}} />

EnhancedTabs.propTypes = {
  tabList: PropTypes.arrayOf(PropTypes.any),
  callbackFunction: PropTypes.func
};

EnhancedTabs.defaultProps = {
  tabList: [],
  callbackFunction: () => {}
};

export default EnhancedTabs;
