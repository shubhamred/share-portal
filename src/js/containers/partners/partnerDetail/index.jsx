import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { getHashPositionValue } from 'app/utils/utils';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getCompanyDetail } from 'app/containers/companies/saga';
import Repayments from 'app/containers/repayments';
import { useSelector } from 'react-redux';
import { NavBarComponent, Drawer, Breadcrumb } from '../../../components';
import BasicInfo from './forms/basicInfo';
import WithBreadcrumb from '../../../hoc/breadcrumbWrapper';
import Banking from './forms/banking';
import styles from './styles.scss';
import globalStyles from '../../global.scss';

const PartnerDetail = (props) => {
  const partnerDetail = useSelector((state) => state.brandReducer.brandDetail);
  const { BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const { partnerId } = useParams();

  const partnerSections = [
    'Basic',
    'Banking',
    'Payouts'
  ];

  const [selectedPartner, setSelectedPartner] = useState(partnerSections[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (partnerId) {
      getCompanyDetail(partnerId);
    }
  }, [partnerId]);

  const hendleNavigationTab = (name) => {
    setSelectedPartner(name);
    setBreadcrumbsData(name, 2, true, () => {}, true);
  };

  useEffect(() => {
    const mData = getHashPositionValue(0);
    if (mData) {
      defaultHashHandler();
      const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
      const TabValue = partnerSections.find((list) => list.match(re) !== null);
      if (TabValue) {
        setSelectedPartner(TabValue);
      } else {
        hendleNavigationTab('Basic');
      }
    } else {
      hendleNavigationTab('Basic');
    }
  }, []);

  useEffect(() => {
    setBreadcrumbsData(partnerDetail?.companyCode || 'Partner Detail', 1, false, () => hendleNavigationTab('Basic'));
  }, [partnerDetail]);

  const getId = () => partnerDetail && partnerDetail.id;
  const getCode = () => partnerDetail && partnerDetail.companyCode;

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
        <div className={styles.headerWraper}>
          <Grid
            container={true}
            item={true}
            className={`${styles.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
          >
            <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} />
          </Grid>
        </div>

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
              {selectedPartner === 'Basic' && (
                <BasicInfo position={3} companyId={getId()} partnerDetail={partnerDetail} setBreadcrumbsData={setBreadcrumbsData} />
              )}
              {selectedPartner === 'Banking' && (
                <Banking position={3} partnerId={partnerId} customer={partnerDetail} />
              )}
              {selectedPartner === 'Payouts' && getCode() && (
                <Repayments patronId={getCode()} payoutType="NBFC" />
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Drawer open={open} title={partnerDetail?.businessName || 'Company'} handleClose={handleDrawerClose}>
        <div onMouseLeave={handleDrawerClose}>
          <NavBarComponent
            sectionList={partnerSections}
            handleClose={handleDrawerClose}
            selectedSection={selectedPartner}
            handleNavClick={(name) => hendleNavigationTab(name)}
          />
        </div>
      </Drawer>
    </Grid>
  );
};

const defaultArray = [
  { title: 'Partners', level: 0, functions: () => {} },
  { title: 'Partner Detail', level: 1, functions: () => {} },
  { title: 'Basic', level: 2, functions: () => {} }
];

export default WithBreadcrumb(PartnerDetail, defaultArray);
