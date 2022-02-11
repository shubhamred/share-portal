/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';

const TabPanel = (props) => {
  const { children, value, index, spacing, ...other } = props;
  const classes = useStyles();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box className={spacing === 'yes' ? classes.box : classes.box1} p={3}>
          {children}
        </Box>
      )}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.element,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  spacing: PropTypes.string
};

TabPanel.defaultProps = {
  children: null,
  spacing: 'yes'
};

const a11yProps = (index) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`
});

const useStyles = makeStyles(() => ({
  tabs: {
    color: 'black',
    maxWidth: '100% !important',
    backgroundColor: '#f2f0f0',
    marginLeft: 31
  },
  background: {
    background: '#fff',
    boxShadow: '0px 7px 9px -5px #dad5d5',
    maxHeight: '50px'
  },
  box: {
    padding: '31px !important'
  },
  box1: {
    padding: '30px 0px !important',
    overflowX: 'hidden'
  },
  // root: (props) => ({
  //   minWidth: `${props.tabSize}%`
  // })
  root: {
    // flexGrow: 1,
    width: '100%'
  },
  btn: {
    color: '#1518af'
  },
  tabBtn: {
    fontWeight: '600',
    textTransform: 'capitalize',
    '&>:nth-child(2)': {
      pointerEvents: 'unset',
      '&:hover': {
        borderBottom: '1.5px solid'
      }
    }
  }
}));

const EnhancedTabs = (props) => {
  const { tabList, onChange, refTab } = props;
  const tabSize = tabList ? 100 / tabList.length : 100;
  const classes = useStyles({ tabSize });

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue, tabList[newValue]);
  };

  useEffect(() => {
    refTab(setValue);
  });

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={2} className={classes.background}>
        <Tabs
          // className={classes.tabs}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#1518AF',
              color: '#1518AF'
            }
          }}
          classes={{ scrollButtons: classes.btn }}
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons={props.scrollable ? 'on' : 'auto'}
          variant={props.scrollable ? 'scrollable' : 'standard'}>
          {tabList.map((tab, index) => (
            <Tab
              className={classes.tabBtn}
              key={tab.label}
              label={tab.label}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </AppBar>
      {tabList.map((tab, index) => (
        <TabPanel key={tab.label} value={value} index={index} spacing={tab?.containSpace || 'yes'}>
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};

EnhancedTabs.propTypes = {
  tabList: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  refTab: PropTypes.func,
  scrollable: PropTypes.bool
};

EnhancedTabs.defaultProps = {
  tabList: [],
  onChange: () => {},
  refTab: () => {},
  scrollable: false
};

export default EnhancedTabs;
