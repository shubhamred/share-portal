import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, ButtonBase } from '@material-ui/core';
import Repayments from 'app/containers/repayments';
import { getParameterValuesFromHash, getHashPositionValue } from 'app/utils/utils';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Documents from './forms/documents';
import styles from './styles.scss';
import globalStyles from '../../global.scss';
import { NavBarComponent, Button, Drawer, Breadcrumb } from '../../../components';
// import BasicInfoForm from './forms/basicInfoForm';
// import FundingInfoForm from './forms/fundingInfoForm';
// import PatronCommunication from './forms/patronCommunication';
import Dialog from './components/dialog';
import RemarkDialog from '../../remarks';
import PointList from '../../loyalty/points';
import InvestmentList from '../../deals/investments';
import AssociatedCompanies from './sections/associatedCompanies';
import PatronBanking from './sections/banking';
import Info from './forms/info';
import WithBreadcrumb from '../../../hoc/breadcrumbWrapper';

const PatronDetail = (props) => {
  const { getPatronDetail, patronDetail, updateInvestorStatus, BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const paramValues = getParameterValuesFromHash('/patrons/:patronId');
  const { patronId } = paramValues;
  const patronSections = [
    'Basic Info',
    'Banking',
    // 'Preferences',
    // 'Communication',
    'Associated Companies',
    'Documents',
    'Loyalty Points',
    'Deals',
    'Payouts'
  ];
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [openRemarkDialog, setRemarkDialog] = useState(null);
  const [open, setOpen] = useState(false);

  const statusLabel = (
    <div className={styles.statusWrapper}>
      {`Status : ${patronDetail && patronDetail.status}`}
      <img className={styles.editIcon} src="assets/editWhite.svg" alt="alt" />
    </div>
  );
  useEffect(() => {
    if (getPatronDetail) getPatronDetail(patronId);
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

  const hendleNavigationTab = (name) => {
    setSelectedSection(name);
    setBreadcrumbsData(name, 2, true, () => {}, true);
  };

  useEffect(() => {
    const mData = getHashPositionValue(0);
    if (mData) {
      defaultHashHandler();
      const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
      const TabValue = patronSections.find((list) => list.match(re) !== null);
      if (TabValue) {
        setSelectedSection(TabValue);
      } else {
        hendleNavigationTab('Basic Info');
      }
    } else {
      hendleNavigationTab('Basic Info');
    }
  }, []);

  useEffect(() => {
    setBreadcrumbsData(patronDetail?.name || 'Patron Detail', 1, false, () => hendleNavigationTab('Basic Info'));
  }, [patronDetail]);

  const handleUpdateStatus = (values) => {
    updateInvestorStatus(values, patronDetail.id);
    setOpenStatusDialog(false);
  };

  const handleRemarkClick = (event) => {
    setRemarkDialog(event.currentTarget);
  };

  const handleRemarkClose = () => {
    setRemarkDialog(null);
  };

  const handleViewDocuments = () => {
    setSelectedSection('Documents');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
          container={true}
          item={true}
          direction="row"
        >
          {patronDetail && patronDetail !== {} && (
            <div className={styles.headerWraper}>
              <Grid
                container={true}
                item={true}
                direction="row"
                justify="space-between"
                className={`${styles.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
              >
                <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} styles={{ marginBottom: '20px' }} />
                <Grid item={true} direction="column">
                  <div className={styles.primaryLabel}>
                    Patron ID
                  </div>
                  <div className={styles.secondaryLabel}>
                    {patronDetail && patronDetail.patronCode}
                  </div>
                </Grid>
                <Grid item={true} direction="column">
                  <div className={styles.primaryLabel}>
                    Type of Investor
                  </div>
                  <div className={styles.secondaryLabel}>
                    Individual
                  </div>
                </Grid>
                <Grid item={true} direction="column">
                  <div className={styles.primaryLabel}>
                    KYC Status
                  </div>
                  <div
                    className={
                      patronDetail?.profileCompleted
                        ? `${styles.kycFlagTrue}`
                        : `${styles.kycFlagFalse} false`
                    }
                  >
                    {patronDetail && patronDetail.profileCompleted ? null : 'Not '}
                    Verified
                  </div>
                </Grid>
                <Grid item={true} justify="flex-end" xs={6} style={{ display: 'flex' }}>
                  <ButtonBase onClick={handleRemarkClick} style={{ paddingRight: '20px' }}>
                    <img src="/assets/remark.svg" alt="" />
                    <span className={styles.remarkText}>Remarks</span>
                  </ButtonBase>
                  {patronDetail && patronDetail !== {} && (
                    <Button
                      label={statusLabel}
                      onClick={() => setOpenStatusDialog(true)}
                      style={{ backgroundColor: '#5064E2', minWidth: '200px' }}
                      // style={{ backgroundColor: selectedButton === buttonName && '#8F8F8F' }}
                    />
                  )}
                  {Boolean(openRemarkDialog) && (
                    <RemarkDialog
                      openDialog={openRemarkDialog}
                      handleClose={handleRemarkClose}
                      type="patrons"
                    />
                  )}
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
          >
            <Grid className={styles.formContainer}>
              <div>
                {selectedSection === 'Basic Info' && patronDetail && (
                <Info
                  initialValuesBasicInfoForm={patronDetail}
                  position={3}
                  setBreadcrumbsData={setBreadcrumbsData}
                  initialValuesFundingInfoForm={(patronDetail?.investorProfile && patronDetail?.investorProfile[0]) || {}}
                  switchToDocSection={handleViewDocuments}
                />
                )}
                {/* {selectedSection === 'Basic Info' && (
                  <BasicInfoForm
                    initialValues={patronDetail}
                    switchToDocSection={handleViewDocuments}
                  />
                )} */}
                {selectedSection === 'Banking' && <PatronBanking customer={patronDetail} />}
                {/* {selectedSection === 'Preferences' && (
                  <FundingInfoForm initialValues={patronDetail?.investorProfile[0] || {}} />
                )} */}
                {/* {selectedSection === 'Communication' && <PatronCommunication position={3} setBreadcrumbsData={setBreadcrumbsData} />} */}
                {selectedSection === 'Associated Companies' && (
                  <AssociatedCompanies customerId={patronDetail?.id || ''} />
                )}
                {selectedSection === 'Documents' && <Documents position={3} setBreadcrumbsData={setBreadcrumbsData} />}
                {selectedSection === 'Loyalty Points' && patronDetail?.id && <PointList customerId={patronDetail?.id || ''} />}
                {selectedSection === 'Deals' && patronDetail?.id && <InvestmentList customerId={patronDetail?.id || ''} patronCode={patronDetail?.patronCode || ''} investmentType="Patron" />}
                {selectedSection === 'Payouts' && patronDetail?.patronCode && (
                  <Repayments patronId={patronDetail?.patronCode || ''} payoutType="Patron" />
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
        {openStatusDialog && (
          <Dialog
            handleUpdateStatus={handleUpdateStatus}
            handleClose={() => setOpenStatusDialog(false)}
            currentStatus={patronDetail.status}
            initialValues={{
              status: patronDetail.status
            }}
          />
        )}
        <Drawer open={open} title={patronDetail?.name || 'Patron'} handleClose={handleDrawerClose}>
          <div onMouseLeave={handleDrawerClose}>
            <NavBarComponent
              handleClose={handleDrawerClose}
              sectionList={patronSections}
              selectedSection={selectedSection}
              handleNavClick={(name) => hendleNavigationTab(name)}
            />
          </div>
        </Drawer>
      </Grid>
    </div>
  );
};

PatronDetail.propTypes = {
  patronDetail: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    customerId: PropTypes.string
  }),
  getPatronDetail: PropTypes.func
};

PatronDetail.defaultProps = {
  patronDetail: null,
  getPatronDetail: () => {}
};

const defaultArray = [
  { title: 'Patrons', level: 0, functions: () => {} },
  { title: 'Patron Detail', level: 1, functions: () => {} },
  { title: 'Basic Info', level: 2, functions: () => {} }
];

export default WithBreadcrumb(PatronDetail, defaultArray);
