import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { updateProduct } from 'app/containers/products/saga';
import { useDispatch } from 'react-redux';
import styles from './styles.scss';

const ProductOverview = (props) => {
  const { product, productUpdated } = props;
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);

  useEffect(() => {
    if (product && product.id) {
      reset({
        name: product.name,
        description: product.description,
        revenueRequired: product.revenueRequired,
        operationalHistory: product.operationalHistory,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        minTenure: product.minTenure,
        maxTenure: product.maxTenure,
        minRate: product.minRate,
        maxRate: product.maxRate,
        minRevenueShare: product.minRevenueShare,
        maxRevenueShare: product.maxRevenueShare
      });
      setFieldsDisabled(true);
    }
  }, [product]);

  const onSubmit = (values) => {
    updateProduct(product.id, values).then((res) => {
      if (res.data) {
        productUpdated();
        dispatch({ type: 'show', payload: 'Product Updated Successfully', msgType: 'success' });
        setFieldsDisabled(true);
      }
    });
  };

  const handleCancel = () => {
    reset({
      name: product.name,
      description: product.description,
      revenueRequired: product.revenueRequired,
      operationalHistory: product.operationalHistory,
      minAmount: product.minAmount,
      maxAmount: product.maxAmount,
      minTenure: product.minTenure,
      maxTenure: product.maxTenure,
      minRate: product.minRate,
      maxRate: product.maxRate,
      minRevenueShare: product.minRevenueShare,
      maxRevenueShare: product.maxRevenueShare
    });
    setFieldsDisabled(true);
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} container={true} justify="flex-end">
        <p className={styles.updatedTime}>
          Last Updated on :
          <time>{ new Date(product?.updatedAt).toLocaleString() }</time>
        </p>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid container={true} justify="space-between" alignItems="center">
          <Grid item={true} xs={3} className={styles.fieldItem}>
            <TextField
              InputLabelProps={{ shrink: true }}
              className={styles.w100}
              name="name"
              label="Name"
              disabled={fieldsDisabled}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item={true} xs={8} className={styles.fieldItem}>
            <TextField
              InputLabelProps={{ shrink: true }}
              className={styles.w100}
              name="description"
              multiline={true}
              label="Description"
              disabled={fieldsDisabled}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid container={true} item={true} xs={12} alignItems="center" justify="space-between">
            <Grid item={true} xs={5} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="revenueRequired"
                label="Min Monthly revenue Required"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={5} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="operationalHistory"
                label="Operational History (in months)"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={12} container={true} justify="space-between" alignItems="center">
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="minAmount"
                label="Min Funding amount"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="maxAmount"
                label="Max Funding Amount"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="minTenure"
                label="Min Tenure"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="maxTenure"
                label="Max Tenure"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={12} container={true} justify="space-between" alignItems="center">
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="minRate"
                label="Min Yield"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="maxRate"
                label="Max Yield"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="minRevenueShare"
                label="Min Revenue Share"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
            <Grid item={true} xs={2} className={styles.fieldItem}>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                type="number"
                name="maxRevenueShare"
                label="Max Revenue Share"
                disabled={fieldsDisabled}
                inputRef={register({ required: true })}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={12} container={true}>
            {fieldsDisabled ? (
              <Grid item={true} xs={2}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => setFieldsDisabled(false)}
                >
                  Edit
                </Button>
              </Grid>
            ) : (
              <>
                <Grid item={true}>
                  <Button type="button" onClick={handleCancel}>Cancel</Button>
                </Grid>
                <Grid item={true}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default React.memo(ProductOverview);
