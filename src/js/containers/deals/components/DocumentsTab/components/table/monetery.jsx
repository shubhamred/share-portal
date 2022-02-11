/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { AdvanceTable } from 'app/components';
import DocumentFile from 'app/components/singleDocument/Document';
import { removeFile, getPatronDocPresignedUrl, postDocMetaData } from 'app/containers/patrons/saga';
import FileUploader from 'app/containers/document/fileUploader';
import { useDispatch } from 'react-redux';
import { InvestmentTypes } from 'app/utils/enums';
import styles from '../../styles.scss';
import { DocType, LeegalitySignerStatus } from '../../data/mockdata';

const MoneteryTable = ({ investorsListData = [], getFilesByResource, signedDocData, getInvestorsList, metaData, getAllDocuments, docUploadConfig, getInvestmentId, deal }) => {
  const defaultRows = 20;
  const defaultPage = 0;

  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [signerTableData, setSignerTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRows);
  const [isTableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(defaultPage);
  const [totalDataCount, setDataCount] = useState(0);
  const [moneteryData, setMonetaryData] = useState([]);

  useEffect(() => {
    if (Object.keys(signedDocData)?.length) {
      setMonetaryData(signedDocData[DocType.MoneteryAndCollection] || []);
    }
  }, [signedDocData]);

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

    fetchSignerList(queryParam).then((res) => {
      setSignerTableData(res.data);
    })
      .catch(() => {
        setSignerTableData(false);
      });
  };

  const getSigners = (data = []) => {
    const { additionalData } = data[0] || {};
    const { leegalitySigners } = additionalData || {};
    return leegalitySigners || [];
  };

  // return undefined if no signers data present
  const isSignersAvailable = (data = []) => {
    const { additionalData } = data[0] || {};
    const { leegalitySigners } = additionalData || {};
    return leegalitySigners;
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

  const getLinksHtml = (link) => (
    <>
      <a href={link} className={styles.linkText} target="_blank" rel="noopener noreferrer">{link}</a>
      <img src="/assets/copy.svg" title="Copy link" alt="copy" onClick={() => handleCopy(link)} />
      <br />
    </>
  );

  const signerGroups = [];
  // eslint-disable-next-line no-unused-expressions
  investorsListData && investorsListData.forEach((patron) => {
    signerGroups.push(...getSigners(getFilesByResource(patron.patronCode)));
  });
  const trustee = signerGroups.filter((item) => !item.investmentCode);
  const trusteeDetails = (trustee && trustee[0]) || {};

  const getSignerData = (list = []) => list?.find((patron) => patron.email === trusteeDetails.email) || {};

  const getTag = (patron) => {
    if (patron.investmentCode) {
      return <span className={`${styles.tags} ${styles.patronTag}`}>Patron</span>;
    }
    return '';
    // return <span className={`${styles.tags} ${styles.trusteeTag}`}>Trustee/Signatory</span>;
  };

  const DealStatus = [
    'Draft',
    'Ready',
    'Rejected',
    'On Hold',
    'Published',
    'Fully Subscribed',
    'Document Data Missing',
    'Document Data Added',
    'Document Generate Error',
    'Document Generated',
    'Initiate Documentation'
  ];

  const handlePostMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    postDocMetaData({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      if (res?.data) {
        getAllDocuments();
      }
    });
  };

  const handleFileDelete = (fileId) => {
    removeFile(fileId).then((res) => {
      if (res.data) {
        getAllDocuments(); // Get updated documents list
      }
    });
  };

  const getFormattedTableData = () => {
    const dataList = [];
    // return investors list if there is not signers data present.
    if (moneteryData?.length && !isSignersAvailable([moneteryData[0]])) {
      // eslint-disable-next-line no-unused-expressions
      investorsListData?.map((patron) => {
        const investmentId = getInvestmentId(patron.companyCode || patron.patronCode, patron.companyCode ? InvestmentTypes.COMPANY : InvestmentTypes.INDIVIDUAL);
        dataList.push({
        party: (
          <p className={styles.cellSizeing}>
            {patron.name}
          </p>
        ),
        eSignLinks: <p className={`${styles.linkWrapper} ${styles.cellSizeing}`}>{(patron?.signUrl && getLinksHtml(patron.signUrl)) || '--'}</p>,
        documents: (
          <p>
            {getFilesByResource(patron.companyCode || patron.patronCode, patron.companyCode ? InvestmentTypes.COMPANY : InvestmentTypes.INDIVIDUAL)?.length ? (
              getFilesByResource(patron.companyCode || patron.patronCode, patron.companyCode ? InvestmentTypes.COMPANY : InvestmentTypes.INDIVIDUAL).map((item) => item?.files?.map((file) => (
                <p>
                  <DocumentFile
                    name={file.fileName}
                    id={file.id}
                    signedCopy={file.signedCopy}
                    icon="/assets/pdf.svg"
                    onDeleteClick={DealStatus.includes(deal.status) ? () => handleFileDelete(file.id) : null}
                  />
                </p>
              )))
            ) : (
              <FileUploader
                btnLabel="Upload"
                uploadedDocumentCount={null}
                resourceType="INVESTMENT"
                docCategory="INVESTMENT"
                resourceId={investmentId}
                minNumberOfFiles={1}
                getPreSignedUrl={getPatronDocPresignedUrl}
                handleSaveMetaData={handlePostMetaData}
                docType={docUploadConfig?.documentType}
              />
            )}
          </p>
        ),
        signedDocs: '--',
        signed: '--'
      });
    });
    } else {
    // eslint-disable-next-line no-unused-expressions
    moneteryData?.length && moneteryData.map((data) => (
        getSigners([data]).forEach((patron) => {
          const fileList = getFilesByResource(patron.companyCode || patron.patronCode, patron.companyCode ? InvestmentTypes.COMPANY : InvestmentTypes.INDIVIDUAL);
          const isSignedDocGenerated = fileList?.filter((item) => item.docType?.includes('SIGNED'))?.length > 0;

          // Return null when the signed docs are generated and record is of trustee
          if (isSignedDocGenerated && !(patron.investmentCode)) {
            return;
          }

          if (patron.email !== trusteeDetails?.email) {
            dataList.push({
              party: (
                <p>
                  {patron.name}
                  {getTag(patron)}
                </p>
              ),
              eSignLinks: <p className={styles.linkWrapper}>{(patron?.signUrl && getLinksHtml(patron.signUrl)) || '--'}</p>,
              documents: (
                <p>
                  {data?.files?.map((file) => (
                    <p>
                      <DocumentFile
                        name={file.fileName}
                        id={file.id}
                        signedCopy={file.signedCopy}
                        icon="/assets/pdf.svg"
                      />
                    </p>
                  ))}
                  {getFilesByResource(patron.companyCode || patron.patronCode, patron.companyCode ? InvestmentTypes.COMPANY : InvestmentTypes.INDIVIDUAL)?.map((item) => {
                    if (item.docType?.includes('SIGNED')) {
                      return item?.files?.map((file) => (
                        <p>
                          <DocumentFile
                            name={file.fileName}
                            id={file.id}
                            signedCopy={file.signedCopy}
                            icon="/assets/pdf.svg"
                          />
                        </p>
                      ));
                    }
                    return null;
                  })}
                </p>
              ),
              signedDocs: <small className={`${styles.statusBtn} ${getStyle(patron.status)}`}>{patron.status}</small>,
              signed: patron.status === LeegalitySignerStatus.SIGNED
            });
          }
        }
        )));
    }
    const meta = {
      total: metaData?.total || 1
    };
    return { data: dataList, meta };
  };

  const getSignerTableData = () => {
    const signersList = [];
  // eslint-disable-next-line no-unused-expressions
  moneteryData?.length && moneteryData.map((data) => (
      getSigners([data]).map((patron) => patron.email !== trusteeDetails?.email && signersList.push({
        party: (
          <p className={styles.cellSizeing}>
            {patron.name}
            {getTag({ ...patron, investmentCode: '' })}
          </p>
        ),
        eSignLinks: <p className={`${styles.linkWrapper} ${styles.cellSizeing}`}>{(getSignerData(getSigners([data]))?.signUrl && getLinksHtml(getSignerData(getSigners([data]))?.signUrl)) || '--'}</p>,
        documents: (
          <p className={styles.cellSizeing}>
            {data?.files?.map((file) => (
              <p className={`${styles.documentData} ${styles.cellSizeing}`}>
                <DocumentFile
                  name={file.fileName}
                  id={file.id}
                  signedCopy={file.signedCopy}
                  icon="/assets/pdf.svg"
                />
              </p>
            ))}
          </p>
        ),
        signedDocs: <small className={`${styles.statusBtn} ${getStyle(getSignerData(getSigners([data]))?.status)}`}>{getSignerData(getSigners([data]))?.status}</small>,
        signed: getSignerData(getSigners([data]))?.status === LeegalitySignerStatus.SIGNED
      }))));
  const meta = {
    total: 1
  };
  return { data: signersList, meta };
  };

  const fetchInvestorList = async () => {
    const mData = await getFormattedTableData();
    return mData;
  };

  const fetchSignerList = async () => {
    const mData = await getSignerTableData();
    return mData;
  };

  useEffect(() => {
    fetchData(rowsPerPage, page);
  }, [moneteryData, investorsListData, signedDocData]);

  const tableColumns = [
    {
      Header: 'Party',
      accessor: 'party',
      disableSortBy: true,
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
      Header: `Signed Documents (${tableData?.filter((item) => item.signed)?.length || 0}/${tableData?.length || 0})`,
      accessor: 'signedDocs',
      disableSortBy: true,
      disableFilters: true
    }
  ];

  const signerTableColumn = [
    {
      Header: 'Party',
      accessor: 'party',
      disableSortBy: true,
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
      Header: `Signed Documents (${signerTableData?.filter((item) => item.signed)?.length || 0}/${signerTableData?.length || 0})`,
      accessor: 'signedDocs',
      disableSortBy: true,
      disableFilters: true
    }
  ];

  return (
    <Grid container={true}>
      {tableData?.length > 0 ? (
        <Grid item={true} xs={12}>
          <p className={styles.tableTitle}>Patron Signing links</p>
          <Grid
            container={true}
            alignItems="center"
            className={styles.tableContainer}
          >
            <AdvanceTable
              fetchNextData={(limit, offset, newPage) => getInvestorsList({ take: limit, page: newPage + 1 })}
              totalCount={totalDataCount}
              tableColumns={tableColumns}
              tableData={tableData}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
              rowsPerPageOptions={[]}
              currentPage={page}
              setPage={(pageNo) => setPage(pageNo)}
              isLoading={isTableLoading}
              isStatusCheckboxRequired={false}
              disableFilter={false}
              isPaginationRequired={true}
            />
          </Grid>
        </Grid>
      ) : null}

      <div className={styles.tableSeperator} />

      {signerTableData?.length > 0 && trusteeDetails?.name && (
        <Grid item={true} xs={12}>
          <p className={styles.tableTitle}>
            Trustee:
            {` `}
            {trusteeDetails?.name || ''}
          </p>
          <Grid
            container={true}
            alignItems="center"
            className={styles.tableContainer}
          >
            <AdvanceTable
              fetchNextData={(limit, offset, newPage) => getInvestorsList({ take: limit, page: newPage + 1 })}
              totalCount={totalDataCount}
              tableColumns={signerTableColumn}
              tableData={signerTableData}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={(rowNo) => handleRowsChange(rowNo)}
              rowsPerPageOptions={[]}
              currentPage={page}
              setPage={(pageNo) => setPage(pageNo)}
              isLoading={isTableLoading}
              isStatusCheckboxRequired={false}
              disableFilter={false}
              isPaginationRequired={true}
            />
          </Grid>
        </Grid>
      )}

    </Grid>
  );
};

export default MoneteryTable;
