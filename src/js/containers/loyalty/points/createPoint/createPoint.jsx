import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  AutocompleteCustom,
  Button,
  DropDown,
  NumberField
} from 'app/components';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getPatrons } from 'app/containers/patrons/saga';
import { getBrandLeadPool } from 'app/containers/brands/saga';
import { useDispatch } from 'react-redux';
import styles from './styles.scss';

const CreatePoint = (props) => {
  const dispatch = useDispatch();
  const { pointStatus, createPoint, brandId, customerId } = props;

  const pointsTypeArr = ['Onboarding', 'Purchase'];
  const [selectedPointsType, setPointsType] = useState(pointsTypeArr[1]);
  const [selectedCustomer, changeSelectedCustomer] = useState('');
  const [selectedBrand, changeSelectedBrand] = useState('');
  const [customersData, setCustomersData] = useState([]);
  const [brandList, changeBrandList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showError, toggleError] = useState({
    deal: false,
    customer: false,
    amount: false
  });
  useEffect(() => {
    setInputValue('');
    changeSelectedCustomer('');
    changeSelectedBrand('');
    toggleError({ deal: false, customer: false, amount: false });
  }, [pointStatus, brandId, customerId]);

  useEffect(() => {
    if (customerId) {
      changeSelectedCustomer({ id: customerId });
    }
    if (brandId) {
      changeSelectedBrand({ id: brandId });
    }
  }, []);

  const handleCustomerChange = (val) => {
    if (!val || val.length <= 2) return;
    const customerQueryParams = {
      where: { firstName: { keyword: val }, isPatron: true },
      take: 5
    };
    getPatrons(customerQueryParams).then((res) => {
      setCustomersData(res.data);
    });
  };

  const handleBrandNameChange = (val) => {
    if (!val || val.length <= 2) return;
    getBrandLeadPool(5, undefined, val).then((res) => {
      changeBrandList(res.data);
    });
  };

  const handleFormSubmit = () => {
    if (
      selectedBrand
      && selectedBrand.id
      && selectedCustomer
      && selectedCustomer.id
      && inputValue
    ) {
      const payload = {
        brandId: selectedBrand.id,
        customerId: selectedCustomer.id,
        creditPoint: Number(inputValue),
        type: selectedPointsType
      };
      createPoint(payload).then((res) => {
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Points Added Successfully',
            msgType: 'success'
          });
        }
      });
    } else {
      if (!selectedCustomer) toggleError((prevState) => ({ ...prevState, customer: true }));
      if (!selectedBrand) toggleError((prevState) => ({ ...prevState, deal: true }));
      if (!inputValue) toggleError((prevState) => ({ ...prevState, amount: true }));
    }
  };
  return (
    <Grid container={true} direction="column">
      <Grid item={true} xs={12}>
        {brandId ? null : (
          <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
            <AutocompleteCustom
              options={brandList || []}
              selector="businessName"
              label="Brand *"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedBrand(selected)}
              selectedOption={selectedBrand}
              debouncedInputChange={handleBrandNameChange}
            />
            {showError.deal && (
              <FormHelperText error={true}>
                Please Select a Brand
              </FormHelperText>
            )}
          </Grid>
        )}

        {customerId ? null : (
          <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
            <AutocompleteCustom
              options={customersData}
              selector="name"
              label="Customer Name *"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedCustomer(selected)}
              selectedOption={selectedCustomer}
              debouncedInputChange={handleCustomerChange}
            />
            {showError.customer && (
              <FormHelperText error={true}>
                Please Select a customer
              </FormHelperText>
            )}
          </Grid>
        )}

        <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
          <DropDown
            name="Point Type"
            label="Point Type"
            required={true}
            handleSelectedOption={(val) => setPointsType(val)}
            options={pointsTypeArr}
            isOtherFieldRequired={false}
            selectedOption={selectedPointsType}
          />
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
          <NumberField
            name="points"
            label="Points *"
            isFieldValue={false}
            onValueChange={(val) => setInputValue(val)}
            propValue={inputValue}
          />
          {showError.amount && (
            <FormHelperText error={true}>Points is Required</FormHelperText>
          )}
        </Grid>
        <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
          <Button
            label="Create"
            onClick={handleFormSubmit}
            style={{ width: '100%' }}
          />
        </Grid>
      </Grid>
      {pointStatus === 'failed' && (
        <div className={styles.warning}>Point addition failed.</div>
      )}
    </Grid>
  );
};

CreatePoint.propTypes = {
  createPoint: PropTypes.func,
  pointStatus: PropTypes.string,
  brandId: PropTypes.string,
  customerId: PropTypes.string
};

CreatePoint.defaultProps = {
  pointStatus: null,
  brandId: null,
  customerId: null,
  createPoint: () => {}
};

export default CreatePoint;
