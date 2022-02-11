import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { postNewApplication } from 'app/containers/applications/saga';
import styles from '../../../../../../shared/companyApplicant/style.scss';

const ApplicationFundingUse = [
  'Marketing',
  'Inventory',
  'Capex',
  'Working Capital',
  'Others'
];

const AddApplication = (props) => {
  const { onClose, company, productList } = props;
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (values) => {
    const payload = {
      ...values,
      companyId: company.company.id,
      companyCode: company.company.companyCode
    };
    postNewApplication(payload).then(() => {
      onClose();
    });
  };

  return (
    <Grid container={true} style={{ marginTop: '10px' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <TextField
            className={styles.w100}
            type="text"
            value={company.company?.businessName}
            label="Brand Name"
            disabled={true}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <InputLabel className={styles.fieldLabel}>Product</InputLabel>
          <Controller
            as={
              <Select
                className={styles.w100}
                name="productId"
                label="Product"
              >
                {productList.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
          }
            name="productId"
            rules={{ required: true }}
            control={control}
            defaultValue={productList[0].id}
          />
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <Grid container={true} justify="space-between" alignItems="flex-end">
            <Grid item={true} xs={12}>
              <TextField
                className={styles.w100}
                inputRef={register({ required: true })}
                type="number"
                name="requestedAmount"
                label="Requested Amount"
                required={true}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} className={`${styles.fieldItem} w100`}>
          <InputLabel className={styles.fieldLabel}>Funding Required For</InputLabel>
          <Controller
            as={
              <Select
                className={styles.w100}
                name="fundingRequiredFor"
                label="Use of Funds"
              >
                {ApplicationFundingUse.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            }
            name="fundingRequiredFor"
            rules={{ required: true }}
            control={control}
            defaultValue={ApplicationFundingUse[0]}
          />
        </Grid>
        <Grid item={true} className={styles.fieldItem}>
          <div className={styles.btnContainer}>
            <Button onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </div>
        </Grid>
      </form>
    </Grid>
  );
};

export default React.memo(AddApplication);
