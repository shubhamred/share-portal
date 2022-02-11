/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { addNewPortalUser } from '../../../../saga';
import Styles from '../../../../styles.scss';

const NewPortalUserForm = (props) => {
  const { onClose } = props;
  const { register, handleSubmit, control, errors } = useForm();

  const onSubmit = (values) => {
    addNewPortalUser(values).then((res) => {
      if (res.data) {
        onClose(true);
      }
    });
  };

  return (
    <Grid container={true}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid item={true} xs={12} className={Styles.fieldItem}>
          <TextField
            className={Styles.w100}
            inputRef={register({ required: true })}
            type="text"
            name="firstName"
            label="First Name"
            required={true}
            error={errors?.firstName}
          />
        </Grid>
        <Grid item={true} xs={12} className={Styles.fieldItem}>
          <TextField
            className={Styles.w100}
            inputRef={register()}
            type="text"
            name="lastName"
            label="Last Name"
            error={errors?.lastName}
          />
        </Grid>
        <Grid item={true} xs={12} className={Styles.fieldItem}>
          <TextField
            className={Styles.w100}
            inputRef={register({ required: true })}
            type="email"
            name="email"
            label="Email"
            required={true}
            error={errors?.email}
          />
        </Grid>
        <Grid item={true} xs={12} className={Styles.fieldItem}>
          <Controller
            as={
              <PhoneInput
                className={Styles.w100}
                international={true}
                defaultCountry="IN"
                country="IN"
                name="mobile"
                error={errors?.mobile ? 'Invalid Mobile' : undefined}
                label="mobile"
              />
            }
            name="mobile"
            country="IN"
            defaultValue=""
            control={control}
          />
        </Grid>
        <Grid
          item={true}
          xs={12}
          container={true}
          alignItems="center"
          justify="flex-end"
        >
          <Button type="button" onClick={onClose} className={Styles.mr2}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default React.memo(NewPortalUserForm);
