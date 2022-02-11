import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { AdvanceTable, FileUploader, CustomeHeader } from 'app/components';
import { formatCurrency, formatDateStandard } from 'app/utils/utils';
import { getConfiguredDocumentTypes } from 'app/containers/docsService/saga';
import { getConfig, uploadProjections, getRevenueProjections } from 'app/containers/repayments/saga';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from 'app/react-auth0-spa';
import { deleteProjections, getPatronDocPresignedUrl, postMetaData, viewImage } from 'app/containers/patrons/saga';

const toolbarButtonStyles = {
  fontWeight: 600
};

const ProjectionsComponent = (props) => {
  const { dealId, patronId } = props;
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const docConfig = useSelector((state) => state.repaymentsReducer.docConfig);
  const defaultColumns = [
    {
      Header: 'Tenure Month',
      accessor: 'tenureMonth',
      disableSortBy: true
    },
    {
      Header: 'Revenue Share Month',
      accessor: 'revenueMonth',
      disableSortBy: true,
      Cell: (row) => formatDateStandard(row.value)
    },
    {
      Header: 'Expected Revenue',
      accessor: 'expectedRevenue',
      disableSortBy: true,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Revenue Share (%)',
      accessor: 'revenueShare',
      disableSortBy: true
    },
    {
      Header: 'Revenue Shares Expected',
      accessor: 'expectedRevenueShare',
      disableSortBy: true,
      Cell: (row) => formatCurrency(row.value)
    },
    {
      Header: 'Cumulative Revenue Shares Expected',
      accessor: 'expectedCumulativeRevenueShare',
      disableSortBy: true,
      Cell: (row) => formatCurrency(row.value)
    }
  ];
  const [isTableLoading, setTableLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [tableColumns, setTableColumns] = useState(defaultColumns);
  const [tableRows, setTableData] = useState([]);
  const [uploadConfig, setUploadConfig] = useState(null);
  const FILE_UPLOAD_KEY = 'BULK_PATRON_IMPORT';

  useEffect(() => {
    if (docConfig?.length) {
      const patronUploadConfig = docConfig && docConfig.find((cate) => {
        const { documentCategory } = cate;
        return documentCategory.key === 'PATRON';
      });
      if (patronUploadConfig) {
        getConfiguredDocumentTypes('PORTAL', patronUploadConfig.documentCategoryId).then((res) => {
          if (res?.data?.length) {
            const uploadConfigData = res.data.find(
              (config) => config.documentType.key === FILE_UPLOAD_KEY
            );
            setUploadConfig(uploadConfigData);
          }
        });
      }
    }
  }, [docConfig]);

  const queryParam = {
    order: { createdAt: 'DESC' },
    where: {}
  };
  const [queryParams, setQueryParams] = useState(queryParam);

  useEffect(() => {
    dispatch({ type: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_INIT' });

    if (dealId) return;
    if (patronId) {
      // setTableColumns([...extraColumns, ...defaultColumns]);
      // return;
    }
    // setTableColumns([...extraColumns, ...defaultColumns]);
  }, []);

  useEffect(() => {
    if (dealId) {
      queryParams.where.dealId = dealId;
      setQueryParams(queryParams);
    }
    queryParams.page = page + 1;
    queryParams.take = rowsPerPage;
    fetchData(queryParams);
  }, []);

  const fetchData = (query) => {
    setTableLoading(true);
    getRevenueProjections(query).then((res) => {
      if (res.data) {
        setTableData(res.data);
        setTotalCount(res.meta.total);
        if (res.data.length) {
          dispatch({ type: 'REPAYMENT_DOCUMENT_CONFIG_FETCH_INIT' });
        }
      } else {
        setTableData([]);
        setTotalCount(0);
      }
      if (res.statusCode === 404) {
        if (dealId) {
          getConfig('PORTAL');
        }
      }
      setTableLoading(false);
    });
  };

  const handleDeleteProjections = () => {
    deleteProjections(dealId)
      .then(() => {
        fetchData(queryParams);
        dispatch({ type: 'show', payload: 'Projections deleted successfully', msgType: 'success' });
      })
      .catch(() => {
        fetchData(queryParams);
        dispatch({ type: 'show', payload: 'Failed to delete Projections, please try again later', msgType: 'error' });
      });
  };

  const saveMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    postMetaData({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      viewImage(res.data.id, false).then((csvdata) => {
        uploadProjections(csvdata.data.url).then(() => {
          fetchData(queryParams);
        });
      });
    });
  };
  const toolBarActions = [
    {
      component: (
        <>
          {uploadConfig && (
            <FileUploader
              uploadedDocumentCount={null}
              resourceType="PORTAL"
              docCategory="PATRON"
              resourceId={user['https://klubworks.com/user_id']}
              minNumberOfFiles={1}
              getPreSignedUrl={getPatronDocPresignedUrl}
              handleSaveMetaData={saveMetaData}
              docType={uploadConfig.documentType}
              btnLabel="Upload Projections"
            />
          )}
        </>
      )
    },
    {
      component: (
        <>
          {!!tableRows?.length && (
            <Button style={toolbarButtonStyles} onClick={handleDeleteProjections} startIcon={<HighlightOffIcon />}>Delete Projections</Button>
          )}
        </>
      )
    }
  ];

  const handleTableUpdate = (limit, offset) => {
    queryParams.take = limit;
    queryParams.page = offset + 1;
    fetchData(queryParams);
  };

  return (
    <Grid container={true} xs={12}>
      <Grid item={true} xs={12}>
        <CustomeHeader
          pageName="Projections"
          isFilter={false}
          isSearch={false}
          actions={toolBarActions}
          customColumns={{ left: 5, right: 6 }}
        />
      </Grid>
      <Grid item={true} xs={12}>
        <AdvanceTable
          fetchNextData={(limit, offset, newPage) => handleTableUpdate(limit, newPage)}
          tableColumns={tableColumns}
          tableData={tableRows}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          isStatusCheckboxRequired={false}
          handleRowClick={() => {}}
          isLoading={isTableLoading}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(ProjectionsComponent);
