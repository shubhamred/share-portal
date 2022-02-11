import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPatrons } from 'app/containers/patrons/saga';
import { AutocompleteCustom, Button, MaskedInput } from 'app/components';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch } from 'react-redux';
import { CompanyType, InvestmentTypes } from 'app/utils/enums';
import { getBrandLeadPoolNew } from 'app/containers/brands/saga';
import { getCompanyCustomers } from 'app/containers/companies/saga';
import { getDealLeadPool } from '../../saga';
import styles from './styles.scss';

const CreateInvestment = (props) => {
  const dispatch = useDispatch();
  const { createRewardStatus, createInvestment, dealId, customerId } = props;

  const [selectedCustomer, changeSelectedCustomer] = useState('');
  const [selectedCompany, changeSelectedCompany] = useState('');
  const [selectedAssociate, setAssociate] = useState({});
  const [selectedDeal, changeSelectedDeal] = useState('');
  const [customersData, setCustomersData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [dealList, changeDealList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [investmentType, setInvestmentType] = useState(InvestmentTypes.COMPANY);
  const [associatedCustomers, setAssociatedData] = useState([]);
  const [showError, toggleError] = useState({
    deal: false,
    customer: false,
    amount: false,
    company: false
  });

  useEffect(
    () => () => {
      setInputValue('');
      changeSelectedCustomer('');
      changeSelectedDeal('');
      toggleError({ deal: false, customer: false, amount: false });
    },
    [createRewardStatus, dealId, customerId]
  );

  useEffect(() => {
    if (selectedAssociate?.id) toggleError((prevState) => ({ ...prevState, customer: false }));
    if (selectedCompany?.companyCode) toggleError((prevState) => ({ ...prevState, company: false }));
    if (inputValue?.length) toggleError((prevState) => ({ ...prevState, amount: false }));
  }, [selectedAssociate, selectedCompany, inputValue]);

  // Fetch associated customers based on company selected
  useEffect(() => {
    if (selectedCompany?.id) {
      getCompanyCustomers(selectedCompany?.id)
        .then((res) => {
          if (res?.data?.length) {
            const formattedCustomers = res.data.map((cust) => ({ ...cust, ...cust.customer }));
            setAssociatedData(formattedCustomers);
          }
        });
    }
  }, [selectedCompany]);

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

  const fetchCompanies = (
    perPage,
    currentpage,
    brandname,
    selectedstatus
  ) => {
    const query = {
      limit: perPage,
      offset: currentpage + 1,
      keyword: brandname,
      status: selectedstatus,
      fields: 'businessName,companyCode,id',
      whereQuery: { companyType: CompanyType.INSTITUTIONAL_INVESTOR }
    };
    getBrandLeadPoolNew(query).then((res) => {
      if (res.data) {
        setCompanyData(res.data || []);
      }
    }).catch(() => {
    });
  };

  const handleCompanyChange = (val) => {
    if (!val || val.length <= 2) return;
    fetchCompanies(10, 0, val);
  };

  const handleDealNameChange = (val) => {
    if (!val || val.length <= 2) return;
    getDealLeadPool(10, undefined, undefined, undefined, undefined, val).then(
      (res) => {
        changeDealList(res.data);
      }
    );
  };

  const handleFormSubmit = () => {
    if (
      (dealId || (selectedDeal && selectedDeal.id))
      && ((selectedCustomer?.id) || (selectedCompany?.companyCode && selectedAssociate?.id))
      && inputValue
    ) {
      const selectedEntity = selectedCustomer?.id ? {} : { companyCode: selectedCompany.companyCode };
      const payload = {
        dealId: dealId || selectedDeal.id,
        customerId: selectedAssociate?.id || selectedCustomer.id,
        patronCode: selectedAssociate.patronCode || selectedCustomer.patronCode,
        amount: Number(inputValue),
        investmentType,
        ...(selectedEntity)
      };
      createInvestment(dealId || selectedDeal.id, payload).then((res) => {
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Investment Created Successfully',
            msgType: 'success'
          });
        }
      });
    } else {
      if (investmentType === InvestmentTypes.INDIVIDUAL && !selectedCustomer) toggleError((prevState) => ({ ...prevState, customer: true }));
      if (!selectedDeal) toggleError((prevState) => ({ ...prevState, deal: true }));
      if (!inputValue) toggleError((prevState) => ({ ...prevState, amount: true }));
      if (!selectedAssociate?.id) toggleError((prevState) => ({ ...prevState, customer: true }));
      if (!selectedCompany?.companyCode) toggleError((prevState) => ({ ...prevState, company: true }));
    }
  };

  return (
    <Grid container={true} direction="column">
      <Grid item={true} xs={12}>
        {!dealId && (
          <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
            <AutocompleteCustom
              options={dealList || []}
              selector="name"
              label="Deal Name *"
              isArray={false}
              debouncedInputChange={handleDealNameChange}
              handleSelectedOption={(e, selected) => changeSelectedDeal(selected)}
              selectedOption={selectedDeal}
            />
            {showError.deal && (
              <FormHelperText error={true}>Please Select a Deal</FormHelperText>
            )}
          </Grid>
        )}

        <Grid item={true} xs={12}>
          <FormControl style={{ width: '90%' }}>
            <InputLabel id="select-investmentType">Investment Type</InputLabel>
            <Select
              labelId="select-investmentType"
              id="select"
              value={investmentType}
              onChange={({ target }) => setInvestmentType(target.value)}
            >
              {Object.values(InvestmentTypes).map((type) => <MenuItem value={type} key={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

        {investmentType === InvestmentTypes.INDIVIDUAL
          && (
            <Grid item={true} xs={12} style={{ marginTop: '10px' }}>
              <AutocompleteCustom
                options={customersData}
                selector="name"
                label="Customer Name *"
                isArray={false}
                handleSelectedOption={(e, selected) => changeSelectedCustomer(selected)}
                selectedOption={selectedCustomer}
                debouncedInputChange={handleCustomerChange}
                id="patronBox"
              />
              {showError.customer && (
                <FormHelperText error={true}>
                  Please Select a customer
                </FormHelperText>
              )}
            </Grid>
          )}

        {investmentType === InvestmentTypes.COMPANY && (
          <Grid item={true} xs={12} style={{ marginTop: '10px' }}>
            <AutocompleteCustom
              options={companyData}
              selector="businessName"
              label="Company Name *"
              isArray={false}
              handleSelectedOption={(e, selected) => changeSelectedCompany(selected)}
              selectedOption={selectedCompany}
              debouncedInputChange={handleCompanyChange}
              id="companyBox"
            />
            {showError.company && (
              <FormHelperText error={true}>
                Please Select a company
              </FormHelperText>
            )}
          </Grid>
        )}

        {associatedCustomers?.length > 0 && (
          <Grid item={true} xs={12} style={{ marginTop: '10px' }}>
            <AutocompleteCustom
              options={associatedCustomers}
              selector="name"
              label="Customer Name *"
              isArray={false}
              handleSelectedOption={(e, selected) => setAssociate(selected)}
              selectedOption={selectedAssociate}
              id="customerBox"
            />
            {showError.customer && (
              <FormHelperText error={true}>
                Please Select a customer
              </FormHelperText>
            )}
          </Grid>
        )}

        <Grid item={true} xs={12} style={{ marginBottom: '10px' }}>
          <MaskedInput
            name="Amount"
            label="Amount *"
            handleChange={({ target: { value } }) => setInputValue(value)}
            value={inputValue}
          />
          {showError.amount && (
            <FormHelperText error={true}>Amount is Required</FormHelperText>
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
      {createRewardStatus === 'failed' && (
        <div className={styles.warning}>Reward creation failed.</div>
      )}
    </Grid>
  );
};

CreateInvestment.propTypes = {
  createInvestment: PropTypes.func,
  createRewardStatus: PropTypes.string,
  customerId: PropTypes.string,
  dealId: PropTypes.string
};

CreateInvestment.defaultProps = {
  createRewardStatus: null,
  createInvestment: () => { },
  customerId: null,
  dealId: null
};

export default CreateInvestment;
