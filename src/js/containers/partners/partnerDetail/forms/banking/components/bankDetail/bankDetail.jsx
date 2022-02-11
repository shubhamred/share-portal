import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Input, Button, CheckBox, AutocompleteCustom } from 'app/components';
import style from '../../styles.scss';

const BankDetail = (props) => {
  const { handleSubmit, bankDetail, getCustomerBankAccount, bankDetails, updateCustomerBankAccount, banks, getBanks, isSponserAccount, isEntity } = props;
  const [disabledMode, setDisabledMode] = useState(true);
  const [bankNamelist, setBankNameList] = useState([]);
  const [selectedBankId, handleSelectedBankId] = useState('');

  useEffect(() => {
    setBankNameList(banks && banks.map((bank) => bank.name));
  }, [banks]);

  useEffect(() => {
    getBanks();
  }, []);

  useEffect(() => {
    if (bankDetail && bankDetail?.id) getCustomerBankAccount(bankDetail.id);
  }, [bankDetail]);

  useEffect(() => {
    if (bankDetails && bankDetails?.bankId) handleSelectedBankId(bankDetails?.bankId);
  }, [bankDetails]);

  const handleFormSubmit = (values) => {
    const payload = {
      ...values,
      bankId: selectedBankId,
      isPrimary: values.isPrimary?.includes('isPrimary')
    };
    updateCustomerBankAccount(bankDetails.id, payload).then((res) => {
      if (res.data) {
        getCustomerBankAccount(bankDetails.id);
        setDisabledMode(true);
      }
    });
  };

  const setSelectedBank = (event, value) => {
    const filteredBank = banks.find((bank) => bank.name === value);
    handleSelectedBankId(filteredBank ? filteredBank?.id : bankDetails?.bankId);
  };

  const sponserOptions = [
    { label: isEntity ? 'is Primary ?' : 'Sponser Bank Account ?', name: 'isPrimary' }
  ];

  return (
    <Grid className={style.bankWrapper} direction="column" container={true}>
      <Grid container={true}>
        <form className={style.form} onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid className={style.fieldRowContainer} container={true} spacing={2}>
            <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="accountHolder"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Bank Account Name"
              />
            </Grid>
            <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="accountNumber"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="number"
                label="Bank Account Number"
              />
            </Grid>
            <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="bankName"
                options={bankNamelist}
                component={AutocompleteCustom}
                label="Bank Name"
                type="dropdown"
                disabled={disabledMode}
                required={false}
                handleSelectedOption={setSelectedBank}
              />
            </Grid>
          </Grid>
          <Grid className={style.fieldRowContainer} container={true} spacing={2}>
            {/* <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="bankBranch"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Bank Branch"
              />
            </Grid> */}
            <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
              <Field
                name="ifsc"
                component={Input}
                disabled={disabledMode}
                isFieldValue={true}
                inputType="text"
                label="Bank IFSC"
              />
            </Grid>
            {((!isSponserAccount && !bankDetail.isPrimary) || (isSponserAccount && bankDetail.isPrimary)) && (
              <Grid className={style.formLabelStyle} item={true} xs={12} sm={6} md={3}>
                <Field
                  name="isPrimary"
                  component={CheckBox}
                  disabled={disabledMode}
                  values={sponserOptions}
                />
              </Grid>
            )}
          </Grid>
          <Grid container={true} xs={12} justify="flex-start">
            {disabledMode && (
              <Grid className={style.formLabelStyle} item={true}>
                <Button
                  style={{ backgroundColor: 'white', color: '#5A74ED' }}
                  type="button"
                  label="Edit"
                  onClick={() => setDisabledMode(false)}
                />
              </Grid>
            )}
            {!disabledMode && (
              <>
                <Grid className={style.formLabelStyle} item={true}>
                  <Button type={disabledMode ? 'button' : 'submit'} label="Save" />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

BankDetail.propTypes = {
  handleSubmit: PropTypes.func
};

BankDetail.defaultProps = {
  handleSubmit: () => {}
};

export default BankDetail;
