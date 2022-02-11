/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import styles from './styles.scss';
import { Input } from '../../../../../../../../components';

// const inputListData = [
//     { disabled: true, label: '# Accounts', propValue: '3' },
//     { disabled: true, label: 'Avg Monthly Balance', propValue: '5,00,000' },
//     { disabled: true, label: 'Percentage throughput', propValue: '123' }
// ];

const inputListDataBank = [
  { disabled: true, label: 'Name of the Account Holder', propValue: 'WELLVERSED HEALTH ' },
  { disabled: true, label: 'Name of the Bank', propValue: 'HDFC' },
  { disabled: true, label: 'Account Number', propValue: '50200037924611' },
  { disabled: true, label: 'Account Type', propValue: 'CURRENT' },
  { disabled: true, label: 'IFSC Code', propValue: '-' },
  { disabled: true, label: 'Address', propValue: 'Brand Name, Bangalore.' },
  { disabled: true, label: 'Statement upload', propValue: '01-Apr-2019 to 30-Apr-2020' },
  { disabled: true, label: 'Missing Months', propValue: '-' }
];

const ConsolidatedOverview = () => {
  const [inputList, handleInputList] = useState([]);
  useEffect(() => {
    handleInputList(inputListDataBank);
  }, []);

  return (
    <Grid direction="column" container={true}>
      <Grid container={true} className={styles.overviewWrapper}>
        {inputList.map((data) => <Grid item={true} xs={4}><Input {...data} /></Grid>)}
      </Grid>
    </Grid>
  );
};

ConsolidatedOverview.propTypes = {
};

ConsolidatedOverview.defaultProps = {
};

export default ConsolidatedOverview;
