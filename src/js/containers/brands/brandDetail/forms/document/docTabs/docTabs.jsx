/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Button } from 'app/components';
import styles from './styles.scss';

const CustomTabs = (props) => {
  const { children, tabs, handleTabClick, selectedApplicant, handleApplicantSelection,
    activeTab, applicantList, showList, handleListTabClick } = props;
  return (
    <Grid item={true} xs={12}>
      <Grid container={true} direction="row" className={styles.tabContainer}>
        {tabs.map((tab) => (
          <Grid item={true}>
            {tab !== 'Applicants' ? (<Button
              label={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                minWidth: '100px',
                marginRight: '16px',
                color: activeTab !== tab ? '#4754D6' : '#fff',
                backgroundColor: activeTab !== tab ? '#fff' : '#4754D6',
                borderRadius: 21,
                border: `1px solid  ${activeTab !== tab ? '#4754D6' : '#fff'}`
              }}
            />)
              : (
                <div className={styles.container}>
                  <div
                    onClick={() => {
                      handleTabClick(tab);
                      handleListTabClick();
                    }}
                    style={{
                      minWidth: '100px',
                      marginRight: '16px',
                      color: activeTab !== tab ? '#4754D6' : '#fff',
                      backgroundColor: activeTab !== tab ? '#fff' : '#4754D6',
                      borderRadius: 21,
                      border: `1px solid  ${activeTab !== tab ? '#4754D6' : '#fff'}`
                    }}
                    className={styles.select}
                  >
                    <div>{selectedApplicant.name}</div>
                    <ArrowDropDownIcon style={{ fill: `${activeTab === tab ? 'white' : '#4754D6'}`, fontSize: '30' }} />
                  </div>
                </div>)}
            {showList && tab === 'Applicants' && (
              <div className={styles.nameList}>
                {applicantList && applicantList.map((applicant) => (
                  <div
                    className={styles.names}
                    onClick={() => handleApplicantSelection({
                      name: applicant && applicant.customer && applicant.customer.firstName,
                      id: applicant && applicant.customer && applicant.customer.id
                    })}
                    role="presentation"
                  >
                    {applicant && applicant.customer && applicant.customer.firstName}
                  </div>
                ))}
              </div>)}
          </Grid>))}
      </Grid>
      {children}
    </Grid>
  );
};

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape([])),
  handleTabClick: PropTypes.func,
  activeTab: PropTypes.string,
  children: PropTypes.node
};

CustomTabs.defaultProps = {
  tabs: [],
  handleTabClick: () => { },
  activeTab: '',
  children: {}
};

export default CustomTabs;
