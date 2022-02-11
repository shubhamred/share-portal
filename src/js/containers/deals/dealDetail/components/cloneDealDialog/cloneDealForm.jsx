import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  AutocompleteCustom,
  Button,
  DropDown,
  Input,
  Switch
} from 'app/components';
import { getBrands } from 'app/containers/brands/saga';
import { currencyOptions } from 'app/constants/misc';
import { getApplicationsOfBrand } from 'app/containers/applications/saga';
import { FormControlLabel } from '@material-ui/core';
import styles from './styles.scss';

const CloneDealForm = (props) => {
  const { handleSubmit, deal, onSubmit, change } = props;

  const BRAND = { businessName: deal.brandName || '', id: deal.brandId, companyCode: deal.brandCode || '', companyLogo: deal.brandLogo || '' };

  const unitOptions = ['Thousands', 'Lakhs', 'Crore'];

  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);
  const [selectedAmountUnit, setSelectedAmountUnit] = useState('');
  const [selectedBrand, changeSelectedBrand] = useState(BRAND);
  const [brandList, changeBrandList] = useState([BRAND]);
  const [applicationList, setApplicationList] = useState([]);
  const [selectedApplication, setApplicationCode] = useState('');
  const [selectedDealType, setSelectedDealType] = useState(deal.isPrivate || false);
  const fields = 'businessName,id,companyCode,companyLogo';

  const handleBrandNameChange = (val) => {
    if (!val || val.length <= 2) return;
    if (val === BRAND.businessName) {
      changeBrandList([BRAND]);
      changeSelectedBrand(BRAND);
      return;
    }
    getBrands(5, undefined, val, undefined, undefined, fields).then((res) => {
      changeBrandList(res.data);
    });
  };

  const handleBrandSelect = (value) => {
    changeSelectedBrand(value);
    if (value?.id) {
      getApplicationList(value.id);
    } else {
      setApplicationCode('');
      change('applicationCode', '');
      setApplicationList([]);
    }
  };

  const handleFormSubmit = (values) => {
    if (!selectedBrand) return;
    onSubmit({
      ...values,
      isPrivate: selectedDealType,
      brandId: selectedBrand.id,
      brandCode: selectedBrand.companyCode,
      brandLogo: selectedBrand.companyLogo,
      brandName: selectedBrand.businessName
    });
    // if (deal.brandId === (selectedBrand && selectedBrand.id)) {
    //   onSubmit(values);
    // } else {
    //   onSubmit({
    //     ...values,
    //     brandId: selectedBrand.id,
    //     brandCode: selectedBrand.companyCode,
    //     brandLogo: selectedBrand.companyLogo,
    //     brandName: selectedBrand.businessName
    //   });
    // }
  };

  const getApplicationList = (companyId) => {
    getApplicationsOfBrand(companyId).then((res) => {
      if (res.data) {
        const options = res.data.map((application, index) => ({
          key: application.applicationCode,
          value: `Application ${index + 1} - ${application.applicationCode}`
        }));
        setApplicationCode('');
        change('applicationCode', '');
        setApplicationList(options);
      } else {
        setApplicationCode('');
        change('applicationCode', '');
        setApplicationList([]);
      }
    });
  };

  useEffect(() => {
    if (deal?.brandId) {
      getApplicationList(deal.brandId);
    }
  }, [deal]);

  return (
    <Grid container={true}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <AutocompleteCustom
            options={brandList || []}
            selector="businessName"
            label="Brand Name"
            required={true}
            isArray={false}
            handleSelectedOption={(e, selected) => handleBrandSelect(selected)}
            selectedOption={selectedBrand}
            debouncedInputChange={handleBrandNameChange}
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            name="applicationCode"
            label="Application"
            isRequiredField={true}
            options={applicationList}
            selectedOption={selectedApplication}
            placeholder="Select Application"
            isOtherFieldRequired={false}
            component={DropDown}
            required={true}
            handleSelectedOption={(value) => {
              setApplicationCode(value);
            }}
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={11}>
          <Field
            name="name"
            component={Input}
            isRequiredField={true}
            label="Deal Name"
            type="text"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            label="Deal Currency"
            name="dealCurrency"
            isRequiredField={true}
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
            isRequiredField={true}
            component={Input}
            isAmountFormat={true}
            placeholder="Deal amount"
          />
        </Grid>
        <Grid className={styles.formLabelStyle} item={true} xs={12}>
          <Field
            label="Currency Unit"
            isRequiredField={true}
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
          <Grid className={styles.formLabelStyle} container={true}>
            <Grid item={true} xs={10}>
              <div className={styles.label}>Private Deal</div>
            </Grid>
            <Grid item={true} xs={2}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={selectedDealType}
                    onChange={({ target }) => {
                      setSelectedDealType(target.checked);
                    }}
                    name="PrivateDeal"
                    color="primary"
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <div className={styles.buttonStyle}>
          <Button type="submit" label="Duplicate Deal" />
        </div>
      </form>
    </Grid>
  );
};

CloneDealForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  deal: PropTypes.object
};

CloneDealForm.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  deal: {}
};

export default CloneDealForm;
