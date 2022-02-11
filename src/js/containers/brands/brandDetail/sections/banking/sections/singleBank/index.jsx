import React, { useEffect, useState } from 'react';
import { Grid, TextField, Divider } from '@material-ui/core';
import {
  // getAccountTransactions,
  getMonthlyAccountSummaries
} from 'app/containers/brands/saga';
import { getDocs } from 'app/containers/patrons/saga';
import { groupBy, startCase } from 'lodash';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { SingleDocument } from 'app/components';
import { getVerifiedImage } from 'app/utils/utils';
import styles from '../../styles.scss';
import AccountTransactionsSection from './accountTransactions';
import ChequeDetails from './chequeDetails';

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

const SingleBankAccountDetail = (props) => {
  const { account } = props;

  const [monthlySummary, setMonthlySummary] = useState('');
  const [files, setFiles] = useState({});
  // const [transactions, setTransactions] = useState([]);

  const query = {
    where: { bankAccountId: '' },
    take: 50,
    page: 1
  };

  const getData = () => {
    query.where.bankAccountId = account.id;
    // getAccountSummaries(query).then((res) => {
    //   // eslint-disable-next-line no-console
    //   console.log('getAccountSummaries', res);
    //   if (res.data && res.data.length) {
    //     setSummaryData(res.data);
    //   }
    // });

    getMonthlyAccountSummaries(query).then((res) => {
      // console.log('getMonthlyAccountSummaries', res);
      if (res.data && res.data.length) {
        setMonthlySummary(res.data);
      }
    });

    // getAccountTransactions(query).then((res) => {
    //   if (res.data && res.data.length) {
    //     setTransactions(res.data);
    //   }
    // });
    getDocs(account.id, 'BANK_ACCOUNT').then((res) => {
      if (res.data) {
        const filteredFiles = res.data.filter(
          (doc) => doc.docType !== 'BANK_STATEMENT'
        );
        if (filteredFiles.length) {
          const groupedDocs = groupBy(filteredFiles, 'docType');
          setFiles(groupedDocs);
        }
      }
    });
  };

  useEffect(() => {
    if (account?.id) {
      getData();
    }
  }, [account]);

  if (!monthlySummary.length) {
    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <p>
            {' '}
            { account?.bank?.name }
            {' '}
            -
            {' '}
            <span style={subTitle}>
              { account?.accountNumber }
              {
                account.isAccountVerified ? (
                  <>
                    { getVerifiedImage(account, 'isAccountVerified') }
                    Verified from Perfios
                  </>
                ) : null
              }
            </span>
            {' '}
          </p>
        </Grid>
        <Grid item={true} xs={12}>
          <p>No data found</p>
        </Grid>
        <Grid item={true} xs={12}>
          <p>To get Transaction details from Finbit check Documents Section</p>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Grid container={true}>
          <Grid item={true} xs={4} className={styles.inputWrapper}>
            <TextField
              label="Name of the Bank"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={account?.bank?.name}
            />
          </Grid>
          <Grid item={true} xs={4} className={styles.inputWrapper}>
            <TextField
              label="Account Number"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={account.accountNumber}
            />
          </Grid>
          <Grid item={true} xs={4} className={styles.inputWrapper}>
            <TextField
              label="Account Type"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={account.accountType}
            />
          </Grid>
          <Grid item={true} xs={4} className={styles.inputWrapper}>
            <TextField
              label="IFSC Code"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={account.ifsc}
            />
          </Grid>
          <Grid item={true} xs={4} className={styles.inputWrapper}>
            <TextField
              label="Address"
              InputLabelProps={{ shrink: true }}
              disabled={true}
              value={account.address}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item={true} xs={12} className={styles.inputWrapper}>
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
                  <Grid container={true} alignItems="center" item={true} xs={12}>
                    <Grid item={true} xs={12}>
                      <p>
                        {startCase(key)}
                        :
                      </p>
                    </Grid>
                    {value[0].files.map((statement) => (
                      <Grid
                        item={true}
                        xs={4}
                        key={statement.id}
                        style={{ marginBottom: '10px' }}
                      >
                        <SingleDocument
                          name={statement.fileName}
                          id={statement.id}
                        />
                      </Grid>
                    ))}
                    <Divider width="100%" style={{ margin: '15px 0' }} />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </Grid>
      <Grid item={true} xs={12} className={styles.inputWrapper}>
        <Divider width="100%" />
      </Grid>
      <Grid item={true} xs={12}>
        <AccountTransactionsSection type="Credit" summary={monthlySummary} />
      </Grid>
      <Grid item={true} xs={12}>
        <AccountTransactionsSection type="Debit" summary={monthlySummary} />
      </Grid>
      <Grid item={true} xs={12}>
        <ChequeDetails summary={monthlySummary} />
      </Grid>
    </Grid>
  );
};

export default SingleBankAccountDetail;
