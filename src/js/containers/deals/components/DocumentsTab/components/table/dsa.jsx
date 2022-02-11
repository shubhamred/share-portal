/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { AdvanceTable } from 'app/components';
import DocumentFile from 'app/components/singleDocument/Document';
import { get } from 'lodash';
import styles from '../../styles.scss';
import { DocType, LeegalitySignerStatus } from '../../data/mockdata';

const DsaTable = ({ investorsListData = [], signedDocData = {} }) => {
  const defaultRows = 10;
  const defaultPage = 0;

  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [isTableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(defaultPage);
  const [totalDataCount, setDataCount] = useState(0);

  const signersDocData = get(signedDocData, `[${DocType.DebentureSubscription}_ESTAMP][0]`);
  const signersList = get(signersDocData, 'additionalData.leegalitySigners') || [];

  const queryParam = {
    take: rowsPerPage,
    page
  };

  const handleRowsChange = (rowNo) => {
    setRowsPerPage(rowNo);
    fetchData(rowNo, page);
  };

  const fetchData = (limit, offset) => {
    setTableLoading(true);
    queryParam.take = limit;
    queryParam.page = offset + 1;
    fetchInvestorList(queryParam)
      .then((res) => {
        setTableData(res.data);
        setDataCount(res.meta.total);
        setTableLoading(false);
      })
      .catch(() => {
        setTableLoading(false);
        setTableData([]);
        setDataCount(0);
      });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        dispatch({
          type: 'show',
          payload: 'Link copied to clipboard',
          msgType: 'success'
        });
      });
  };

  const getSignedDocumentCounts = () => {
    const signed = signersList?.filter((item) => item.status === LeegalitySignerStatus.SIGNED)?.length || 0;
    return {
      signed,
      pending: signersList?.length ? (signersList.length - signed) : 0
    };
  };

  const getStyle = (status) => {
    switch (status) {
      case LeegalitySignerStatus.PENDING:
        return styles.linkCreated;
      case LeegalitySignerStatus.SIGNED:
        return styles.signed;
      case LeegalitySignerStatus.REJECTED:
        return styles.rejected;
      case LeegalitySignerStatus.EXPIRED:
        return styles.rejected;
      default:
        return styles.signed;
    }
  };

  const getTag = (patron) => {
    if (patron.investmentCode) {
      return <span className={`${styles.tags} ${styles.patronTag}`}>Patron</span>;
    }
    return '';
    // return <span className={`${styles.tags} ${styles.trusteeTag}`}>Trustee/Signatory</span>;
  };

  const getLinksHtml = (link) => (
    <>
      <a href={link} className={styles.linkText} target="_blank" rel="noopener noreferrer">{link}</a>
      <img src="/assets/copy.svg" alt="copy" title="Copy link" onClick={() => handleCopy(link)} />
      <br />
    </>
  );

  const getFormattedTableData = () => {
    const data = signersList && signersList.map((patron) => (
      {
        party: (
          <p className={styles.personName}>
            {patron.name}
            {getTag(patron)}
          </p>
        ),
        eSignLinks: <p className={styles.linkWrapper}>{patron.signUrl ? getLinksHtml(patron.signUrl) : '--'}</p>,
        documents: (
          <p>
            {signersDocData?.files && signersDocData.files.map((file) => (
              <p className={styles.documentData}>
                <DocumentFile
                  name={file.fileName}
                  id={file.id}
                  icon="/assets/pdf.svg"
                />
              </p>
            ))}
          </p>
        ),
        signedDocs: <small className={`${styles.statusBtn} ${getStyle(patron.status)}`}>{patron.status}</small>
      }));

    const meta = {
      total: 1
    };

    return { data, meta };
  };

  const fetchInvestorList = async () => {
    const mData = await getFormattedTableData();
    return mData;
  };

  useEffect(() => {
    fetchData(rowsPerPage, page);
  }, [investorsListData]);

  const totalSignedDocCounts = getSignedDocumentCounts();
  const totalGeneratedDocCounts = totalSignedDocCounts.signed + totalSignedDocCounts.pending;

  const tableColumns = [
    {
      Header: 'Party',
      accessor: 'party',
      disableSortBy: false,
      disableFilters: true
    },
    {
      Header: 'Documents',
      accessor: 'documents',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: 'E-Sign links',
      accessor: 'eSignLinks',
      disableSortBy: true,
      disableFilters: true
    },
    {
      Header: `Signed Documents (${totalSignedDocCounts.signed || 0}/${totalGeneratedDocCounts || 0})`,
      accessor: 'signedDocs',
      disableSortBy: true,
      disableFilters: true
    }
  ];

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Grid container={true} alignItems="center" className={styles.tableContainer}>
          <AdvanceTable
            fetchNextData={(limit, offset, newPage) => fetchData(limit, newPage)}
            totalCount={totalDataCount}
            tableColumns={tableColumns}
            tableData={tableData}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
            currentPage={page}
            setPage={(pageNo) => setPage(pageNo)}
            isLoading={isTableLoading}
            isStatusCheckboxRequired={false}
            disableFilter={false}
            isPaginationRequired={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

DsaTable.propTypes = {
  investorsListData: PropTypes.array,
  signedDocData: PropTypes.object
};

DsaTable.defaultProps = {
  investorsListData: [],
  signedDocData: {}
};

export default DsaTable;
