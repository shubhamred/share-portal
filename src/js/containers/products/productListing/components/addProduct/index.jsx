import React, { useState } from 'react';
import { Grid, Button, FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
// import Checkbox from '@material-ui/core/Checkbox';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useForm } from 'react-hook-form';
import { createNewProduct } from 'app/containers/products/saga';
import style from './styles.scss';

const AddProduct = (props) => {
  const { onClose } = props;
  // eslint-disable-next-line no-unused-vars
  const [currentStep, setStep] = useState(1);
  const { register, handleSubmit } = useForm({
    shouldUnregister: false
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = (values) => {
    setBtnLoading(true);
    const payload = {
      ...values,
      operationalHistory: 0,
      minRate: 0,
      maxRate: 0
    };
    createNewProduct(payload).then((res) => {
      setBtnLoading(false);
      if (res.data) {
        onClose();
      }
    });
  };

  return (
    <Grid container={true}>
      {currentStep === 1 && (
        <>
          <Grid item={true} xs={12} container={true}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Grid item={true} xs={12} className={style.fieldInputContainer}>
                <TextField
                  className={style.w100}
                  label="Name"
                  name="name"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item={true} xs={12} className={style.fieldInputContainer}>
                <TextField
                  className={style.w100}
                  label="Description"
                  name="description"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item={true} xs={12} className={style.fieldInputContainer}>
                <TextField
                  className={style.w100}
                  type="number"
                  label="Min Monthly Revenue"
                  name="revenueRequired"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid
                item={true}
                xs={12}
                container={true}
                justify="space-between"
              >
                <Grid item={true} xs={12}>
                  <FormLabel className={style.fieldLabel}>
                    Funding Amount
                  </FormLabel>
                </Grid>
                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Minimum"
                    name="minAmount"
                    type="number"
                    inputRef={register({ required: true })}
                  />
                </Grid>
                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Maximum"
                    type="number"
                    name="maxAmount"
                    inputRef={register({ required: true })}
                  />
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                container={true}
                justify="space-between"
              >
                <Grid item={true} xs={12}>
                  <FormLabel className={style.fieldLabel}>
                    Tenure of the Product
                  </FormLabel>
                </Grid>
                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Minimum"
                    type="number"
                    name="minTenure"
                    inputRef={register({ required: true })}
                  />
                </Grid>
                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Maximum"
                    name="maxTenure"
                    type="number"
                    inputRef={register({ required: true })}
                  />
                </Grid>
              </Grid>
              <Grid
                item={true}
                xs={12}
                container={true}
                justify="space-between"
              >
                <Grid item={true} xs={12}>
                  <FormLabel className={style.fieldLabel}>
                    Revenue Share
                  </FormLabel>
                </Grid>

                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Minimum"
                    name="minRevenueShare"
                    type="number"
                    inputRef={register({ required: true })}
                  />
                </Grid>
                <Grid item={true} xs={5} className={style.fieldInputContainer}>
                  <TextField
                    className={style.w100}
                    label="Maximum"
                    type="number"
                    name="maxRevenueShare"
                    inputRef={register({ required: true })}
                  />
                </Grid>
              </Grid>
              {/* <Grid item={true} xs={12} className={style.fieldInputContainer}> */}
              {/*  <FormControlLabel */}
              {/*    control={ */}
              {/*      <Checkbox */}
              {/*        inputRef={register()} */}
              {/*        name="documentNeeded" */}
              {/*        color="primary" */}
              {/*        defaultChecked={true} */}
              {/*      /> */}
              {/*    } */}
              {/*    className={style.w100} */}
              {/*    label="Add documents  sections? You will be able to manage anytime" */}
              {/*  /> */}
              {/* </Grid> */}
              <Grid item={true} xs={12}>
                <Grid
                  container={true}
                  justify="flex-end"
                  style={{ margin: '14px 0' }}
                >
                  <Button onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button disabled={btnLoading} variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default React.memo(AddProduct);
