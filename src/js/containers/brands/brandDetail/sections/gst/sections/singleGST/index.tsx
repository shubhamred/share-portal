import * as React from 'react';
import { Divider, Grid } from '@material-ui/core';
import { getCompanyGstTransactions } from 'app/containers/brands/saga';
import { SingleDocument, TableCustom } from 'app/components';
import moment from 'moment';
import { formatCurrency, getVerifiedImage } from 'app/utils/utils';
import { getDocs } from 'app/containers/patrons/saga';
import { groupBy, startCase } from 'lodash';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getStateName } from 'app/containers/brands/brandDetail/sections/gst/sections/addGst/gstStatesList';

const accTitle = {
  color: '#1518AF',
  margin: 0,
  fontSize: '18px',
  fontWeight: 600
};

const subTitle = {
  width: '60%',
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '10px',
  color: '#7a7c75'
};

const accRoot = {
  boxShadow: '2px 3px 6px 1px rgba(164, 164, 164, 0.2)'
};

type IndividualGSTTS = {
  gstId: string;
  gst: any;
};

type GetDataTS = (rowLimit: number, rowsPage: number) => void;

const IndividualGST: React.FC<IndividualGSTTS> = (props) => {
  const { gstId, gst: gstDetail } = props;

  const [gst, setGstDetails] = React.useState([]);
  const [isTableLoading, setTableLoading] = React.useState<boolean>(true);
  const [totalDataCount, setDataCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [files, setFiles] = React.useState({});

  const columns = [
    {
      Header: 'Month',
      accessor: 'returnPeriod',
      disableSortBy: true,
      Cell: (row: any) => moment(row.value).format('MMM YY')
    },
    {
      Header: 'Revenue',
      accessor: 'gstr3bTotalTaxableValue',
      disableSortBy: true,
      Cell: (row: any) => (row.value ? formatCurrency(row.value) : 'N/A')
    },
    {
      Header: 'Tax',
      accessor: 'gstr3bTotalTax',
      disableSortBy: true,
      Cell: (row: any) => (row.value ? formatCurrency(row.value) : 'N/A')
    }
  ];

  const getData: GetDataTS = (rowLimit, rowsPage) => {
    setTableLoading(true);
    const query = {
      where: { companyGstDetailId: gstId },
      order: { returnPeriod: 'DESC' },
      take: rowLimit,
      page: rowsPage
    };
    getCompanyGstTransactions(query).then((res) => {
      setTableLoading(false);
      if (res.data) {
        setGstDetails(res.data);
        setDataCount(res.meta.total);
      }
    });
  };

  const getDocuments = () => {
    getDocs(gstId, 'GST').then((res) => {
      if (res.data) {
        const filteredFiles = res.data.filter((doc: any) => doc?.docType !== 'GST');
        if (filteredFiles.length) {
          const groupedDocs = groupBy(filteredFiles, 'docType');
          setFiles(groupedDocs);
        }
      }
    });
  };

  React.useEffect(() => {
    if (gstId) getData(rowsPerPage, page + 1);
    if (gstId) getDocuments();
  }, [gstId]);

  if (!gst.length && !Object.keys(files).length) {
    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <p>
            {getStateName(gstDetail?.stateCode)}
            -
            <span style={subTitle}>
              {gstDetail?.gstin}
              {gstDetail.isVerified ? (
                <>
                  {getVerifiedImage(gstDetail, 'isVerified')}
                  Verified from Perfios
                </>
              ) : null}
            </span>
          </p>
        </Grid>
        <Grid item={true} xs={12}>
          <p>No data found</p>
        </Grid>
        <Grid item={true} xs={12}>
          <p>To get GST details from Perfios check Documents Section</p>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <p>
          {getStateName(gstDetail?.stateCode)}
          -
          <span style={subTitle}>
            {gstDetail?.gstin}
            {gstDetail.isVerified ? (
              <>
                {getVerifiedImage(gstDetail, 'isVerified')}
                Verified from Perfios
              </>
            ) : null}
          </span>
        </p>
      </Grid>
      <Grid item={true} xs={12} style={{ margin: '15px 0' }}>
        {Object.keys(files).length ? (
          <Accordion style={accRoot}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <p style={accTitle}>Documents</p>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container={true} item={true} xs={12}>
                {Object.entries(files).map(([key, value]) => (
                  <Grid
                    container={true}
                    alignItems="center"
                    item={true}
                    xs={12}
                  >
                    <Grid item={true} xs={12}>
                      <p>
                        {startCase(key)}
                        :
                      </p>
                    </Grid>
                    {value && Array.isArray(value) && value?.length
                      ? value[0].files.map((statement: any) => (
                        <Grid
                          item={true}
                          xs={4}
                          key={statement?.id || ''}
                          style={{ marginBottom: '10px' }}
                        >
                          <SingleDocument
                            name={statement?.fileName || ''}
                            id={statement?.id || ''}
                          />
                        </Grid>
                      ))
                      : null}
                    <Divider variant="fullWidth" style={{ margin: '15px 0' }} />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Grid>
      <Grid item={true} xs={12} style={{ margin: '15px 0' }}>
        <TableCustom
          tableColumns={columns}
          tableData={gst}
          rowsPerPage={rowsPerPage}
          isLoading={isTableLoading}
          totalCount={totalDataCount}
          setRowsPerPage={(rowNo) => setRowsPerPage(rowNo)}
          currentPage={page}
          setPage={(pageNo) => setPage(pageNo)}
          fetchNextData={(limit, offset, newPage) => getData(limit, newPage + 1)}
        />
      </Grid>
    </Grid>
  );
};
export default IndividualGST;
