import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button, Input, DropDown, Switch } from 'app/components';
import { currencyOptions } from 'app/constants/misc';
import { getApplicationsOfBrand } from 'app/containers/applications/saga';
import styles from './styles.scss';

const DealForm = (props) => {
  const { handleSubmit, brandNameList, brandDetail, applicationCode, onSubmit } = props;
  const { company } = brandDetail || {};
  const [selectedAmountUnit, setSelectedAmountUnit] = useState('Lakhs');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedApplication, setApplicationCode] = useState('');
  const [applicationList, setApplicationList] = useState([]);
  const [selectedDealType, setSelectedDealType] = useState(false);
  const unitOptions = ['Thousands', 'Lakhs', 'Crore'];
  const list = [];

  // eslint-disable-next-line no-unused-expressions
  brandNameList
    && brandNameList.map((data) => list.push(data.company.businessName));

  useEffect(() => {
    if (applicationCode) setApplicationCode(applicationCode);
  }, [applicationCode]);

  useEffect(() => {
    if (company?.id) {
      getApplicationsOfBrand(company.id).then((res) => {
        if (res.data) {
          const options = res.data.map((application, index) => ({
            key: application.applicationCode,
            value: `Application ${index + 1} - ${application.applicationCode}`
          }));
          setApplicationList(options);
        }
      });
    }
  }, [company]);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      dealType: selectedDealType ? 'Private' : 'Public'
    });
  };

  return (
    <Grid container={true} style={{ marginTop: '10px' }}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid className={styles.formLabelStyle} item={true} xs={11}>
          <Field
            name="dealName"
            component={Input}
            label="Deal Name"
            type="text"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            label="Application Code"
            name="applicationCode"
            options={applicationList}
            selectedOption={selectedApplication}
            placeholder="Select Application"
            component={DropDown}
            handleSelectedOption={(value) => {
              setApplicationCode(value);
            }}
          />
        </Grid>
        {/* <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="returnType"
            options={returnTypeOptions}
            selectedOption={selectedReturnType}
            placeholder="Return Type"
            component={DropDown}
            handleSelectedOption={(value) => {
              setSelectedReturnType(value);
            }}
          />
        </Grid> */}
        {/* <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="minReturn"
            component={NumberField}
            label="Min Return"
            type="text"
          />
        </Grid> */}
        {/* <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="maxReturn"
            component={NumberField}
            label="Max Return"
            type="text"
          />
        </Grid> */}
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            label="Deal Currency"
            name="dealCurrency"
            options={currencyOptions}
            selectedOption={selectedCurrency}
            placeholder="Currency"
            component={DropDown}
            handleSelectedOption={(value) => {
              setSelectedCurrency(value);
            }}
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={11}>
          <Field
            label="Deal Amount"
            name="dealAmount"
            component={Input}
            isAmountFormat={true}
            type="text"
            placeholder="Deal amount"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            label="Currency Unit"
            name="dealAmountUnit"
            options={unitOptions}
            selectedOption={selectedAmountUnit}
            placeholder="Unit"
            component={DropDown}
            handleSelectedOption={(value) => {
              setSelectedAmountUnit(value);
            }}
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Grid container={true}>
            <Grid className={styles.label} item={true} xs={10}>
              Private Deal
            </Grid>
            <Grid item={true} xs={2}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={selectedDealType}
                    onChange={({ target }) => { setSelectedDealType(target.checked); }}
                    name="PrivateDeal"
                    color="primary"
                  />
                  }
              />
            </Grid>
          </Grid>
        </Grid>
        <div className={styles.buttonStyle}>
          <Button type="submit" label="Create" />
        </div>
      </form>
    </Grid>
  );
};

DealForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  applicationCode: PropTypes.string,
  brandNameList: PropTypes.arrayOf(PropTypes.shape({}))
};

DealForm.defaultProps = {
  brandNameList: [],
  onSubmit: () => { },
  applicationCode: '',
  handleSubmit: () => { }
};

export default DealForm;
