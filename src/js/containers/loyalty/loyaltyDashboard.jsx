import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { getHashPositionValue } from 'app/utils/utils';
import { Tabs } from 'app/components';
import RewardList from 'app/containers/loyalty/rewards';
import PointList from 'app/containers/loyalty/points';
import styles from './styles.scss';
import WithBreadcrumb from '../../hoc/breadcrumbWrapper';

const LoyaltyDashboard = (props) => {
  const { setBreadcrumbsData, defaultHashHandler } = props;
  let tabRef = null;

  const tabList = [
    {
      label: 'Rewards',
      content: <RewardList />
    },
    {
      label: 'Points',
      content: <PointList />
    }
  ];

  useEffect(() => {
    defaultHashHandler();
  }, []);

  useEffect(() => {
    if (tabRef) {
      let mData = getHashPositionValue(0);
      if (mData) {
        mData = mData.replace(new RegExp('#', 'g'), '');
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = tabList.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(tabList[TabValue].label, 0);
        } else {
          setBreadcrumbsData(tabList[0].label, 0, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(tabList[0].label, 0);
      }
    }
  }, [tabRef]);

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabList[newValue].label, 0, false, () => {}, true, true);
  };

  return (
    <Grid className={styles.wrapper} direction="column">
      <Grid item={true} className={styles.tableStyles}>
        <Tabs tabList={tabList} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

// LoyaltyDashboard.propTypes = {
//   rewardStatus: PropTypes.string,
//   rewardList: PropTypes.arrayOf(PropTypes.shape({})),
//   getRewards: PropTypes.func,
//   totalCount: PropTypes.number
// };
//
// LoyaltyDashboard.defaultProps = {
//   rewardStatus: null,
//   rewardList: null,
//   getRewards: () => { },
//   totalCount: 0
// };

export default WithBreadcrumb(LoyaltyDashboard, [], 0);
