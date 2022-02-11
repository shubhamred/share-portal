import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';
import { editAssociatedCustomer, getApplicantList } from 'app/containers/brands/saga';
import { ControlledAccordion, DialogComponent, CheckBox } from 'app/components';
import { useHistory } from 'react-router-dom';
import { pickBy } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { customerCompanyAssociationTypes } from 'app/constants/misc';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import AddApplicant from './components/addApplicant';
import styles from './style.scss';
import globalStyles from '../../global.scss';

const CompanyApplicant = (props) => {
  const { companyId, isEntity } = props;
  const history = useHistory();
  const {
    register,
    handleSubmit,
    control,
    errors,
    setError,
    reset,
    clearErrors
  } = useForm();

  const [applicantList, setApplicantData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isApplicantFormOpen, toggleAddApplicantForm] = useState(false);
  const [fieldsDisabled, toggleFieldsDisable] = useState(true);
  const [isDirectorList, setDirectorList] = useState({});
  const [isAuthorizedSignatoryList, setAuthorizedSignatoryList] = useState({});

  const fetchData = () => {
    if (companyId) {
      getApplicantList(companyId).then((res) => {
        if (res?.data?.length) {
          setApplicantData(res.data);
          let applicantDirector = {};
          let applicantAuthorizedSignatory = {};
          res.data.map((list) => {
            applicantAuthorizedSignatory = {
              ...applicantAuthorizedSignatory,
              [list.customer.id]: list?.isAuthorizedSignatory
            };
            applicantDirector = {
              ...applicantDirector,
              [list.customer.id]: list?.isDirector
            };
            return null;
          });
          setAuthorizedSignatoryList(applicantAuthorizedSignatory);
          setDirectorList(applicantDirector);
        }
      });
    }
  };

  const checkUser = (id) => {
    const mIsDirectorList = { ...isDirectorList };
    const mIsAuthorizedSignatoryList = { ...isAuthorizedSignatoryList };
    const mData = [];

    if (mIsAuthorizedSignatoryList[id]) {
      mData.push('isAuthorizedSignatory');
    }

    if (mIsDirectorList[id]) {
      mData.push('Director');
    }
    return mData;
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const handleViewProfile = (customer) => {
    if (customer.customer.id) {
      history.push(`/patrons/${customer.customer.id}`);
    }
  };

  const handleAccChange = (isExpanded, panel) => {
    toggleFieldsDisable(true);
    setExpanded(isExpanded ? panel : false);
  };

  const handleModalClose = () => {
    fetchData();
    toggleAddApplicantForm(false);
  };

  const onSubmit = (values) => {
    const { customer } = values;
    if (isValidPhoneNumber(customer.mobile)) {
      const mIsDirectorList = { ...isDirectorList };
      const mIsAuthorizedSignatoryList = { ...isAuthorizedSignatoryList };
      const currentCustomer = applicantList.find((applicant) => applicant.id === expanded);
      if (currentCustomer && currentCustomer?.customer?.id) {
        const payload = pickBy(values.customer, (value) => value && value.length > 0);
        editAssociatedCustomer(companyId, currentCustomer?.customer?.id, {
          ...values,
          isDirector: mIsDirectorList[currentCustomer.customer.id],
          isAuthorizedSignatory: mIsAuthorizedSignatoryList[currentCustomer.customer.id],
          customer: {
            ...payload
          }
        }).then((res) => {
          if (res.data) {
            fetchData();
            toggleFieldsDisable(true);
          }
        });
      }
    } else {
      setError('customer.mobile', { type: 'invalid' });
    }
  };

  const checkBoxHandler = (id, list) => {
    const mIsDirectorList = { ...isDirectorList };
    const mIsAuthorizedSignatoryList = { ...isAuthorizedSignatoryList };

    if (list?.includes('Director')) {
      setDirectorList({ ...mIsDirectorList, [id]: true });
    } else {
      setDirectorList({ ...mIsDirectorList, [id]: false });
    }

    if (list?.includes('isAuthorizedSignatory')) {
      setAuthorizedSignatoryList({ ...mIsAuthorizedSignatoryList, [id]: true });
    } else {
      setAuthorizedSignatoryList({ ...mIsAuthorizedSignatoryList, [id]: false });
    }
  };

  const handleCancel = (values) => {
    reset({
      associationType: values.associationType,
      'customer.firstName': values.customer.firstName,
      'customer.lastName': values.customer.lastName,
      'customer.middleName': values.customer.middleName,
      'customer.email': values.customer.email,
      'customer.mobile': values.customer.mobile,
      'customer.pan': values.customer.pan
    });
    clearErrors();
    toggleFieldsDisable(true);
  };

  const directorOptions = [
    { label: 'is Director ?', name: 'Director' },
    { label: 'is Authorized Signatory ?', name: 'isAuthorizedSignatory' }
  ];

  if (isEntity) {
    directorOptions.splice(0, 1);
  }

  return (
    <Grid className={globalStyles.commonSpacing} container={true}>
      <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
        <Grid container={true} justify="space-between" alignItems="center">
          <p>Directors/Founders</p>
          <Button
            variant="contained"
            className={globalStyles.primaryCTA}
            onClick={() => toggleAddApplicantForm(true)}
          >
            Link/Add People
          </Button>
        </Grid>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true}>
          {applicantList.length ? (
            applicantList.map((application) => (
              <Grid item={true} key={application.id} xs={12}>
                <ControlledAccordion
                  unmountOnExit={true}
                  heading={
                    <>
                      <p className={styles.accMainHeading}>
                        {application.customer.name}
                      </p>
                      {' '}
                      <small
                        className={
                          application?.customer?.profileCompleted
                            ? styles.kycFlagTrue
                            : styles.kycFlagFalse
                        }
                      >
                        {application?.customer?.profileCompleted
                          ? 'KYC Verified'
                          : 'KYC not verified'}
                      </small>
                      {' '}
                      <small className={styles.accSubHeading}>
                        {' '}
                        Last updated:
                        <time dateTime={application.customer.updatedAt}>
                          {new Date(
                            application.customer.updatedAt
                          ).toLocaleString()}
                        </time>
                      </small>
                    </>
                  }
                  expanded={expanded}
                  id={application.id}
                  handleChange={handleAccChange}
                >
                  <Grid container={true} className={styles.fieldContainer}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      style={{ width: '100%' }}
                    >
                      <Grid
                        item={true}
                        xs={fieldsDisabled ? 7 : 12}
                        className={styles.fieldItem}
                      >
                        {fieldsDisabled ? (
                          <TextField
                            className={styles.w100}
                            type="text"
                            label="Name"
                            value={application?.customer?.name}
                            InputLabelProps={{ shrink: true }}
                            required={true}
                            disabled={true}
                          />
                        ) : (
                          <Grid
                            container={true}
                            justify="space-between"
                            alignContent="center"
                          >
                            <Grid item={true} xs={3}>
                              <TextField
                                className={styles.w100}
                                type="text"
                                label="First Name"
                                name="customer.firstName"
                                defaultValue={application?.customer?.firstName}
                                InputLabelProps={{ shrink: true }}
                                required={true}
                                error={!!errors?.customer?.firstName}
                                inputRef={register({ required: true })}
                              />
                            </Grid>
                            <Grid item={true} xs={3}>
                              <TextField
                                className={styles.w100}
                                type="text"
                                label="Middle Name"
                                name="customer.middleName"
                                defaultValue={application?.customer?.middleName}
                                InputLabelProps={{ shrink: true }}
                                inputRef={register()}
                              />
                            </Grid>
                            <Grid item={true} xs={3}>
                              <TextField
                                className={styles.w100}
                                type="text"
                                label="Last Name"
                                inputRef={register({ required: true })}
                                name="customer.lastName"
                                defaultValue={application?.customer?.lastName}
                                InputLabelProps={{ shrink: true }}
                                required={true}
                                error={!!errors?.customer?.lastName}
                              />
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                      <Grid item={true} xs={7} className={styles.fieldItem}>
                        <TextField
                          className={styles.w100}
                          type="email"
                          name="customer.email"
                          label="Email"
                          disabled={fieldsDisabled}
                          value={application?.customer?.email}
                          inputRef={register({ required: true })}
                          InputLabelProps={{ shrink: true }}
                          required={true}
                          error={!!errors?.customer?.email}
                        />
                      </Grid>
                      <Grid item={true} xs={7} className={styles.fieldItem}>
                        <InputLabel
                          required={true}
                          error={!!errors?.customer?.mobile}
                          className={styles.fieldLabel}
                        >
                          Mobile Number
                        </InputLabel>
                        <Controller
                          as={
                            <PhoneInput
                              className={styles.w100}
                              international={true}
                              defaultCountry="IN"
                              country="IN"
                              name="customer.mobile"
                              error={
                                errors?.customer?.mobile
                                  ? 'Invalid Mobile'
                                  : undefined
                              }
                              label="mobile"
                              disabled={fieldsDisabled}
                            />
                          }
                          name="customer.mobile"
                          country="IN"
                          defaultValue={application?.customer?.mobile}
                          rules={{ required: true }}
                          control={control}
                        />
                      </Grid>
                      <Grid item={true} xs={7} className={styles.fieldItem}>
                        <TextField
                          className={styles.w100}
                          type="text"
                          name="customer.pan"
                          error={errors?.customer?.pan}
                          label="PAN"
                          disabled={fieldsDisabled}
                          value={application?.customer?.pan}
                          inputRef={register({
                            pattern: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
                          })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item={true} xs={7} className={styles.fieldItem}>
                        <InputLabel
                          required={true}
                          className={styles.fieldLabel}
                        >
                          Funding Required For
                        </InputLabel>
                        <Controller
                          as={
                            <Select
                              className={styles.w100}
                              name="associationType"
                              label="Association Type"
                            >
                              {customerCompanyAssociationTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          }
                          name="associationType"
                          rules={{ required: true }}
                          control={control}
                          disabled={fieldsDisabled}
                          defaultValue={application.associationType}
                        />
                      </Grid>
                      <Grid item={true} xs={7} className={styles.fieldItem}>
                        <CheckBox
                          disabled={fieldsDisabled}
                          input={{
                            value: checkUser(application.customer.id),
                            onChange: (val) => {
                              checkBoxHandler(application.customer.id, val);
                            }
                          }}
                          values={directorOptions}
                          name="isDirector"
                        />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <div className={styles.btnContainer}>
                          <Grid container={true}>
                            {fieldsDisabled ? (
                              <Button
                                variant="contained"
                                className={globalStyles.primaryCTA}
                                type="button"
                                onClick={() => toggleFieldsDisable(false)}
                              >
                                Edit
                              </Button>
                            ) : (
                              <Grid item={true} container={true}>
                                <Grid>
                                  <Button
                                    variant="contained"
                                    className={globalStyles.primaryCTA}
                                    type="submit"
                                  >
                                    Save
                                  </Button>
                                </Grid>
                                <Grid>
                                  <Button
                                    variant="outlined"
                                    className={globalStyles.primaryCTA}
                                    type="submit"
                                    onClick={() => handleCancel(application)}
                                  >
                                    Cancel
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                          <Grid container={true} item={true} justify="flex-end">
                            <Button
                              variant="contained"
                              className={globalStyles.primaryCTA}
                              type="button"
                              onClick={() => handleViewProfile(application)}
                            >
                              View Profile
                            </Button>
                          </Grid>
                        </div>
                      </Grid>
                    </form>
                  </Grid>
                </ControlledAccordion>
              </Grid>
            ))
          ) : (
            <p>No Directors/Founders Found</p>
          )}
        </Grid>
      </Grid>
      {isApplicantFormOpen && (
        <DialogComponent
          title="ADD AND LINK PERSON"
          onClose={() => toggleAddApplicantForm(false)}
        >
          <AddApplicant companyId={companyId} onClose={handleModalClose} />
        </DialogComponent>
      )}
    </Grid>
  );
};

export default CompanyApplicant;
