import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { formatCurrency, formatDateStandard } from 'app/utils/utils';
import { PaginatedTable } from '../../../../../../../components';

import styles from './styles.scss';

const Charges = (props) => {
  const { companyId, financialCharges, getFinancialCharges, totalCount } = props;
  const createData = (chargeId, type, chargeDate, amount, holderName, propertyType, filingDate, numberOfHolder, id) => (
    { chargeId, type, chargeDate, amount, holderName, propertyType, filingDate, numberOfHolder, id }
  );

  const rowNames = ['chargeId', 'type', 'chargeDate', 'amount', 'holderName', 'propertyType', 'filingDate', 'numberOfHolder'];
  const columns = ['Charge Id', 'Tye', 'Date', 'Amount', 'Holder', 'Property Type', 'Filing Date', '# of Holders'];

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const rows = financialCharges && financialCharges.map((data) => createData(
    data && data.chargeId,
    data && data.type,
    data && data.chargeDate && formatDateStandard(data.chargeDate),
    data && data.amount && formatCurrency(data.amount),
    data && data.holderName,
    data && data.propertyType,
    data && data.filingDate,
    data && data.numberOfHolder,
    data && data.id
  ));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows && rows.length - page * rowsPerPage);

  useEffect(() => {
    if (getFinancialCharges) getFinancialCharges(companyId, rowsPerPage, 1);
  }, []);

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <PaginatedTable
          dataTableType="charges"
          fetchNextData={(limit, offset) => getFinancialCharges(companyId, limit, offset ? (offset / rowsPerPage) + 1 : 1)}
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

Charges.propTypes = {
  companyId: PropTypes.string,
  getFinancialCharges: PropTypes.func,
  financialCharges: PropTypes.arrayOf(PropTypes.shape({})),
  totalCount: PropTypes.number
};

Charges.defaultProps = {
  companyId: null,
  getFinancialCharges: () => { },
  financialCharges: null,
  totalCount: 0
};

export default Charges;
