import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { getConfig, getDocs } from 'app/containers/patrons/saga';
import { Context, getHashPositionValue } from 'app/utils/utils';
import BrandBanking from './sections/banking/banking';
import BrandDocumentsHandler from './sections/brandDocuments';
import BrandGST from './sections/gst';
import ErrorBoundary from '../../../../../errorBoundary';
import DialogComponent from '../../../../../components/dialogComponent/dialogComponent';
import styles from './styles.scss';

const BrandDocuments = ({ companyId, brandCode, company, position, setBreadcrumbsData }) => {
  let tabRef = null;
  const [documents, setDocuments] = useState([]);
  const [dialogConfig, setDialogConfig] = useState({});

  const tabs = [
    {
      label: 'Banking',
      containSpace: 'no',
      content: <BrandBanking companyId={companyId} brandCode={brandCode} setDialogConfig={setDialogConfig} />
    },
    {
      label: 'GST',
      containSpace: 'no',
      content: <BrandGST companyId={companyId} company={company} setDialogConfig={setDialogConfig} />
    }
  ];

  const [tabsList, setTabList] = useState([]);

  const getBrandConfig = () => {
    getConfig('BRAND').then((res) => {
      if (res.data) {
        const catArr = res.data.map((category) => ({
          label: `${category.documentCategory.name}`,
          content: <BrandDocumentsHandler config={category} getDocs={getBrandDocs} />
        }));
        urlManager([...catArr, ...tabs]);
      } else {
        urlManager(tabs);
      }
    });
  };

  const urlManager = (listOfData = tabs) => {
    setTabList(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = listOfData.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].label, position);
        } else {
          setBreadcrumbsData(listOfData[TabValue].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(listOfData[0].label, position);
      }
    }
  };

  const getBrandDocs = () => {
    getDocs(companyId, 'BRAND').then((res) => {
      if (res.data) {
        setDocuments(res.data);
      }
    });
  };

  useEffect(() => {
    getBrandDocs();
    getBrandConfig();
  }, [tabRef, company]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabsList[newValue].label, position, false, () => {}, true);
  };

  return (
    <Context.Provider value={{
      documents,
      companyId
    }}
    >
      <ErrorBoundary>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <Tabs tabList={tabsList} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} scrollable={true} />
          </Grid>
        </Grid>

        {dialogConfig.open && (
          <DialogComponent title="" onClose={() => setDialogConfig({ open: false })} closeButton={false}>
            <div className={styles.dialogContent}>
              <p className={styles.mainTitle}>
                {dialogConfig.title}
              </p>
              <p className={styles.subTitle}>
                {dialogConfig.subTitle}
              </p>
              <button type="button" className={styles.cta} onClick={() => setDialogConfig({ open: false })}>
                Done
              </button>
            </div>
          </DialogComponent>
        )}
      </ErrorBoundary>
    </Context.Provider>
  );
};

export default BrandDocuments;
