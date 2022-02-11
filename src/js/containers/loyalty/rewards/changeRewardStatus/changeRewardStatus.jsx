import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import styles from './styles.scss';

const ChangeRewardStatus = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    status,
    rewardId,
    changeRewardStatus,
    rewardStatusUpdateStatus
  } = props;

  const onSubmit = (values) => {
    const payload = {
      ...values,
      status
    };
    changeRewardStatus(rewardId, payload);
  };

  return (
    <>
      <Grid container={true}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.w100}>
          <Grid item={true} xs={12} className={styles.inputWrapper}>
            <TextField
              InputLabelProps={{ shrink: true }}
              className={styles.w100}
              type="text"
              name="status"
              value={status}
              label="Status"
              defaultValue={status}
              disabled={true}
              inputRef={register()}
            />
          </Grid>
          <Grid item={true} xs={12} className={styles.inputWrapper}>
            <TextField
              InputLabelProps={{ shrink: true }}
              className={styles.w100}
              type="text"
              name="remarks"
              label="Remarks"
              required={true}
              error={!!errors?.remarks}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item={true} xs={12} className={styles.inputWrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={true}
            >
              Update Status
            </Button>
          </Grid>
        </form>
        <Grid item={true} xs={12}>
          {rewardStatusUpdateStatus === 'failed' && (
            <div className={styles.warning}>Reward status update failed.</div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

ChangeRewardStatus.propTypes = {
  rewardStatusUpdateStatus: PropTypes.string,
  changeRewardStatus: PropTypes.func,
  status: PropTypes.string,
  rewardId: PropTypes.string
};

ChangeRewardStatus.defaultProps = {
  rewardStatusUpdateStatus: null,
  changeRewardStatus: () => {},
  status: null,
  rewardId: null
};

export default ChangeRewardStatus;
