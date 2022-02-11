import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { getHashPositionValue } from 'app/utils/utils';
import {
  Input,
  DropDown,
  NumberField,
  TextArea,
  DatePickerNew,
  Button,
  RichTextEditor,
  DealFileUploader,
  CustomTabs
} from 'app/components';
import moment from 'moment';
import { currencyOptions } from 'app/constants/misc';
import { getAssetsSingedUrl } from 'app/containers/deals/saga';
import styles from './styles.scss';
import DealPerformanceStatus, { DealVisibility } from '../../../../utils/enums';
import { TrusteeList } from './data';

const DealHeaderForm = (props) => {
  const tabs = ['Deal details', 'Links', 'Ops', 'Performance', 'Trustee details'];
  const dispatch = useDispatch();
  const {
    handleSubmit,
    setBreadcrumbsData,
    position,
    initialValues,
    initialize,
    dealDetail,
    change,
    formValues,
    dealHeaderFormUpdated
  } = props;

  const [selectedAmountUnit, setSelectedAmountUnit] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedReturnType, setSelectedReturnType] = useState('Monthly');
  const [selectedVisibility, setDealVisibility] = useState(DealVisibility.NOT_VISIBLE);
  const [selectedInvestmentType, setInvestmentType] = useState('Single');
  const [selectedDealType, setDealType] = useState('');
  const [disabledMode, setDisabledMode] = useState(true);
  const [selectedPerformanceStatus, setPerformanceStatus] = useState(
    DealPerformanceStatus.ON_TRACK
  );
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedDealTag, setSelectedDealTag] = useState('');

  const dealTags = {
    FUNDING_FAST: 'Funding Fast',
    TRENDING: 'Trending',
    CLOSING_SOON: 'Closing Soon',
    NEW: 'New',
    N_DAYS_LEFT: 'N Days Left',
    NO_TAG: 'No Tag'
  };

  if (selectedDealType === 'Private' || (dealDetail.isPrivate && selectedDealType === '')) {
    dealTags.EXCLUSIVELY_FOR_YOU = 'Exclusively for you';
    dealTags.SYNDICATE_INVESTMENTS = 'Syndicate Investment';
    dealTags.FULLY_SUBSCRIBED = 'Fully subscribed';
  }

  dealTags.OTHERS = 'Others';

  const dealTagOptions = Object.values(dealTags);

  const unitOptions = ['Thousands', 'Lakhs', 'Crore'];
  const investmentTypeOptions = ['Single', 'Multiple'];
  const dealTypeOptions = ['Private', 'Public'];

  let performanceStatusOptions = [
    DealPerformanceStatus.UNDERPERFORMING,
    DealPerformanceStatus.OUTPERFORMING,
    DealPerformanceStatus.ON_TRACK,
    DealPerformanceStatus.ON_TRACK_50,
    DealPerformanceStatus.DEFAULTED
  ];

  if (dealDetail?.status === 'Fully Repaid') {
    performanceStatusOptions = [
      DealPerformanceStatus.UNDERPERFORMED,
      DealPerformanceStatus.OUTPERFORMED,
      DealPerformanceStatus.AS_PROJECTED
    ];
  }

  const returnTypeOptions = ['Monthly', 'Quarterly', 'One time'];
  const visibilityOptions = Object.values(DealVisibility);

  useEffect(() => {
    if (dealHeaderFormUpdated) {
      setDisabledMode(true);
    }
  }, [dealHeaderFormUpdated]);

  useEffect(() => {
    if (Object.keys(dealDetail).length > 0) {
      if (!dealDetail.dealTag) {
        setSelectedDealTag(dealTags.NO_TAG);
        return;
      }
      if (!dealTagOptions.includes(dealDetail.dealTag)) {
        setSelectedDealTag(dealTags.OTHERS);
      }
    }
  }, [dealDetail]);

  useEffect(() => {
    if (initialValues) initialize(initialValues);
    if (dealDetail?.performanceStatus) {
      setPerformanceStatus(dealDetail.performanceStatus);
    }

    const mData = getHashPositionValue(position - 2);
    if (mData) {
      const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
      const TabValue = tabs.findIndex((list) => list.match(re) !== null);
      if (TabValue >= 0) {
        setActiveTab(tabs[TabValue]);
        setBreadcrumbsData(tabs[TabValue], position);
      } else {
        setBreadcrumbsData(tabs[0], position, false, () => {}, true);
      }
    } else {
      setBreadcrumbsData(tabs[0], position);
    }
  }, []);

  const handleImageSave = (fieldKey, fieldValue) => {
    change(fieldKey, fieldValue);
  };

  let minUnpublishDate = moment();
  const [minDate, setMinDate] = useState('');
  const [isUnpublishedDisabled, togggleUnpublished] = useState(false);
  useEffect(() => {
    if (initialValues && initialValues.publishedAt && !initialValues.unPublishedAt) {
      const publishDateMoment = moment(initialValues.publishedAt, 'DD/MM/YYYY');
      const diff = minUnpublishDate.diff(publishDateMoment, 'days');
      if (diff < 0) {
        minUnpublishDate = moment(initialValues.publishedAt, 'DD/MM/YYYY').valueOf();
        setMinDate(minUnpublishDate);
      } else {
        setMinDate(moment.now());
      }
      togggleUnpublished(false);
    } else {
      togggleUnpublished(true);
    }
    // console.log('----->', initialValues.publishedAt, minDate);
  }, [initialValues && initialValues.publishedAt]);

  const handlePublishDateChange = (date, dateMoment) => {
    dispatch({ type: 'SET:UNPUBLISHDATE_NULL' });
    props.change('unPublishedAt', null);
    const diff = minUnpublishDate.diff(dateMoment, 'days');
    if (diff < 0) {
      setMinDate(dateMoment.toISOString());
    } else {
      setMinDate(moment().toISOString());
    }
    togggleUnpublished(false);
  };

  const showIRR = () => ['Repaying', 'Fully Repaid'].includes(dealDetail?.status);

  // eslint-disable-next-line react/no-multi-comp
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Deal details':
        return (
          <>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="dealName"
                  component={Input}
                  label="Deal Name"
                  type="text"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="dealType"
                  options={dealTypeOptions}
                  selectedOption={selectedDealType}
                  component={DropDown}
                  placeholder="Deal Type"
                  label="Deal Type"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setDealType(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="dealTag"
                  options={dealTagOptions}
                  selectedOption={selectedDealTag}
                  component={DropDown}
                  placeholder="Deal Tag"
                  label="Deal Tag"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setSelectedDealTag(value);
                  }}
                />
              </Grid>
              {selectedDealTag === dealTags.OTHERS && (
                <Grid item={true} xs={3}>
                  <Field
                    name="customDealTag"
                    component={TextArea}
                    label="Custom Deal Tag"
                    placeholder="Deal Tag"
                    disabled={disabledMode}
                    type="text"
                    maxLength={40}
                  />
                </Grid>
              )}
              <Grid item={true} xs={2}>
                <Field
                  name="score"
                  component={NumberField}
                  label="Score"
                  type="number"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="dealAmount"
                  component={Input}
                  isAmountFormat={true}
                  label="Deal Amount"
                  placeholder="Amount"
                  type="text"
                  disabled={disabledMode}
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="dealCurrency"
                  label="Deal Currency"
                  options={currencyOptions}
                  selectedOption={selectedCurrency}
                  component={DropDown}
                  placeholder="Currency"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setSelectedCurrency(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="dealAmountUnit"
                  options={unitOptions}
                  selectedOption={selectedAmountUnit}
                  component={DropDown}
                  placeholder="Unit"
                  label="Currency Unit"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setSelectedAmountUnit(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="investmentPeriod"
                  component={NumberField}
                  label="Investment Period (Months)"
                  disabled={disabledMode}
                  type="number"
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="yield"
                  component={NumberField}
                  label="Yield (%)"
                  type="number"
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="investmentFee"
                  component={NumberField}
                  label="Investment Fee (%)"
                  type="number"
                  disabled={disabledMode}
                  isFieldValue={true}
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="investmentType"
                  options={investmentTypeOptions}
                  selectedOption={selectedInvestmentType}
                  component={DropDown}
                  placeholder="Investment Type"
                  label="Investment Type"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setInvestmentType(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="minReturn"
                  component={NumberField}
                  label="Min Return (IRR) (%)"
                  type="text"
                  disabled={disabledMode}
                  isFieldValue={true}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="maxReturn"
                  component={NumberField}
                  label="Max Return (IRR) (%)"
                  type="text"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="minimumInvestment"
                  component={Input}
                  isAmountFormat={true}
                  label="Minimum Investment Amount"
                  type="number"
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="repaymentFrequency"
                  options={returnTypeOptions}
                  selectedOption={selectedReturnType}
                  component={DropDown}
                  placeholder="Repayment Frequency"
                  label="Repayment Frequency"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setSelectedReturnType(value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="visibility"
                  options={visibilityOptions}
                  selectedOption={selectedVisibility}
                  component={DropDown}
                  label="Deal Visibility"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setDealVisibility(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="moratoriumPeriod"
                  component={NumberField}
                  label="Moratorium Period (Months)"
                  type="text"
                  disabled={disabledMode}
                  isFieldValue={true}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="publishedAt"
                  label="Publish Date"
                  placeholder="Publish Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                  onDateSelect={handlePublishDateChange}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  minDate={minDate}
                  name="unPublishedAt"
                  label="Unpublish Date"
                  placeholder="Unpublish Date"
                  component={DatePickerNew}
                  disabled={disabledMode || isUnpublishedDisabled}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="revenueShare"
                  component={NumberField}
                  label="Revenue Share (%)"
                  type="number"
                  disabled={disabledMode}
                />
              </Grid>
              {showIRR() && (
                <Grid item={true} xs={2}>
                  <Field
                    name="irr"
                    component={NumberField}
                    label="IRR (%)"
                    type="number"
                    disabled={disabledMode}
                  />
                </Grid>
              )}
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={12}>
                <Field
                  name="description"
                  component={TextArea}
                  label="Description"
                  placeholder="Textarea"
                  disabled={disabledMode}
                  type="text"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <Field
                  name="shareText"
                  component={TextArea}
                  placeholder="Share Text"
                  label="Share Text"
                  disabled={disabledMode}
                  type="text"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <Field
                  name="riskAcceptanceText"
                  component={TextArea}
                  placeholder="Risk Acceptance Text"
                  label="Risk Acceptance Text"
                  disabled={disabledMode}
                  type="text"
                  maxLength={400}
                  minLength={40}
                />
              </Grid>
            </Grid>
          </>
        );
      case 'Links':
        return (
          <>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={6}>
                <Grid container={true} alignItems="flex-end">
                  <Grid item={true} xs={6}>
                    <Field
                      name="brandLogo"
                      component={Input}
                      label="Brand Logo"
                      placeholder="Brand Logo"
                      type="text"
                      disabled={disabledMode}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    {dealDetail?.dealCode && (
                      <DealFileUploader
                        uploadedURL={formValues?.brandLogo}
                        fieldName="brandLogo"
                        resourceType="deal"
                        resourceCode={dealDetail?.dealCode}
                        imageType="brand-logo"
                        getPreSignedUrl={getAssetsSingedUrl}
                        btnProps={{ disabled: disabledMode }}
                        handleSave={handleImageSave}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={true} xs={6}>
                <Grid container={true} alignItems="flex-end">
                  <Grid item={true} xs={6}>
                    <Field
                      name="dealCover"
                      component={Input}
                      label="Deal Cover"
                      placeholder="Deal Cover"
                      type="text"
                      disabled={disabledMode}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    {dealDetail?.dealCode && (
                      <DealFileUploader
                        uploadedURL={formValues?.dealCover}
                        fieldName="dealCover"
                        resourceType="deal"
                        resourceCode={dealDetail?.dealCode}
                        imageType="deal-cover"
                        getPreSignedUrl={getAssetsSingedUrl}
                        btnProps={{ disabled: disabledMode }}
                        handleSave={handleImageSave}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={6}>
                <Grid container={true} alignItems="flex-end">
                  <Grid item={true} xs={6}>
                    <Field
                      name="dealBanner"
                      component={Input}
                      label="Deal Banner"
                      placeholder="Deal Banner"
                      type="text"
                      disabled={disabledMode}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    {dealDetail?.dealCode && (
                      <DealFileUploader
                        uploadedURL={formValues?.dealBanner}
                        fieldName="dealBanner"
                        resourceType="deal"
                        resourceCode={dealDetail?.dealCode}
                        imageType="deal-banner"
                        getPreSignedUrl={getAssetsSingedUrl}
                        btnProps={{ disabled: disabledMode }}
                        handleSave={handleImageSave}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={true} xs={6}>
                <Grid container={true} alignItems="flex-end">
                  <Grid item={true} xs={6}>
                    <Field
                      name="mobileBanner"
                      component={Input}
                      label="Mobile Banner"
                      placeholder="Mobile Banner"
                      type="text"
                      disabled={disabledMode}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    {dealDetail?.dealCode && (
                      <DealFileUploader
                        uploadedURL={formValues?.mobileBanner}
                        fieldName="mobileBanner"
                        resourceType="deal"
                        resourceCode={dealDetail?.dealCode}
                        imageType="mobile-banner"
                        getPreSignedUrl={getAssetsSingedUrl}
                        btnProps={{ disabled: disabledMode }}
                        handleSave={handleImageSave}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      case 'Ops':
        return (
          <>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="docSigningDate"
                  label="Doc Signing Date"
                  placeholder="Doc Signing Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="disbursementDate"
                  label="Disbursement Date"
                  placeholder="Disbursement Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="maturityDate"
                  label="Maturity Date"
                  placeholder="Maturity Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="debentureSeries"
                  component={Input}
                  label="Debenture Series"
                  placeholder="Debenture Series"
                  type="text"
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2} />
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="baseRevenueAmount"
                  component={Input}
                  isAmountFormat={true}
                  label="Base Revenue Amount"
                  placeholder=""
                  type="text"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="lowerCapRevenuePercentage"
                  component={NumberField}
                  label="Lower Revenue Percentage (%)"
                  placeholder=""
                  type="text"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="upperCapRevenuePercentage"
                  component={NumberField}
                  label="Upper Revenue Percentage (%)"
                  placeholder=""
                  type="text"
                  isFieldValue={true}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="trusteeConsentReferenceNumber"
                  component={Input}
                  label="Trustee Consent Reference Number"
                  placeholder="Trustee Consent Reference Number"
                  type="text"
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2} />
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="boardResolutionDate"
                  label="Board Resolution Date"
                  placeholder="Board Resolution Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="egmDate"
                  label="EGM Date"
                  placeholder="EGM Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="trusteeAgreementDate"
                  label="Trustee Agreement Date"
                  placeholder="Trustee Agreement Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="engagementLetterDate"
                  label="Engagement Letter Date"
                  placeholder="Engagement Letter Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={2}>
                <Field
                  name="trusteeConsentLetterDate"
                  label="Trustee Consent Letter Date"
                  placeholder="Trustee Consent Letter Date"
                  component={DatePickerNew}
                  disabled={disabledMode}
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={12}>
                <Field
                  name="hypothicationDetail"
                  component={TextArea}
                  label="Hypothecation Detail"
                  placeholder="Textarea"
                  type="text"
                  disabled={disabledMode}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <Field
                  name="disclosureSchedule"
                  component={TextArea}
                  type="text"
                  label="Disclosure Schedule"
                  disabled={disabledMode}
                />
              </Grid>
            </Grid>
          </>
        );
      case 'Performance':
        return (
          <>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={2}>
                <Field
                  name="performanceStatus"
                  options={performanceStatusOptions}
                  selectedOption={selectedPerformanceStatus}
                  component={DropDown}
                  placeholder="Performance Status"
                  label="Performance Status"
                  disabled={disabledMode}
                  handleSelectedOption={(value) => {
                    setPerformanceStatus(value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              className={styles.headerStyle}
              container={true}
              justify="space-between"
              flex-direction="row"
              xs={12}
            >
              <Grid item={true} xs={12}>
                <Field
                  name="performanceNote"
                  disabled={disabledMode}
                  component={RichTextEditor}
                  label="Performance Note"
                />
              </Grid>
            </Grid>
          </>
        );
      case 'Trustee details':
        return (
          <>
            {TrusteeList.map((data) => (
              <Grid
                className={styles.headerStyle}
                container={true}
                justify="space-between"
                flex-direction="row"
                xs={12}
              >
                <Grid item={true} xs={12} className={styles.headerLable}>
                  {data.title}
                </Grid>
                <Grid item={true} xs={2}>
                  <Field
                    component={Input}
                    label="Name"
                    type="text"
                    propValue={data.name}
                    disabled={disabledMode}
                  />
                </Grid>
                <Grid item={true} xs={2}>
                  <Field
                    component={Input}
                    label="Email"
                    type="text"
                    propValue={data.email}
                    disabled={disabledMode}
                  />
                </Grid>
                <Grid item={true} xs={2}>
                  <Field
                    component={Input}
                    label="Phone"
                    type="text"
                    propValue={data.number}
                    disabled={disabledMode}
                  />
                </Grid>
                <Grid item={true} xs={2} />
                <Grid item={true} xs={2} />
              </Grid>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const tabChangeHandler = (tab) => {
    setActiveTab(tab);
    setBreadcrumbsData(tab, position, false, () => { }, true);
    setDisabledMode(true);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Grid item={true} xs={12}>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          handleTabClick={(tab) => tabChangeHandler(tab)}
        >
          {renderTabContent()}
        </CustomTabs>
      </Grid>
      {activeTab !== 'Trustee details' && (
        <Grid item={true} xs={12}>
          {disabledMode && (
            <Button
              style={{ backgroundColor: 'white', color: '#5A74ED' }}
              type="button"
              label="Edit"
              onClick={() => setDisabledMode(false)}
            />
          )}
          {!disabledMode && <Button type="submit" label="Save" />}
          {!disabledMode && (
            <Button
              style={{ backgroundColor: 'white', color: '#5A74ED', marginLeft: '10px' }}
              type="button"
              label="Discard"
              onClick={() => {
                initialize(initialValues);
                setDisabledMode(true);
              }}
            />
          )}
        </Grid>
      )}
    </form>
  );
};

DealHeaderForm.propTypes = {
  handleSubmit: PropTypes.func
};

DealHeaderForm.defaultProps = {
  handleSubmit: () => {}
};

export default DealHeaderForm;
