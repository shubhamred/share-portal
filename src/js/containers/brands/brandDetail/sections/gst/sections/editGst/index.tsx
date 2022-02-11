import * as React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateSingleCompanyGst } from 'app/containers/brands/saga';
import styles from '../../../../styles.scss';

type EditGSTFormTS = {
  onClose: (arg: boolean) => void;
  GSTIN: any;
};

type onSubmitTS = (arg: { gstin: string }) => void;

const EditGSTForm: React.FC<EditGSTFormTS> = (props) => {
  const { onClose, GSTIN } = props;
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const onSubmit: onSubmitTS = (values) => {
    const payload = {
      ...values
    };
    updateSingleCompanyGst(GSTIN.id, payload).then((res) => {
      if (res.data) {
        dispatch({
          type: 'show',
          payload: 'GSTIN Updated Successfully',
          msgType: 'success'
        });
        onClose(true);
      }
    });
  };

  return (
    <Grid container={true} className={styles.dialogContainer}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12} className={styles.mb20}>
          <TextField
            className={styles.w100}
            defaultValue={GSTIN.gstin}
            type="text"
            label="GSTIN"
            name="gstin"
            required={true}
            error={!!errors.gstin}
            inputRef={register({
              required: true,
              pattern:
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
            })}
          />
          {!!errors.gstin && (
            <p className={styles.invalidGst}>Please enter a valid GST number</p>
          )}
        </Grid>
        <Grid item={true} xs={12} container={true} justify="flex-end">
          <Grid item={true}>
            <Button typeof="button" onClick={() => onClose(false)}>
              Cancel
            </Button>
          </Grid>
          <Grid item={true} style={{ marginLeft: '2rem' }}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default EditGSTForm;
