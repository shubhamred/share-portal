import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import styles from './styles.scss';
import SectionDetail from '../components/SectionDetail';
import ConsolidatedOverview from '../components/overview/overview';

const Consolidated = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { getFinancialOverview } = props;
  const tableColumns = [{ Header: 'JAN 19', accessor: 'jan19', disableSortBy: true }, { Header: 'FEB 19', accessor: 'feb19', disableSortBy: true }];
  const tableData = [{ jan19: '134', feb19: '1245' }, { jan19: '13224', feb19: '124532' }, { jan19: '224', feb19: '45' }];
  const onChangeSort = (sort) => {
    if (sort && sort.length) {
      tableColumns.push('dd');
    }
  };
  const tableDataObj = {
    totalCount: 10,
    tableColumns,
    tableData,
    rowsPerPage: 10,
    currentPage: 0,
    isLoading: false,
    onChangeSort
  };
  const inputList = [{ disabled: true, label: 'Demo ts', propValue: '$2351' }, { disabled: true, label: 'Demo ts', propValue: '$2351' }];
  useEffect(() => {
    // if (getFinancialOverview) getFinancialOverview();
  }, []);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <ConsolidatedOverview />
          <SectionDetail title="Cred Detail" tableData={tableDataObj} inputList={inputList} />
        </Grid>
      </Grid>
    </Grid>
  );
};

Consolidated.propTypes = {
};

Consolidated.defaultProps = {
};

export default Consolidated;
