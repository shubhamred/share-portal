/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { updateObject } from 'app/utils/utils';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PatronForm from './tabs/patronForm';
import PatronAccordion from './tabs/patronAccordion';
import PatronList from './tabs/patronList';
import { DialogData } from '../data/mockdata';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.box} p={3}>
          {children}
        </Box>
      )}
    </Typography>
  );
};

const useStyles = makeStyles(() => ({
  box: {
    padding: '30px 40px !important',
    paddingBottom: '0px !important'
  },
  root: {
    width: '100%'
  },
  tabscontainer: {
    marginBottom: '12px'
  },
  tabcontainer: {
    fontWeight: '600',
    textTransform: 'capitalize',
    padding: '0px 40px',
    borderBottom: '2px solid rgba(0, 0, 0, 0.12)',
    minWidth: 'fit-content',
    '&:hover': {
      borderBottom: '1.7px solid'
    }
  },
  indicator: {
    // bottom: '2px'
  },
  container: {
    marginTop: '20px',
    width: '100%'
  }
}));

const Form = (props) => {
  const { onClose, type, isTab, onSubmit, formData, accordionList, tableHandler, editable, inputGrid } = props;

  let tabList = [];
  if (DialogData[type] && DialogData[type]?.tabList?.length) {
    const tabs = DialogData[type].tabList;
    tabList = tabs.map((list) => {
      if (list?.contentType === 'Accordion') {
        const mData = accordionList(list.tabName);
        const configData = mData.map((listData) => {
          const formList = { ...list.formData };
          let formDataObj = { ...list.formData };
          Object.keys(formList).map((row) => {
            formDataObj = updateObject(formDataObj, {
              [row]: updateObject(formDataObj[row], {
                value: listData.formData[row] || formDataObj[row].value
              })
            });
            return null;
          });
          return {
            id: listData.id,
            title: listData.title,
            tabName: listData.tabName || list.tabName,
            isCallBack: listData?.isCallBack || false,
            openAccordionListHandler: listData?.openAccordionListHandler,
            formData: formDataObj
          };
        });
        return {
          label: list.tabName,
          content: (
            <PatronAccordion
              onClose={onClose}
              config={configData}
              noData={mData?.length < 1}
            />
          )
        };
      }

      if (list?.contentType === 'table') {
        const configData = tableHandler(list.tabName);
        return {
          label: list.tabName,
          content: (
            <PatronList
              onClose={onClose}
              {...configData}
            />
          )
        };
      }

      const mData = { ...list.formData };
      let formDataObj = { ...list.formData };
      Object.keys(mData).map((row) => {
        formDataObj = updateObject(formDataObj, {
          [row]: updateObject(formDataObj[row], {
            value: formData[row] || formDataObj[row].value
          })
        });
        return null;
      });
      return {
        label: list.tabName,
        content: (
          <PatronForm
            onClose={onClose}
            formType={type}
            onSubmit={onSubmit}
            config={formDataObj}
            editable={editable}
            inputGrid={inputGrid}
          />
        )
      };
    });
  }
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`
  });

  const tabSize = tabList ? 100 / tabList.length : 100;
  const classes = useStyles({ tabSize });

  return (
    <Grid item={true} container={true} direction="column" style={{ minWidth: '700px' }}>
      {isTab ? (
        <div className={classes.root}>
          <Tabs
            TabIndicatorProps={{
              style: {
                backgroundColor: '#1518AF',
                color: '#1518AF'
              }
            }}
            classes={{ scrollButtons: classes.btn, indicator: classes.indicator }}
            value={value}
            className={classes.tabscontainer}
            onChange={handleChange}
            scrollButtons="auto"
            variant="scrollable"
            textColor="primary"
          >
            {tabList.map((tab, index) => (
              <Tab
                className={classes.tabcontainer}
                key={tab.label}
                label={tab.label}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          {tabList.map((tab, index) => (
            <TabPanel key={tab.label} value={value} index={index}>
              {tab.content}
            </TabPanel>
          ))}
        </div>
      ) : (
        <div className={classes.container}>{tabList[0].content}</div>
      )}
    </Grid>
  );
};

Form.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  accordionList: PropTypes.func,
  tableHandler: PropTypes.func,
  isTab: PropTypes.bool,
  type: PropTypes.string,
  formData: PropTypes.shape({})
};

Form.defaultProps = {
  accordionList: () => {},
  tableHandler: () => {},
  onClose: () => {},
  onSubmit: () => {},
  isTab: true,
  type: '',
  formData: {}
};

export default Form;
