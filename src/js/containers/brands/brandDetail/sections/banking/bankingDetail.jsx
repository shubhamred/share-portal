import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Banking from 'app/containers/brands/brandDetail/forms/banking';
import SingleBankAccountDetail from 'app/containers/brands/brandDetail/sections/banking/sections/singleBank';
import { getVerifiedImage, getHashPositionValue } from 'app/utils/utils';
import { getBanks } from 'app/containers/applications/saga';
import styles from './styles.scss';
import { Tabs } from '../../../../../components';
import { getAccounts, setBanksList, clearAccounts } from '../../../saga';
// import BankingConsolidated from './sections';

const BankingDetail = (props) => {
  const { brandId } = useParams();
  let tabRef = null;
  const { getBankingDetail, resourceId, position, setBreadcrumbsData, brandCode } = props;
  const accounts = useSelector((state) => state.brandReducer.accounts);

  const bankingTabs = [
    {
      label: 'Bank Accounts',
      sLable: 'Bank Accounts',
      content: <Banking brandCode={brandCode} resourceId={resourceId} />
    }
    // {
    //   label: 'Consolidated',
    //   content: <BankingConsolidated />
    // }
  ];
  const [tabs, setTabs] = useState([]);

  const bankHandler = (isAvalible = true, data = [], page = 1) => {
    if (isAvalible) {
      const params = {
        fields: 'id,code,name',
        page,
        take: 100
      };
      getBanks(params).then((res) => {
        if (res?.data?.length) {
          const totalReacod = (res?.meta?.total || 0);
          if (totalReacod > (data.length + res.data.length)) {
            bankHandler(true, [...data, ...res.data], page + 1);
          } else {
            bankHandler(false, [...data, ...res.data]);
          }
        } else {
          bankHandler(false, [...data]);
        }
      }).catch(() => {
        bankHandler(false, []);
      });
    } else {
      setBanksList({ data });
    }
  };

  useEffect(() => {
    if (accounts?.length) {
      // console.log('accounts', { accounts });
      const tempTabs = accounts.map((account) => ({
        label: (
          <div className={styles.bankNameWrapper}>
            {account?.bank?.code}
            {' '}
            {account.accountType ? account.accountType : ''}
            {' '}
            {account.accountNumber
              ? account.accountNumber.substr(account.accountNumber.length - 4)
              : ''}
            {' '}
            {getVerifiedImage(account, 'isAccountVerified')}
          </div>
        ),
        sLable: `${account?.bank?.code} ${account.accountType ? account.accountType : ''} ${account.accountNumber ? account.accountNumber.substr(account.accountNumber.length - 4) : ''}`,
        content: <SingleBankAccountDetail account={account} />
      }));
      urlManager([...bankingTabs, ...tempTabs]);
    }
  }, [accounts]);

  useEffect(() => {
    if (getBankingDetail && brandId) getBankingDetail(brandId);
    bankHandler();
  }, []);

  // Clear accounts data in store componentWillUnmount
  useEffect(() => () => clearAccounts(), []);

  useEffect(() => {
    if (brandCode) {
      getAccounts(brandCode).then((data) => {
        if (data?.data?.length) {
          const tempTabs = data.data.map((account) => ({
            label: (
              <div className={styles.bankNameWrapper}>
                {account?.bank?.code}
                {' '}
                {account.accountType ? account.accountType : ''}
                {' '}
                {account.accountNumber
                  ? account.accountNumber.substr(account.accountNumber.length - 4)
                  : ''}
                {' '}
                {getVerifiedImage(account, 'isAccountVerified')}
              </div>
            ),
            sLable: `${account?.bank?.code} ${account.accountType ? account.accountType : ''} ${account.accountNumber ? account.accountNumber.substr(account.accountNumber.length - 4) : ''}`,
            content: <SingleBankAccountDetail account={account} />
          }));
          urlManager([...bankingTabs, ...tempTabs]);
        } else {
          urlManager([...bankingTabs]);
        }
      });
    }
  }, [tabRef, brandCode]);

  const urlManager = (listOfData = bankingTabs) => {
    setTabs(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = listOfData.findIndex((list) => list.sLable.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].sLable, position);
        } else {
          setBreadcrumbsData(listOfData[TabValue].sLable, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(listOfData[0].sLable, position);
      }
    }
  };

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabs[newValue].sLable, position, false, () => {}, true);
  };

  return (
    <Grid
      container={true}
      className={styles.wrapper}
      wrap="nowrap"
      direction="row"
    >
      <Grid
        // className={styles.contentWrapper}
        container={true}
        item={true}
        direction="row"
      >
        <Tabs tabList={tabs} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} scrollable={true} />
      </Grid>
    </Grid>
  );
};

BankingDetail.propTypes = {
  bankingDetail: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string
  }),
  getBankingDetail: PropTypes.func
};

BankingDetail.defaultProps = {
  bankingDetail: null,
  getBankingDetail: () => {}
};

export default BankingDetail;
