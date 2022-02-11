import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { formatDate, getParameterValuesFromHash } from 'app/utils/utils';
import {
  DatePickerNew,
  Input,
  NumberField,
  RichTextEditor,
  TextArea,
  RangeSilder
} from 'app/components';
import { Field } from 'redux-form';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  validateRequired,
  validateMinLength
} from 'app/containers/deals/components/dealForm/dealFieldRender/validateUtils';
import styles from './styles.scss';

const UpdateReward = (props) => {
  const {
    rewardDetail,
    getRewardDetail,
    updateReward,
    updateRewardStatus,
    handleSubmit
  } = props;
  const paramValues = getParameterValuesFromHash('/loyalty/rewards/:rewardId');
  const { rewardId } = paramValues;

  useEffect(() => {
    if (getRewardDetail) getRewardDetail(rewardId);
  }, [rewardId]);
  const [limitPerUser, changeLimitPerUser] = useState((rewardDetail && rewardDetail.limitPerUser) || 0);

  const handleFormSubmit = (values) => {
    if (values && values.expireAt) {
      const temp = {
        ...values,
        expireAt: formatDate(values.expireAt),
        limitPerUser
      };
      updateReward(rewardId, temp);
    }
  };

  useEffect(() => {
    if (rewardDetail && rewardDetail.limitPerUser) {
      changeLimitPerUser(rewardDetail.limitPerUser);
    }
  }, [rewardDetail, rewardDetail && rewardDetail.limitPerUser]);

  return (
    <>
      <Grid container={true}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={styles.formContainer}
        >
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="name"
              label="Reward Name"
              component={Input}
              validate={validateRequired}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="points"
              label="Points"
              component={NumberField}
              isFieldValue={true}
              validate={validateRequired}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Typography gutterBottom={true}>Limit Per User</Typography>
            <Field
              name="limitPerUser"
              label="Limit Per User"
              component={RangeSilder}
              min={0}
              max={10}
              value={limitPerUser}
              validate={validateRequired}
              onValChange={(val) => changeLimitPerUser(val)}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="description"
              label="Description"
              component={TextArea}
              minLength={20}
              validate={[validateRequired, validateMinLength(20)]}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="coverImage"
              label="Cover Image"
              component={Input}
              validate={validateRequired}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="bannerImage"
              label="Banner Image"
              component={Input}
              validate={validateRequired}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="mobileBannerImage"
              label="Mobile Banner Image"
              component={Input}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="stepsToRedeem"
              label="Steps To Redeem"
              validate={validateRequired}
              component={RichTextEditor}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="termsAndConditions"
              validate={validateRequired}
              label="Terms And Conditions"
              component={RichTextEditor}
            />
          </Grid>
          <Grid item={true} xs={10} className={styles.fieldWrapper}>
            <Field
              name="expireAt"
              label="Expire At"
              validate={validateRequired}
              component={DatePickerNew}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth="true"
            >
              Update
            </Button>
          </Grid>
        </form>
      </Grid>

      {updateRewardStatus === 'failed' && (
        <div className={styles.warning}>Reward update failed.</div>
      )}
    </>
  );
};

UpdateReward.propTypes = {
  updateReward: PropTypes.func,
  updateRewardStatus: PropTypes.string,
  rewardDetail: PropTypes.shape({
    id: PropTypes.string
  }),
  getRewardDetail: PropTypes.func
};

UpdateReward.defaultProps = {
  updateRewardStatus: null,
  rewardDetail: null,
  updateReward: () => {},
  getRewardDetail: () => {}
};

export default UpdateReward;
