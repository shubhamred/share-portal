import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { AutocompleteCustom, Input, NumberField } from 'app/components';
import { getBrands } from 'app/containers/brands/saga';
import { Button, Typography } from '@material-ui/core';
import styles from './styles.scss';

const CreateReward = (props) => {
  const { createRewardStatus, createReward, brandId } = props;
  const [showError, toggleError] = useState({
    reward: false,
    brand: false,
    points: false
  });
  const [selectedBrand, changeSelectedBrand] = useState('');
  const [rewardName, setRewardName] = useState('');
  const [points, setPoints] = useState();
  const [limitPerUser, setLimitPerUser] = useState(1);
  const [isLimitDisabled, toggleLimitDisabled] = useState(false);
  const [giftType, setGiftType] = useState('Code');

  const [brandData, setBrandData] = useState([]);

  const handleBrandChange = (val) => {
    if (!val || val.length <= 2) return;
    getBrands(5, 1, val).then((res) => {
      setBrandData(res.data);
    });
  };

  const handleSubmit = () => {
    if (rewardName && points) {
      if (brandId || (selectedBrand && selectedBrand.id)) {
        const payload = {
          brandId: brandId || selectedBrand.id,
          name: rewardName,
          typeOfReward: giftType,
          points: Number(points),
          limitPerUser
        };
        createReward(payload);
      } else {
        toggleError((prevState) => ({ ...prevState, brand: true }));
      }
    } else {
      if (!rewardName) {
        toggleError((prevState) => ({ ...prevState, reward: true }));
      }
      if (!points) {
        toggleError((prevState) => ({ ...prevState, points: true }));
      }
    }
  };

  const handleChange = (event) => {
    setGiftType(event.target.value);
    if (event.target.value === 'Gift') {
      setLimitPerUser(1);
      toggleLimitDisabled(true);
    } else {
      toggleLimitDisabled(false);
    }
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        {brandId ? null : (
          <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
            <AutocompleteCustom
              options={brandData}
              selector="businessName"
              label="Brand Name"
              required={true}
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedBrand(selected)}
              selectedOption={selectedBrand}
              debouncedInputChange={handleBrandChange}
            />
            {showError.brand && (
              <FormHelperText error={true}>
                Please Select a Brand
              </FormHelperText>
            )}
          </Grid>
        )}
      </Grid>
      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <Input
          isFieldValue={false}
          propValue={rewardName}
          onValueChange={(val) => setRewardName(val)}
          label="Reward Name *"
        />
        {showError.reward && (
          <FormHelperText error={true}>
            Please Enter name of the reward
          </FormHelperText>
        )}
      </Grid>
      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <NumberField
          label="Points *"
          isFieldValue={false}
          onValueChange={(val) => setPoints(val)}
          propValue={points}
        />
        {showError.points && (
          <FormHelperText error={true}>Please Enter Points</FormHelperText>
        )}
      </Grid>
      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <FormControl style={{ width: '100%' }}>
          <InputLabel id="gift-type">Gift Type</InputLabel>
          <Select
            labelId="gift-type"
            id="gift-type-select"
            value={giftType}
            onChange={handleChange}
          >
            <MenuItem value="Gift">Gift</MenuItem>
            <MenuItem value="Code">Code</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item={true} xs={12} style={{ marginBottom: '22px' }}>
        <FormControl style={{ width: '100%' }}>
          <Typography id="limit-per-user" gutterBottom={true}>
            Limit Per User
          </Typography>
          <Slider
            style={{ marginTop: '30px' }}
            aria-labelledby="limit-per-user"
            valueLabelDisplay="on"
            min={1}
            max={10}
            value={limitPerUser}
            disabled={isLimitDisabled}
            onChange={(event, value) => setLimitPerUser(value)}
          />
        </FormControl>
      </Grid>
      <Grid item={true} style={{ margin: 'auto', marginBottom: '10px' }}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Reward
          {' '}
        </Button>
      </Grid>
      {createRewardStatus === 'failed' && (
        <div className={styles.warning}>Reward creation failed.</div>
      )}
    </Grid>
  );
};

CreateReward.propTypes = {
  createReward: PropTypes.func,
  createRewardStatus: PropTypes.string,
  brandId: PropTypes.string
};

CreateReward.defaultProps = {
  createRewardStatus: null,
  brandId: null,
  createReward: () => {}
};

export default CreateReward;
