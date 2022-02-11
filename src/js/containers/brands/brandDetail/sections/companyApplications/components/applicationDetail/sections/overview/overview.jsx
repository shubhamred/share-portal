import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Grid,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { DialogComponent, Input, DropDown, NumberField } from 'app/components';
import IconButton from '@material-ui/core/IconButton';
import { getProducts } from 'app/containers/products/saga';
import { updateApplicationDetail } from 'app/containers/applications/saga';
import { getCompanies } from 'app/containers/companies/saga';
import { useDispatch } from 'react-redux';
import { getAccounts } from 'app/containers/brands/saga';
import styles from '../../style.scss';

const ApplicationFundingUse = [
  'Marketing',
  'Inventory',
  'Capex',
  'Working Capital',
  'Marketing & Working Capital',
  'Others'
];

const conditionsSubsequentStatusArray = [
  'Not Started',
  'In Progress',
  'Completed'
];

const ApplicationOverview = (props) => {
  const { application, updateData, handleSubmit } = props;
  const dispatch = useDispatch();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [isDialogOpen, toggleDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [nbfc, setNbfc] = useState([]);
  const [nbfcOptions, setNbfcOptions] = useState([]);
  const [nbfcId, setNbfcId] = useState('');
  const [selectedNbfc, setSelectedNbfc] = useState('');
  const [bankAccountList, setBankAccountList] = useState([]);

  const getBankAccounts = () => {
    if (application?.companyCode) {
      getAccounts(application?.companyCode).then((data) => {
        if (data?.data) {
          const currentAccounts = data.data?.filter((account) => account.accountType === 'Current');
          setBankAccountList(currentAccounts || []);
        }
      });
    }
  };

  useEffect(() => {
    getProducts().then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
    getBankAccounts();
  }, []);

  useEffect(() => {
    if (application && application.id) {
      setFieldsDisabled(true);
      setSelectedProduct(application.productId);
      setSelectedProductName(application?.product?.name || '');
      setNbfcId(application?.financierPartnerCode);
    }
  }, [application]);

  const query = {
    fields: 'businessName,companyCode',
    where: {
      companyType: 'NBFC'
    }
  };

  useEffect(() => {
    getCompanies(50, 1, undefined, undefined, undefined, query).then(
      (res) => {
        if (res?.data?.length > 0) {
          const companies = res.data.map((company) => company.businessName);
          setNbfcOptions(companies);
          setNbfc(res.data);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (nbfc?.length && nbfcId) {
      const filteredNbfc = nbfc.find((company) => company.companyCode === nbfcId);
      setSelectedNbfc(filteredNbfc && filteredNbfc.businessName);
    }
  }, [nbfc]);

  const handleSelectedNbfc = (value) => {
    const filteredNbfc = nbfc.find((company) => company.businessName === value);
    setNbfcId(filteredNbfc ? filteredNbfc.companyCode : '');
  };

  const handleStatusChange = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedProduct(value);
  };

  const updateStatus = () => {
    if (application.productId !== selectedProduct) {
      updateApplicationDetail(application.id, {
        productId: selectedProduct
      }).then((res) => {
        if (res.data) {
          updateData();
          const productDetail = products.find(
            (item) => item.id === selectedProduct
          );
          toggleDialog(false);
          setSelectedProductName(productDetail?.name || '');
          dispatch({
            type: 'show',
            payload: 'Application Updated Successfully',
            msgType: 'success'
          });
          setFieldsDisabled(true);
        }
      });
    } else {
      toggleDialog(false);
    }
  };

  const handleCancel = () => {
    setFieldsDisabled(true);
  };

  const onSubmit = (values) => {
    const payload = {
      ...values,
      softSanctionQuantum: +values.softSanctionQuantum,
      softSanctionRevenueShare: +values.softSanctionRevenueShare,
      softSanctionTenure: +values.softSanctionTenure,
      softSanctionYield: +values.softSanctionYield,
      operationalFrom: +values.operationalFrom
    };
    delete payload.nbfcName;
    if (nbfcId && nbfcId !== '') payload.financierPartnerCode = nbfcId;
    updateApplicationDetail(application.id, payload).then((res) => {
      if (res.data) {
        dispatch({
          type: 'show',
          payload: 'Application Updated Successfully',
          msgType: 'success'
        });
        setFieldsDisabled(true);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid container={true}>
          <Grid
            item={true}
            xs={12}
            container={true}
            alignItems="center"
            justify="space-between"
          >
            <Grid item={true} xs={12} className={styles.fieldHeading}>
              {' '}
              Application Details
              {' '}
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="requestedAmount"
                component={Input}
                isAmountFormat={true}
                label="Requested Amount"
                placeholder="Requested Amount"
                type="text"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item={true} xs={3} className={`${styles.fieldItem} w100`}>
              <InputLabel className={styles.fieldLabel}>Product</InputLabel>
              <Grid
                container={true}
                className={`${styles.mt6} ${
                  fieldsDisabled ? styles.disabledText : ''
                }`}
                justify="space-between"
              >
                <Grid item={true}>{selectedProductName}</Grid>
                <Grid item={true}>
                  <IconButton
                    aria-label="Edit"
                    style={{ padding: 0 }}
                    disabled={fieldsDisabled}
                  >
                    <EditIcon onClick={() => toggleDialog(true)} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item={true} xs={3} className={`${styles.fieldItem} w100`}>
              <Field
                name="fundingRequiredFor"
                options={ApplicationFundingUse}
                component={DropDown}
                placeholder="Funding Required For"
                label="Funding Required For"
                disabled={fieldsDisabled}
              />
            </Grid>
          </Grid>
          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={styles.seactionSpacing}
          >
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="revenue"
                component={Input}
                isAmountFormat={true}
                label="Revenue"
                placeholder="Revenue"
                type="text"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="operationalFrom"
                component={NumberField}
                min={0}
                label="Operational From"
                placeholder="Operational From"
                type="text"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <Field
                name="capitalBankAccountId"
                options={bankAccountList?.map((account) => ({
                  value: `${account?.bank?.code} - ${account.accountNumber}`,
                  key: account.id
                }))}
                component={DropDown}
                placeholder="Select account"
                label="Capital Bank Account"
                disabled={fieldsDisabled}
              />
            </Grid>
            {selectedProductName === 'Gro' && (
              <Grid item={true} xs={3} className={`${styles.fieldItem} w100`}>
                <Field
                  name="conditionsSubsequentStatus"
                  options={conditionsSubsequentStatusArray}
                  component={DropDown}
                  placeholder="Conditions Subsequent Status"
                  label="Conditions Subsequent Status"
                  disabled={fieldsDisabled}
                />
              </Grid>
            )}
          </Grid>
          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={styles.seactionSpacing}
          >
            <Grid item={true} xs={12} className={styles.fieldHeading}>
              {' '}
              Soft sanction
              {' '}
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="softSanctionQuantum"
                component={NumberField}
                label="Soft sanction Quantum"
                placeholder="Soft sanction Quantum"
                type="text"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="softSanctionYield"
                component={NumberField}
                min={0}
                max={100}
                label="Soft sanction Yield (%)"
                placeholder="Soft sanction Yield"
                type="text"
                step="any"
                disabled={fieldsDisabled}
              />
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="softSanctionRevenueShare"
                component={NumberField}
                min={0}
                max={100}
                label="Soft sanction Revenue Share(%)"
                placeholder="Soft sanction Revenue Share"
                type="text"
                step="any"
                disabled={fieldsDisabled}
              />
            </Grid>
          </Grid>
          <Grid item={true} xs={12} container={true}>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="softSanctionTenure"
                component={NumberField}
                min={0}
                label="Soft sanction Tenure (months)"
                placeholder="Soft sanction Tenure"
                type="text"
                disabled={fieldsDisabled}
              />
            </Grid>
          </Grid>
          <Grid
            item={true}
            xs={12}
            container={true}
            justify="space-between"
            alignItems="center"
            className={styles.seactionSpacing}
          >
            <Grid item={true} xs={12} className={styles.fieldHeading}>
              {' '}
              Financer Details
              {' '}
            </Grid>
            <Grid item={true} xs={3} className={styles.fieldItem}>
              <Field
                name="nbfcName"
                options={nbfcOptions}
                component={DropDown}
                selectedOption={selectedNbfc}
                label="NBFC Name"
                placeholder="NBFC Name"
                disabled={fieldsDisabled}
                handleSelectedOption={(value) => {
                  handleSelectedNbfc(value);
                }}
              />
            </Grid>
          </Grid>
          {!fieldsDisabled && (
            <Grid item={true} xs={12} container={true}>
              <Grid item={true}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.primaryBtn}
                >
                  save
                </Button>
              </Grid>
              <Grid item={true}>
                <Button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </form>
      <Grid item={true} xs={12} container={true}>
        {fieldsDisabled && (
          <Grid item={true} xs={2}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={styles.primaryBtn}
              onClick={() => setFieldsDisabled(false)}
            >
              Edit
            </Button>
          </Grid>
        )}
      </Grid>
      {isDialogOpen && (
        <DialogComponent
          onClose={() => toggleDialog(false)}
          title="Update Product"
          customWidth="400px"
        >
          <Grid container={true}>
            <Grid item={true} xs={12} className={styles.mb15}>
              <FormControl className={styles.w100}>
                <InputLabel id="application-status-select-label" error={false}>
                  Product
                </InputLabel>
                <Select
                  labelId="application-status-select-label"
                  id="application-status-select"
                  value={selectedProduct}
                  onChange={handleStatusChange}
                  className={styles.w100}
                >
                  {products?.length
                    ? products.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true} justify="flex-end">
                <Button
                  style={{ marginRight: '20px' }}
                  onClick={() => toggleDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={updateStatus}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
    </>
  );
};

ApplicationOverview.propTypes = {
  updateData: PropTypes.func,
  handleSubmit: PropTypes.func,
  application: PropTypes.object
};

ApplicationOverview.defaultProps = {
  updateData: () => {},
  handleSubmit: () => {},
  application: {}
};

export default React.memo(ApplicationOverview);
