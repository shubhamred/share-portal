/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// eslint-disable-next-line no-unused-vars
import { Grid, ButtonBase } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { getParameterValuesFromHash, getHashPositionValue } from 'app/utils/utils';
import useHashRouting from 'app/hooks/useHashRouting';
// import Documents from './forms/document';
import {
  NavBarComponent,
  Button,
  DialogComponent,
  Drawer,
  Breadcrumb
} from '../../../components';
import DealList from '../../deals/dealList';
import PerformanceInfoForm from './forms/performanceInfoForm';
// import Applicant from './forms/applicant';
import BusinessInfo from './forms/businessInfoForm';
// import Banking from './forms/banking';
import Dialog from './components/dialog';
import RemarkDialog from '../../remarks';
import CreateForm from './forms/createDealForm';
// import CompanyApplicant from '../../shared/companyApplicant';
import CompanyApplications from './sections/companyApplications';
// import BusinessInfo from './forms/businessInfoForm/businessInfoForm';
import BankingDetail from './sections/banking/bankingDetail';
import FinancialDetail from './sections/financial/financialDetail';
import PointList from '../../loyalty/points';
import RewardList from '../../loyalty/rewards';
import styles from './styles.scss';
import globalStyles from '../../global.scss';
import rootStyles from '../../../rootStyles.scss';
import BrandDocuments from './sections/documents';
import Repayment from './sections/repayment';
import BrandGst from './sections/gst';
import AdData from './sections/adData';
import PgData from './sections/pgData';
import COD from './sections/cod';
import Marketplace from './sections/marketplace';
import WithBreadcrumb from '../../../hoc/breadcrumbWrapper';
import PosData from './sections/posData';

const BrandDetail = (props) => {
  const { brandDetail, getBrandDetail, updateBrandStatus, createDealForm, BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const paramValues = getParameterValuesFromHash('/brands/:brandId');
  const { brandId } = paramValues;
  const brandSections = [
    'Business',
    // 'Applicant',
    'Applications',
    'Performance',
    'Documents',
    {
      isSub: true,
      name: 'Data',
      list: ['Banking', 'GST', 'Financial', 'Marketplace', 'COD', 'PG Data', 'PoS Data', 'Ad Data']
    },
    'Rewards',
    'Points',
    'Deals',
    'Repayment'
  ];

  const hendleNavigationTab = (name) => {
    setSelectedSection(name);
    setBreadcrumbsData(name, 2, true, () => {}, true);
  };

  useEffect(() => {
    const mData = getHashPositionValue(0);
    if (mData) {
      defaultHashHandler();
      const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
      const TabValue = brandSections.find((list) => {
        if (typeof list === 'object') {
          const isMatch = list.list.find((row) => row.match(re) !== null);
          if (isMatch) {
            return true;
          }
          return false;
        }
        return list.match(re) !== null;
      });
      if (TabValue) {
        if (typeof TabValue === 'object') {
          const tabData = TabValue.list.find((row) => row.match(re) !== null);
          setSelectedSection(tabData);
        } else {
          setSelectedSection(TabValue);
        }
      } else {
        hendleNavigationTab('Business');
      }
    } else {
      hendleNavigationTab('Business');
    }
  }, []);

  useEffect(() => {
    setBreadcrumbsData(brandDetail?.company?.businessName, 1, false, () => hendleNavigationTab('Business'));
  }, [brandDetail]);

  const [selectedSection, setSelectedSection] = useState('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openRemarkDialog, setRemarkDialog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [applicationList, setApplicationList] = useState(null);

  const statusLabel = (
    <div className={styles.statusWrapper}>
      {`Status : ${brandDetail && brandDetail.status}`}
      <img className={styles.editIcon} src="assets/editWhite.svg" alt="alt" />
    </div>
  );
  useEffect(() => {
    if (getBrandDetail) getBrandDetail(brandId);
  }, []);

  // useEffect(() => {
  //   if (props.formSubmitted) {
  //     if (props.nextTab || props.nextTab === 0) {
  //       setSelectedSectionKey(props.nextTab);
  //       props.resetNextTab();
  //     } else if (selectedButton === 'Save') {
  //       props.updateDealDetailForm(deal);
  //       setOpenAlert(true);
  //       setTimeout(() => {
  //         setOpenAlert(false);
  //       }, 2000);
  //       setSelectedButton();
  //     }
  //     props.resetFormSubmitted();
  //   }
  // }, [props.formSubmitted]);

  const handleUpdateStatus = (values) => new Promise(() => updateBrandStatus(values, brandDetail.id).then(() => setOpenStatusDialog(false)));

  // eslint-disable-next-line no-unused-vars
  const handleRemarkClick = (event) => {
    setRemarkDialog(event.currentTarget);
  };

  const handleRemarkClose = () => {
    setRemarkDialog(null);
  };

  const createDeal = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <AddCircleIcon style={{ fill: '#ffffff', fontSize: '21px' }} />
      <div style={{ marginLeft: '3px' }}>Create Deal</div>
    </div>
  );

  const openCreateDealDialog = () => {
    setOpenDialog(true);
    // getConfig();
  };

  const onSubmit = (values) => {
    createDealForm(
      values,
      brandDetail.company.businessName,
      brandDetail.company.id,
      brandDetail.id,
      brandDetail.applicationCode,
      brandDetail.company.companyCode
    ).then((res) => {
      if (res.data) {
        setOpenDialog(false);
      }
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getId = () => brandDetail && brandDetail.company && brandDetail.company.id;
  const getBrandCode = () => brandDetail?.company?.companyCode;
  const isApplication = [...BreadcrumbsArray].findIndex((list) => list.level === 2 && list.title === 'Applications')
    >= 0;
  return (
    <Grid
      container={true}
      className={clsx(styles.wrapper, globalStyles.fullHeight)}
      wrap="nowrap"
      direction="row"
    >
      <Grid className={globalStyles.drawerIconContainer} onMouseOver={handleDrawerOpen}>
        <IconButton
          className={globalStyles.drawerIcon}
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <ChevronRightIcon style={{ color: '#1518AF' }} />
        </IconButton>
      </Grid>
      <Grid
        className={clsx(styles.contentWrapper, globalStyles.fitContentHeight)}
        item={true}
        container={true}
        direction="row"
      >
        {brandDetail && (
          <div className={styles.headerWraper}>
            <Grid
              container={true}
              item={true}
              direction="row"
              justify="space-between"
              className={`${styles.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
            >
              <Breadcrumb
                BreadcrumbsArray={BreadcrumbsArray}
                childEl={isApplication && applicationList ? applicationList : null}
              />
            </Grid>
          </div>
        )}
        <Grid
          container={true}
          item={true}
          direction="row"
          justify="space-between"
          className={globalStyles.bodyContentWrapper}
          style={{ height: '100%' }}
        >
          <Grid className={styles.formContainer}>
            <div>
              {(selectedSection === 'Business'
                || brandDetail?.company?.businessName === selectedSection) && getBrandCode() && getId() && (
                <BusinessInfo
                  brandCode={getBrandCode()}
                  companyId={getId()}
                  setBreadcrumbsData={setBreadcrumbsData}
                  position={3}
                />
              )}
              {selectedSection === 'Performance' && <PerformanceInfoForm />}
              {/* {selectedSection === 'Applicant' && (
                // <Applicant companyId={getId()} />
                <CompanyApplicant companyId={getId()} />
              )} */}
              {selectedSection === 'Applications' && brandDetail && (
                <CompanyApplications
                  companyId={getId()}
                  company={brandDetail}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                  setApplicationDropDown={setApplicationList}
                />
              )}

              {/* {selectedSection === 'Banking' && ( */}
              {/*  <Banking resourceId={getId()} /> */}
              {/* )} */}
              {/* {selectedSection === 'Documents' && <Documents companyId={getId()} />} */}
              {selectedSection === 'Documents' && brandDetail && (
                <BrandDocuments
                  companyId={getId()}
                  brandCode={getBrandCode()}
                  company={brandDetail?.company}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                />
              )}
              {selectedSection === 'GST' && (
                <BrandGst
                  company={brandDetail?.company}
                  companyId={getId()}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                />
              )}
              {selectedSection === 'Banking' && (
                <BankingDetail
                  resourceId={getId()}
                  brandCode={getBrandCode()}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                />
              )}
              {selectedSection === 'Financial' && brandDetail && (
                <FinancialDetail
                  applicationId={brandDetail?.id || ''}
                  company={brandDetail?.company || {}}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                  getBrandDetail={getBrandDetail}
                />
              )}
              {selectedSection === 'Rewards' && getId() && <RewardList brandId={getId()} />}
              {selectedSection === 'Points' && getId() && <PointList brandId={getId()} />}
              {selectedSection === 'Deals' && getId() && <DealList brandId={getId()} />}
              {selectedSection === 'Ad Data' && <AdData brandCode={getBrandCode()} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
              {selectedSection === 'Marketplace' && brandDetail && <Marketplace brandCode={getBrandCode()} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
              {selectedSection === 'COD' && brandDetail && <COD brandCode={getBrandCode()} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
              {selectedSection === 'PG Data' && brandDetail && <PgData brandCode={getBrandCode()} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
              {selectedSection === 'PoS Data' && brandDetail && <PosData brandCode={getBrandCode()} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
              {selectedSection === 'Repayment' && brandDetail && <Repayment companyId={getId()} company={brandDetail} position={3} setBreadcrumbsData={setBreadcrumbsData} />}
            </div>
          </Grid>
          {/* <Grid className={styles.remarkContainer} /> */}
        </Grid>
      </Grid>
      {openDialog && (
        <DialogComponent onClose={() => setOpenDialog(false)} title="Create Deal">
          <CreateForm onSubmit={onSubmit} brandDetail={brandDetail} />
        </DialogComponent>
      )}
      {openStatusDialog && (
        <Dialog
          onSubmit={handleUpdateStatus}
          handleClose={() => setOpenStatusDialog(false)}
          currentStatus={brandDetail.status}
          initialValues={{
            status: brandDetail.status
          }}
        />
      )}
      <Drawer open={open} title={brandDetail?.company?.businessName || 'Brand'} handleClose={handleDrawerClose}>
        <div onMouseLeave={handleDrawerClose}>
          <NavBarComponent
            sectionList={brandSections}
            selectedSection={selectedSection}
            handleClose={handleDrawerClose}
            handleNavClick={(name) => hendleNavigationTab(name)}
          />
        </div>
      </Drawer>
    </Grid>
  );
};

BrandDetail.propTypes = {
  brandDetail: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    company: PropTypes.string
  }),
  getBrandDetail: PropTypes.func,
  updateBrandStatus: PropTypes.string
};

BrandDetail.defaultProps = {
  brandDetail: null,
  getBrandDetail: () => {},
  updateBrandStatus: ''
};

const defaultArray = [
  { title: 'Brands', level: 0, functions: () => {} },
  {
    title: 'Brands Detail',
    level: 1,
    functions: () => {}
  },
  { title: 'Business', level: 2, functions: () => {} }
];
export default WithBreadcrumb(BrandDetail, defaultArray);
