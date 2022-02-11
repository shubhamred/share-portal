import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import UploadButton from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { TableCustom } from 'app/components';
import { uploadShareHoldingCSV } from 'app/containers/brands/saga';

import ShareholdingSummary from './shareholdingSummary';
import SecurityAllotment from './securityAllotment';

import styles from './styles.scss';

const Shareholding = (props) => {
  const { companyId, getFinancialShareholding, company, getFinancialDetail } = props;
  const { companyCode, additionalData } = company || {};

  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hiddenFileInput = React.useRef(null);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [totalDataCount, setDataCount] = useState(0);
  const tableColumns = [{ Header: 'Year', accessor: 'shareholdingYear', disableSortBy: true }, { Header: 'Total Equity', accessor: 'totalEquityShares', disableSortBy: true }, { Header: 'Total Preference Shares', accessor: 'totalPreferenceShares', disableSortBy: true }, { Header: 'Promoter', accessor: 'promoter', disableSortBy: true }, { Header: 'Total', accessor: 'total', disableSortBy: true }];
  const ShareHoldingPatternColumns = [
    { Header: 'Share Holder Name', accessor: 'shareholderName', disableSortBy: true },
    { Header: 'No. of Shares', accessor: 'numberOfShares', disableSortBy: true },
    { Header: 'Share Holding (%)', accessor: 'shareholdingPercentage', disableSortBy: true }
  ];

  const { shareholdingData } = additionalData || {};

  useEffect(() => {
    fetchData(rowsPerPage, 0, 0);
  }, []);

  const getShareHoldingPatternData = () => shareholdingData || [];

  const fetchData = (limit, offset, newPage) => {
    setTableLoading(true);
    getFinancialShareholding(companyId, limit, newPage + 1).then((res) => {
      setTableData(res.data);
      setDataCount(res.meta.total);
      setTableLoading(false);
    });
  };

  const handleFileUpload = () => {
    hiddenFileInput.current.click();
  };

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleFileChange = async (e) => {
    const mData = await getBase64(e.target.files[0]);

    if (mData) {
      try {
        const response = await uploadShareHoldingCSV({ file: mData, brandCode: companyCode });
        if (response?.invalidData?.length) {
          dispatch({
            type: 'show',
            payload: `Failed to upload some of the record(s)`,
            msgType: 'error'
          });
          return;
        }
        dispatch({
          type: 'show',
          payload: `Shareholding data uploaded successfully`,
          msgType: 'success'
        });
        getFinancialDetail(companyId); // fetch new data
      } catch (ex) {
        dispatch({
          type: 'show',
          payload: `Something went wrong while uploading Shareholding data`,
          msgType: 'error'
        });
      }
    }
  };

  return (
    <Grid className={styles.loginWrapper} direction="column" container={true}>
      <Grid container={true}>
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <Grid container={true} justify="space-between" style={{ marginBottom: '15px' }}>
            <Grid item={true} xs={4}>
              <Typography>
                Shareholding Pattern
              </Typography>
            </Grid>
            <Grid item={true}>
              <input
                type="file"
                accept=".csv"
                ref={hiddenFileInput}
                onChange={handleFileChange}
                className={styles.hideFile}
              />
              <UploadButton
                color="default"
                startIcon={<CloudUploadIcon className={styles.uploadBtnIcon} />}
                onClick={handleFileUpload}
                className={styles.uploadBtn}
              >
                Upload Shareholding
              </UploadButton>
            </Grid>
          </Grid>
          <TableCustom
            fetchNextData={(limit, offset, newPage) => fetchData(limit, offset, newPage)}
            totalCount={totalDataCount}
            tableColumns={ShareHoldingPatternColumns}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
            currentPage={page}
            tableData={getShareHoldingPatternData()}
            setPage={(pageNo) => setPage(pageNo)}
            isLoading={isTableLoading}
          />
        </Grid>
        {tableData?.length ? (
          <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
            <Typography>
              Shareholding
            </Typography>
            <TableCustom
              fetchNextData={(limit, offset, newPage) => fetchData(limit, offset, newPage)}
              totalCount={totalDataCount}
              tableColumns={tableColumns}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
              currentPage={page}
              tableData={tableData}
              setPage={(pageNo) => setPage(pageNo)}
              isLoading={isTableLoading}
            />
          </Grid>
        ) : ''}
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <ShareholdingSummary companyId={companyId} />
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: '30px' }}>
          <SecurityAllotment companyId={companyId} />
        </Grid>
      </Grid>
    </Grid>
  );
};

Shareholding.propTypes = {
  companyId: PropTypes.string,
  getFinancialShareholding: PropTypes.func
};

Shareholding.defaultProps = {
  companyId: null,
  getFinancialShareholding: () => { }
};

export default Shareholding;
