import React from 'react';
import { Grid, ButtonBase } from '@material-ui/core';
import styles from './styles.scss';

const TabSelector = ({ menuItems, onChangeTab, selectedTab }) => (
  <Grid container={true} wrap="nowrap" style={{ marginBottom: '30px' }}>
    {menuItems.map((item) => (
      <Grid item={true} container={true} xs={2} key={item.id}>
        <ButtonBase
          onClick={() => onChangeTab(item.id)}
          styles={styles.selectedTab}
          className={
            selectedTab === item.id ? styles.selectedTab : styles.normalTab
          }
        >
          {item.name}
        </ButtonBase>
      </Grid>
    ))}
  </Grid>
);

export default TabSelector;
