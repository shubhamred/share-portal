import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { DialogComponent } from 'app/components';
import {
  createBrandConfig,
  fetchBrandConfig
} from 'app/containers/brands/saga';
import AddIcon from '@material-ui/icons/Add';
import PartnersList from './partnersList';
import KotakPartner from './KotakPartner';
import AddPartner from './addPartners';
import styles from '../../styles.scss';

const Partners = (porps) => {
  const { company } = porps;
  const dispatch = useDispatch();
  const IMGS = {
    cashfree: '/assets/cashfree.svg',
    razorpay: '/assets/razorpay.svg',
    kotak: '/assets/kotak.svg'
  };
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [partnersList, setPartnersList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [company]);

  const getImage = (vendor) => {
    switch (vendor) {
      case 'razorpay':
        return IMGS.razorpay;
      case 'cashfree':
        return IMGS.cashfree;
      case 'kotak':
        return IMGS.kotak;
      default:
        return IMGS.razorpay;
    }
  };

  const partnersConfig = (partnersArray) => {
    if (partnersArray?.length) {
      const mData = partnersArray.map((partner) => {
        let activeAccounts = 0;
        let totalSplit = 0;
        let brandSplit = 100;
        let isBrandAccount = false;
        let isNBFCAccount = false;
        if (partner?.accounts?.length && partner.vendor !== 'kotak') {
          for (let index = 0; index < partner.accounts.length; index += 1) {
            activeAccounts = partner.accounts[index].isActive
              ? activeAccounts + 1
              : activeAccounts;
            totalSplit = partner.accounts[index].split + totalSplit;
          }
        }
        if (partner.vendor === 'kotak' && Object.keys(partner?.brandAccount)?.length) {
          activeAccounts = partner?.brandAccount.isActive ? activeAccounts + 1 : activeAccounts;
          isBrandAccount = true;
        }
        if (partner.vendor === 'kotak' && Object.keys(partner?.accounts)?.length) {
          isNBFCAccount = true;
          Object.keys(partner?.accounts).forEach((account) => {
            activeAccounts = partner?.accounts[account].isActive
              ? activeAccounts + 1
              : activeAccounts;
          });
          if (Object.keys(partner?.applications)?.length) {
            Object.keys(partner?.applications).forEach((application) => {
              totalSplit = partner?.applications[application].split + totalSplit;
              brandSplit -= partner?.applications[application].split.toFixed(2);
            });
          }
        }
        return {
          ...partner,
          img: getImage(partner.vendor),
          alt: partner.vendor,
          activeAccounts: activeAccounts === 0 ? '-' : activeAccounts,
          totalSplit: totalSplit === 0 ? 0 : totalSplit,
          brandSplit,
          isBrandAccount,
          isNBFCAccount
        };
      });
      setPartnersList(mData);
    }
  };

  const onSubmit = async (value) => {
    const payload = {
      brandCode: company?.company?.companyCode,
      ...(value.vendor === 'kotak'
        ? { brandName: company?.company?.businessName }
        : {}),
      ...value
    };
    const data = await createBrandConfig(payload);
    if (data) {
      if (data.data) {
        fetchData();
        dispatch({
          type: 'show',
          payload: data.message,
          msgType: 'success'
        });
      } else {
        const errorMsg = data.error ? JSON.parse(data.error)?.message : '';
        dispatch({
          type: 'show',
          payload: errorMsg || data.message,
          msgType: 'error'
        });
      }
      setDialogueOpen(false);
    }
  };

  const fetchData = () => {
    fetchBrandConfig(company?.company?.companyCode).then((response) => {
      partnersConfig(response?.data?.configs || []);
    });
  };

  const renderPartners = (list) => {
    switch (true) {
      case list.vendor === 'kotak':
        return (
          <KotakPartner
            list={list}
            vendor={list.vendor}
            brandId={company?.company?.id}
            brandCode={company?.company?.companyCode}
            fetchData={fetchData}
          />
        );

      default:
        return (
          <PartnersList
            list={list}
            brandId={company?.company?.id}
            brandCode={company?.company?.companyCode}
            fetchData={fetchData}
          />
        );
    }
  };

  return (
    <Grid container={true}>
      <Grid
        item={true}
        xs={12}
        container={true}
        justify="space-between"
        className={styles.mb10}
      >
        <Grid className={styles.headerText}>Partners</Grid>
        <Button
          variant="outlined"
          color="primary"
          className={styles.fontWeight600}
          startIcon={<AddIcon />}
          onClick={() => setDialogueOpen(true)}
        >
          Add Partner
        </Button>
      </Grid>
      <Grid
        item={true}
        xs={12}
        className={`${styles.margintop20} ${styles.accordionBackground}`}
      >
        {partnersList?.length > 0 ? partnersList.map((list) => (
          renderPartners(list)
        )) : (
          <Grid>No Partners Found</Grid>
        )}
      </Grid>
      {dialogueOpen && (
        <DialogComponent
          title="Add Partner"
          onClose={() => setDialogueOpen(false)}
        >
          <AddPartner
            onSubmit={onSubmit}
            brandDetail={company || {}}
            onClose={() => setDialogueOpen(false)}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default Partners;
