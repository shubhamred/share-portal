import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { formatDateStandard } from 'app/utils/utils';
import { PaginatedTable } from '../../../../../../../components';

import styles from './styles.scss';

const LegalHistory = (props) => {
  const { companyId, financialLegalHistory, getFinancialLegalHistory, totalCount } = props;
  const createData = (caseTitle, court, reportingDate, caseStatus, caseNumber, id) => (
    { caseTitle, court, reportingDate, caseStatus, caseNumber, id }
  );

  const rowNames = ['caseTitle', 'court', 'reportingDate', 'caseStatus', 'caseNumber'];
  const columns = ['Case Title', 'Court', 'Date', 'Status', 'Case Number'];

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const rows = financialLegalHistory && financialLegalHistory.map((data) => createData(
    data && data.caseTitle,
    data && data.court,
    data && data.reportingDate && formatDateStandard(data.reportingDate),
    data && data.caseStatus,
    data && data.caseNumber,
    data && data.id
  ));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);

  useEffect(() => {
    if (getFinancialLegalHistory) getFinancialLegalHistory(companyId, rowsPerPage, 1);
  }, []);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <PaginatedTable
          dataTableType="charges"
          fetchNextData={(limit, offset) => getFinancialLegalHistory(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
          totalCount={totalCount}
          columns={columns}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          page={page}
          setPage={(pageNo) => setPage(pageNo)}
          rows={rows}
          emptyRows={emptyRows}
          rowNames={rowNames}
        />
      </Grid>
    </Grid>
  );
};

LegalHistory.propTypes = {
  companyId: PropTypes.string,
  getFinancialLegalHistory: PropTypes.func,
  financialLegalHistory: PropTypes.arrayOf(PropTypes.shape({})),
  totalCount: PropTypes.number
};

LegalHistory.defaultProps = {
  companyId: null,
  getFinancialLegalHistory: () => { },
  financialLegalHistory: null,
  totalCount: 0
};

export default LegalHistory;
