import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { getHashPositionValue } from 'app/utils/utils';
import Banking from 'app/containers/partners/partnerDetail/forms/banking';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useParams } from 'react-router-dom';
import ListItemText from '@material-ui/core/ListItemText';
import { getCompanyDetail } from 'app/containers/companies/saga';
import Repayments from 'app/containers/repayments';
import { useSelector } from 'react-redux';
import { NavBarComponent, Button, Drawer, Breadcrumb } from '../../../components';
import InvestmentList from '../../deals/investments';
import CompanyApplicant from '../../shared/companyApplicant';
import BusinessInfo from './forms/businessInfoForm/businessInfoForm';
import Dialog from './components/dialog';
import PointList from '../../loyalty/points';
import RewardList from '../../loyalty/rewards';
import Documents from './forms/documents/documents';
import WithBreadcrumb from '../../../hoc/breadcrumbWrapper';
import styles from './styles.scss';
import globalStyles from '../../global.scss';

const CompanyDetail = (props) => {
  const brandDetail = useSelector((state) => state.brandReducer.brandDetail);
  const { updateBrandStatus, BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const { companyId } = useParams();
  const companySections = [
    'Business',
    'Banking',
    'Members',
    'Documents',
    'Rewards',
    'Points',
    'Deals',
    'Payouts'
  ];

  const [selectedSection, setSelectedSection] = useState(companySections[0]);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const statusLabel = (
    <div className={styles.statusWrapper}>
      {`Status : ${brandDetail && brandDetail.status}`}
      <img className={styles.editIcon} src="assets/editWhite.svg" alt="alt" />
    </div>
  );
  useEffect(() => {
    if (companyId) {
      getCompanyDetail(companyId);
    }
  }, [companyId]);

  const hendleNavigationTab = (name) => {
    setSelectedSection(name);
    setBreadcrumbsData(name, 2, true, () => {}, true);
  };

  useEffect(() => {
    const mData = getHashPositionValue(0);
    if (mData) {
      defaultHashHandler();
      const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
      const TabValue = companySections.find((list) => list.match(re) !== null);
      if (TabValue) {
        setSelectedSection(TabValue);
      } else {
        hendleNavigationTab('Business');
      }
    } else {
      hendleNavigationTab('Business');
    }
  }, []);

  useEffect(() => {
    setBreadcrumbsData(brandDetail?.companyCode || 'Company Detail', 1, false, () => hendleNavigationTab('Business'));
  }, [brandDetail]);

  const handleUpdateStatus = (values) => new Promise(() => updateBrandStatus(values, brandDetail.id).then(() => setOpenStatusDialog(false)));

  const getId = () => brandDetail && brandDetail.id;
  const getCode = () => brandDetail && brandDetail.companyCode;

  const getEntityType = () => (brandDetail && brandDetail.entityType) || 'Company';
  const getLegalConstitution = () => (brandDetail && brandDetail.legalConstitution) || 'Company';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
      <Grid className={clsx(styles.contentWrapper, globalStyles.fitContentHeight)} item={true} container={true}>
        {brandDetail && (
          <div className={styles.headerWraper}>
            <Grid
              container={true}
              item={true}
              className={`${styles.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
            >
              <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} />
              <Grid item={true} xs={12} md={9}>
                <List className={styles.list}>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={{
                        primary: styles.primaryTitle,
                        secondary: styles.secondaryTitle
                      }}
                      primary={`${getEntityType()} Code`}
                      secondary={brandDetail.companyCode}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      classes={{
                        primary: styles.primaryTitle,
                        secondary: styles.secondaryTitle
                      }}
                      primary={`${getEntityType()} Name`}
                      secondary={brandDetail.businessName}
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={{
                        primary: styles.primaryTitle,
                        secondary: styles.secondaryTitle
                      }}
                      primary="Entity Type"
                      secondary={getLegalConstitution()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      classes={{
                        primary: styles.primaryTitle,
                        secondary: styles.secondaryTitle
                      }}
                      primary="KYC Status"
                      secondary={
                        brandDetail?.kycCompleted ? 'Verified' : 'Not Verified'
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item={true}
                justify="flex-end"
                xs={12}
                md={3}
                style={{ display: 'flex' }}
              >
                <Button
                  label={statusLabel}
                  onClick={() => setOpenStatusDialog(true)}
                />
              </Grid>
            </Grid>
          </div>
        )}
        <Grid
          container={true}
          item={true}
          direction="row"
          className={globalStyles.bodyContentWrapper}
          justify="space-between"
          style={{ height: '100%' }}
        >
          <Grid className={styles.formContainer}>
            <div>
              {selectedSection === 'Business' && brandDetail && (
                <BusinessInfo
                  companyId={getId()}
                  entityType={getEntityType()}
                  companyCode={getCode()}
                  setBreadcrumbsData={setBreadcrumbsData}
                  position={3}
                  brandDetail={brandDetail}
                />
              )}
              {selectedSection === 'Banking' && getId() && brandDetail && (
                <Banking
                  partnerId={getId()}
                  customer={brandDetail}
                  isEntity={true}
                />
              )}
              {selectedSection === 'Members' && (
                <CompanyApplicant
                  companyId={getId()}
                  entityType={getEntityType()}
                  isEntity={true}
                />
              )}
              {selectedSection === 'Documents' && (
                <Documents companyId={getId()} entityType={getEntityType()} position={3} setBreadcrumbsData={setBreadcrumbsData} />
              )}

              {selectedSection === 'Rewards' && companyId && getId() && (
                <RewardList
                  brandId={getId()}
                  isCompany={!!companyId}
                  entityType={getEntityType()}
                />
              )}
              {selectedSection === 'Points' && companyId && getId() && (
                <PointList
                  brandId={getId()}
                  isCompany={!!companyId}
                  entityType={getEntityType()}
                />
              )}
              {selectedSection === 'Deals' && companyId && getId() && (
                <InvestmentList
                  customerId={getId()}
                  patronCode={getCode()}
                  investmentType="Company"
                />
              )}
              {selectedSection === 'Payouts' && companyId && getId() && (
                <Repayments patronId={getCode() || ''} payoutType="Entity" />
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
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
      <Drawer open={open} title={brandDetail?.businessName || 'Company'} handleClose={handleDrawerClose}>
        <div onMouseLeave={handleDrawerClose}>
          <NavBarComponent
            sectionList={companySections}
            handleClose={handleDrawerClose}
            selectedSection={selectedSection}
            handleNavClick={(name) => hendleNavigationTab(name)}
          />
        </div>
      </Drawer>
    </Grid>
  );
};

const defaultArray = [
  { title: 'Companies', level: 0, functions: () => {} },
  { title: 'Companies Detail', level: 1, functions: () => {} },
  { title: 'Basic Info', level: 2, functions: () => {} }
];
export default WithBreadcrumb(CompanyDetail, defaultArray);
