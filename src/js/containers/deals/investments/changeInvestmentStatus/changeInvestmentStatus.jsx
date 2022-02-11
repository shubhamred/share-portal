import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';
import styles from './styles.scss';

// export const CreateRewardContext = React.createContext();
// export const useCreateReward = () => useContext(CreateRewardContext);

const ChangeInvestmentStatus = (props) => {
  const dispatch = useDispatch();
  const {
    investmentId,
    changeInvestmentStatus,
    changeMultiInvestmentStatus,
    investmentStatusUpdateStatus,
    investmentDetail,
    investmentStatuses
  } = props;

  // console.log(props);

  const [investmentType, setInvestmentType] = useState(
    investmentDetail?.investmentType || ''
  );
  const [statusType, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState({ remarks: false, status: false });

  const handleSubmit = () => {
    if (remarks && remarks.trim().length && statusType && (Array.isArray(investmentId) || investmentType)) {
      const formData = {
        remarks,
        status: statusType
      };
      // if (investmentDetail.status !== statusType) {
      //   changeInvestmentStatus(investmentId, formData, true);
      // }
      if (Array.isArray(investmentId)) {
        changeMultiInvestmentStatus({
          investmentIds: investmentId,
          data: formData
        }).then((res) => {
          if (res?.errors?.length) {
            dispatch({
              type: 'show',
              payload: res.errors,
              msgType: 'error'
            });
            return;
          }

          if (res?.data?.length) {
            dispatch({
              type: 'show',
              payload: 'Investment Status Updated Successfully',
              msgType: 'success'
            });
          }
        });
      } else {
        formData.investmentType = investmentType;
        changeInvestmentStatus(investmentId, formData, true).then((res) => {
          if (res?.data) {
            dispatch({
              type: 'show',
              payload: 'Investment Status Updated Successfully',
              msgType: 'success'
            });
          }
        });
      }
    } else {
      if (!remarks || (remarks && remarks.trim().length < 1)) {
        setErrors({ ...errors, remarks: true });
      }
      if (!statusType) {
        setErrors({ ...errors, status: true });
      }
    }
  };

  const getStatus = () => {
    if (investmentStatuses[investmentDetail.status]) {
      return investmentStatuses[investmentDetail.status]?.nextStates || [];
    }
    return [];
  };

  return (
    <>
      <Grid container={true} style={{ margin: '1.5rem 0' }}>
        {!Array.isArray(investmentId) && (
          <Grid item={true} xs={12} style={{ marginBottom: '15px' }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel required={true} id="select-investmentType">
                Investment Type
              </InputLabel>
              <Select
                labelId="select-investmentType"
                id="select"
                value={investmentType}
                onChange={({ target }) => setInvestmentType(target.value)}
              >
                <MenuItem value="Individual">Individual</MenuItem>
                <MenuItem value="Company">Company</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item={true} xs={12} style={{ marginBottom: '15px' }}>
          <FormControl style={{ width: '100%' }} error={errors.status}>
            <InputLabel id="select-status" required={true}>
              Status
            </InputLabel>
            <Select
              labelId="select-status"
              id="select-status"
              value={statusType}
              onChange={({ target }) => {
                setStatus(target.value);
                if (target.value) {
                  setErrors({ ...errors, status: false });
                }
              }}
            >
              <MenuItem value="" disabled={true}>
                Status
              </MenuItem>
              {getStatus().map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.status ? (
              <FormHelperText error={true}>Select an Status</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: '15px' }}>
          <TextField
            error={errors.remarks}
            label="Remarks"
            required={true}
            style={{ width: '100%' }}
            onChange={({ target }) => {
              setRemarks(target.value);
              if (target.value) {
                setErrors({ ...errors, remarks: false });
              }
            }}
            value={remarks}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button
            fullWidth={true}
            variant="contained"
            color="primary"
            type="button"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Grid>
      </Grid>
      {investmentStatusUpdateStatus === 'failed' && (
        <div className={styles.warning}>investment status updation failed.</div>
      )}
    </>
  );
};

ChangeInvestmentStatus.propTypes = {
  investmentStatusUpdateStatus: PropTypes.string,
  changeInvestmentStatus: PropTypes.func,
  changeMultiInvestmentStatus: PropTypes.func,
  investmentDetail: PropTypes.shape({}),
  investmentStatuses: PropTypes.shape({}),
  investmentId: PropTypes.string
};

ChangeInvestmentStatus.defaultProps = {
  investmentStatusUpdateStatus: null,
  changeInvestmentStatus: () => {},
  changeMultiInvestmentStatus: () => {},
  investmentDetail: {},
  investmentStatuses: {},
  investmentId: null
};

export default ChangeInvestmentStatus;
