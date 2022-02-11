import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { AutocompleteCustom, Button } from 'app/components';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getPatrons } from 'app/containers/patrons/saga';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { getRewards, redeemReward } from 'app/containers/loyalty/saga';

const RedeemPoints = (props) => {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const { customerId } = props;
  const [selectedCustomer, changeSelectedCustomer] = useState('');
  const [selectedReward, changeSelectedReward] = useState('');
  const [customersData, setCustomersData] = useState([]);
  const [rewardList, changeRewardList] = useState([]);
  const [showError, toggleError] = useState({
    reward: false,
    customer: false
  });
  useEffect(() => {
    if (customerId) {
      changeSelectedCustomer({ id: customerId });
    }
  }, []);

  const handleCustomerChange = (val) => {
    if (!val || val.length <= 2) return;
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 5
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomersData(res.data);
    });
  };

  const handleRewardNameChange = (val) => {
    if (!val || val.length <= 2) return;
    const queryParams = {
      take: 5,
      page: 1,
      where: { name: { keyword: val } }
    };
    getRewards(queryParams).then((res) => {
      changeRewardList(res.data);
    });
  };

  const handleFormSubmit = () => {
    if (
      selectedReward
      && selectedReward.id
      && selectedCustomer
      && selectedCustomer.id
    ) {
      redeemReward(selectedReward.id, selectedCustomer.id).then((res) => {
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Points Redeemed Successfully',
            msgType: 'success'
          });
        }
      });
    } else {
      if (!selectedCustomer) toggleError((prevState) => ({ ...prevState, customer: true }));
      if (!selectedReward) toggleError((prevState) => ({ ...prevState, reward: true }));
    }
  };

  return (
    <Grid container={true}>
      {customerId ? null : (
        <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
          <AutocompleteCustom
            options={customersData}
            selector="name"
            label="Customer Name *"
            isArray={false}
            handleSelectedOption={(e, selected) => changeSelectedCustomer(selected)}
            selectedOption={selectedCustomer}
            debouncedInputChange={handleCustomerChange}
          />
          {showError.customer && (
            <FormHelperText error={true}>
              Please Select a customer
            </FormHelperText>
          )}
        </Grid>
      )}

      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <AutocompleteCustom
          options={rewardList || []}
          selector="name"
          label="Reward *"
          isArray={false}
          handleSelectedOption={(e, selected) => changeSelectedReward(selected)}
          selectedOption={selectedReward}
          debouncedInputChange={handleRewardNameChange}
        />
        {showError.deal && (
          <FormHelperText error={true}>Please Select a Reward</FormHelperText>
        )}
      </Grid>
      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <Button
          label="Redeem"
          onClick={handleFormSubmit}
          style={{ width: '100%' }}
        />
      </Grid>
    </Grid>
  );
};

RedeemPoints.propTypes = {
  customerId: PropTypes.string
};

RedeemPoints.defaultProps = {
  customerId: null
};

export default React.memo(RedeemPoints);
