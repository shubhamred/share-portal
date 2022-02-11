import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Button from '../button/button';
import styles from './styles.scss';

const CustomTabs = ({ children, tabs, handleTabClick, activeTab }) => (
  <Grid item={true} xs={12}>
    <Grid container={true} direction="row" className={styles.tabContainer}>
      {tabs.map((tab) => (
        <Grid item={true} key={tab}>
          <Button
            label={tab}
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              minWidth: '100px',
              marginRight: '16px',
              color: activeTab !== tab ? '#4754D6' : '#fff',
              backgroundColor: activeTab !== tab ? '#fff' : '#4754D6',
              borderRadius: 21,
              border: `1px solid  ${activeTab !== tab ? '#4754D6' : '#fff'}`
            }}
          />
        </Grid>))}
    </Grid>
    {children}
  </Grid>
);

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  handleTabClick: PropTypes.func,
  activeTab: PropTypes.string,
  children: PropTypes.element
};

CustomTabs.defaultProps = {
  tabs: [],
  handleTabClick: () => {},
  activeTab: '',
  children: null
};

export default CustomTabs;
