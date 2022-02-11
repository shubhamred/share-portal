/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { useDispatch } from 'react-redux';
import { omit } from 'lodash';
// import RewardList from 'app/containers/loyalty/rewards';
import RepaymentsComponent from 'app/containers/repayments';
import Projections from 'app/containers/repayments/Projections';
import { getParameterValuesFromHash, formatPerformanceText, getHashPositionValue } from 'app/utils/utils';
import Accounts from 'app/containers/brands/brandDetail/sections/companyApplications/components/applicationDetail/sections/operations';
import styles from './styles.scss';
import PlatFormTabSection from '../platformTabSection';
import PlatFormTabSectionOld from '../DealFormOld/platformTabSection';
// eslint-disable-next-line import/no-cycle
import DealHeaderForm from '../dealHeaderForm';
import { updateDealDetailForm, getDealDetail } from '../../saga';
import InvestmentList from '../../investments';
import Documents from '../DocumentsTab';
import History from '../history';
import Repayments from '../repayment';
import { dealTags } from '../../../../utils/constants';

const DealSection = (props) => {
  let tabRef = null;
  const dispatch = useDispatch();
  const { changeSectionVisibility, sectionConfig,
    dealDataSections, validateMaxVisible, sectionList, deal, dealHeaderFormUpdated, isOldDeal, setBreadcrumbsData, position } = props;

  const { dealId } = getParameterValuesFromHash('/deals/:dealId');
  useEffect(() => {
    getDealDetail(dealId.toString().split('#')[0]);
  }, []);

  useEffect(() => {
    if (dealHeaderFormUpdated) {
      const payload = omit(deal.data, ['sections']);
      updateDealDetailForm(payload).then((res) => {
        dispatch({ type: 'SET:DEAL_HEADER_FORM_UPDATED' });
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Deal Details Updated Successfully',
            msgType: 'success'
          });
        } else {
          getDealDetail(dealId.toString().split('#')[0]);
        }
      });
    }
  }, [dealHeaderFormUpdated]);

  const parseDealTag = (values) => {
    switch (values.dealTag) {
      case dealTags.OTHERS:
        return values.customDealTag;
      case dealTags.NO_TAG:
        return null;
      default:
        return values.dealTag;
    }
  };

  const headeFormSubmit = (values) => {
    if (values.dealTag === dealTags.OTHERS && !(values.customDealTag)) {
      dispatch({
        type: 'show',
        payload: 'Please specify the custom deal tag',
        msgType: 'error'
      });
      return;
    }

    const formData = {
      ...values,
      dealTag: parseDealTag(values)
    };

    dispatch({ type: 'DEAL:PROPERTY:SUBMIT', values: formData });
  };

  const [TabListing, setTabListing] = React.useState([]);

  useEffect(() => {
    if (deal?.data?.dealCode && deal?.data?.id && deal?.data?.brandId && tabRef) {
      const tablist = [
        {
          label: 'Overview',
          content: <DealHeaderForm
            setBreadcrumbsData={setBreadcrumbsData}
            position={position + 1}
            onSubmit={(values) => {
              const formData = {
                ...values,
                performanceStatus: formatPerformanceText(values.performanceStatus)
              };
              headeFormSubmit(formData);
            }}
            brandName={deal?.data?.brandName || ''}
            dealDetail={deal?.data || {}}
          />
        },
        {
          label: 'Patron App',
          content: isOldDeal ? (<PlatFormTabSectionOld
            sectionList={sectionList}
            dealDataSections={dealDataSections}
            changeSectionVisibility={changeSectionVisibility}
            validateMaxVisible={validateMaxVisible}
            deal={deal?.data || {}}
            sectionConfig={sectionConfig}
          />) : (<PlatFormTabSection
            sectionList={sectionList}
            dealDataSections={dealDataSections}
            changeSectionVisibility={changeSectionVisibility}
            validateMaxVisible={validateMaxVisible}
            deal={deal?.data || {}}
            sectionConfig={sectionConfig}
            setBreadcrumbsData={setBreadcrumbsData}
            position={position + 1}
          />)
        },
        {
          label: 'Patrons',
          content: <InvestmentList dealId={deal.data.id} />
        },
        {
          label: 'Projections',
          content: <Projections dealId={deal.data.id} />
        },
        // {
        //   label: 'Rewards',
        //   content: <RewardList brandId={deal.data.brandId} />
        // },
        {
          label: 'Accounts',
          content: <Accounts brandCode={deal?.data?.brandCode} dealId={deal?.data?.id} applicationCode={deal?.data?.applicationCode} dealCode={deal?.data?.dealCode} type="deal" />
        },
        {
          label: 'Agreements & Esigning',
          sLabel: 'documents',
          content: <Documents dealId={deal.data.id} deal={deal.data} />
        },
        {
          label: 'Repayments',
          content: <Repayments dealData={deal.data} />
        },
        {
          label: 'Patron Payouts',
          content: <RepaymentsComponent dealId={deal.data.dealCode} />
        },
        {
          label: 'History',
          content: <History dealId={deal.data.id} />
        }];

      setTabListing([...tablist]);

      if (tabRef) {
        const mData = getHashPositionValue(position - 2);
        if (mData) {
          const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
          const TabValue = tablist.findIndex((list) => { if (list?.sLabel) return list?.sLabel.match(re) !== null; return list.label.match(re) !== null; });
          if (TabValue >= 0) {
            tabRef(TabValue);
            setBreadcrumbsData(tablist[TabValue]?.sLabel || tablist[TabValue].label, position);
          } else {
            setBreadcrumbsData(tablist[0]?.sLabel || tablist[0].label, position, false, () => {}, true);
          }
        } else {
          setBreadcrumbsData(tablist[0]?.sLabel || tablist[0].label, position);
        }
      }
    }
  }, [deal, tabRef, sectionConfig]);

  useEffect(() => {
    // setBreadcrumbsData(tablist[0].label, position, true);
  }, []);

  const handleChange = (newValue) => {
    setBreadcrumbsData(TabListing[newValue]?.sLabel || TabListing[newValue].label, position, true, () => {}, true);
  };

  return (
    <Grid container={true} className={styles.wrapper}>
      <Tabs tabList={TabListing} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} scrollable={true} />
    </Grid>
  );
};

DealSection.propTypes = {
  setBreadcrumbsData: PropTypes.func,
  position: PropTypes.number
};

DealSection.defaultProps = {
  setBreadcrumbsData: () => {},
  position: 0
};

export default DealSection;
