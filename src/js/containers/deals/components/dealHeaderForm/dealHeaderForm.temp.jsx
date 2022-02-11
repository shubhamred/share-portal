import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Input, DropDown, NumberField, TextArea, DatePickerNew, FileUploader } from 'app/components';
import FileList from 'app/containers/document/fileList/fileList';
import { currencyOptions } from 'app/constants/misc';
import styles from './styles.scss';
import { getDealImages } from '../../saga';

const DealHeaderForm = (props) => {
  const dispatch = useDispatch();
  const { handleSubmit, initialValues, initialize, getDealDocPresignedUrl, getDocConfig, dealId, docConfig, postMetaData, viewImage, removeDealImage } = props;
  const [selectedAmountUnit, setSelectedAmountUnit] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedReturnType, setSelectedReturnType] = useState('Flat Yield');
  // const [selectedcommitUnit, setselectedCommitUnit] = useState('');
  // const [selectedCommitCurrency, setSelectedCommitCurrency] = useState('');
  // eslint-disable-next-line max-len
  const unitOptions = ['Thousands', 'Lakhs', 'Crore'];
  const returnTypeOptions = ['IRR', 'Flat Yield'];
  const [dealImages, setDealImages] = useState({ DEAL_BANNER: '', DEAL_COVER: '', BRAND_LOGO: '' });
  useEffect(() => {
    if (initialValues) initialize(initialValues);
    if (getDocConfig) getDocConfig();
  }, []);

  useEffect(() => {
    if (dealId) handleDealImages();
  }, [dealId]);
  const imagesObj = {
    DEAL_BANNER: 'dealBanner',
    BRAND_LOGO: 'brandLogo',
    DEAL_COVER: 'dealCover'
  };

  const handleDealImages = () => {
    getDealImages(dealId).then((res) => {
      const DEAL_BANNER_DATA = res.data.find((data) => data.docType === 'DEAL_BANNER');
      const BRAND_LOGO_DATA = res.data.find((data) => data.docType === 'BRAND_LOGO');
      const DEAL_COVER_DATA = res.data.find((data) => data.docType === 'DEAL_COVER');
      setDealImages({ DEAL_BANNER: DEAL_BANNER_DATA, BRAND_LOGO: BRAND_LOGO_DATA, DEAL_COVER: DEAL_COVER_DATA });
    });
  };

  const handleDealImageDelete = async (id, resourceIdParam, resourceTypeParam, bankIdStringParam) => {
    dispatch({ type: 'DEAL:DEAL_IMAGES_UPDATE:DELETE', key: imagesObj[resourceTypeParam] });
    await removeDealImage(id, resourceIdParam, resourceTypeParam, bankIdStringParam);
    handleDealImages();
  };

  const handleImageSave = (resourceId, resourceType, name, type, size, docType, docCategory, key) => {
    postMetaData({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key,
      resourceCategory: 'DEAL_IMAGES'
    }).then((res) => {
      dispatch({ type: 'DEAL:DEAL_IMAGES_UPDATE:ADD', key: imagesObj[docType], value: res.data.key });
      handleDealImages();
    });
  };

  const getDocUploadConfig = (imageType) => {
    const temp = docConfig && docConfig[0].configuredDocTypes.find((type) => type.documentType.key === imageType);
    return temp.documentType;
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Grid className={styles.headerStyle} container={true} flex-direction="row" xs={12} justify="space-evenly">
        <Grid className={styles.formLabelStyle} item={true} xs={4}>
          <Field
            name="dealName"
            component={Input}
            label="Deal Name"
            type="text"
            isFieldValue={true}
          />
        </Grid>

        <Grid item={true} xs={4}>
          <Field
            name="publishedAt"
            label="Publish Date"
            placeholder="Publish Date"
            component={DatePickerNew}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <Field
            name="unPublishedAt"
            label="Unpublish Date"
            placeholder="Unpublish Date"
            component={DatePickerNew}
          />
        </Grid>

        <Grid className={styles.formLabelStyle} container={true} xs={12} justify="center" flex-direction="column">
          <Grid className={styles.formLabelStyle} item={true} xs={3}>
            <Field
              name="dealCurrency"
              label="Deal Currency"
              options={currencyOptions}
              selectedOption={selectedCurrency}
              component={DropDown}
              placeholder="Currency"
              handleSelectedOption={(value) => {
                setSelectedCurrency(value);
              }}
            />
          </Grid>
          <Grid className={styles.formLabelStyle} container={true} xs={5} justify="center" flex-direction="column">
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={4}>
                <Field
                  name="returnType"
                  options={returnTypeOptions}
                  selectedOption={selectedReturnType}
                  component={DropDown}
                  placeholder="Return Type"
                  label="Return Type"
                  handleSelectedOption={(value) => {
                    setSelectedReturnType(value);
                  }}
                />
              </Grid>
              <Grid item={true} xs={4}>
                <Field
                  name="minReturn"
                  component={NumberField}
                  label="Min Return"
                  type="text"
                  isFieldValue={true}
                />
              </Grid>
              <Grid item={true} xs={4}>
                <Field
                  name="maxReturn"
                  component={NumberField}
                  label="Max Return"
                  type="text"
                  isFieldValue={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid className={styles.formLabelStyle} container={true} xs={4} justify="center" flex-direction="column">
            <Grid className={styles.label} item={true} xs={12} sm={12}>
              Deal Amount
            </Grid>
            <Grid item={true} xs={12} container={true} flex-direction="row">
              <Grid item={true} xs={6}>
                <Field
                  name="dealAmount"
                  component={Input}
                  // label="Deal Amount"
                  placeholder="Amount"
                  type="text"
                />
              </Grid>
              <Grid item={true} xs={6}>
                <Field
                  name="dealAmountUnit"
                  options={unitOptions}
                  selectedOption={selectedAmountUnit}
                  component={DropDown}
                  placeholder="Unit"
                  handleSelectedOption={(value) => {
                    setSelectedAmountUnit(value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid className={styles.formLabelStyle} container={true} xs={12} justify="center" flex-direction="column">
        <Grid item={true} xs={12}>
          <Field
            name="description"
            component={TextArea}
            label="Description"
            placeholder="Textarea"
            type="text"
          />
        </Grid>
      </Grid>
      {/* eslint-disable-next-line max-len */}
      <Grid className={styles.formLabelStyle} container={true} xs={12} justify="center" flex-direction="column" style={{ marginTop: '7px' }}>
        <Grid item={true} xs={4} container={true} alignItems="center">
          {/* <Field */}
          {/*  name="brandLogo" */}
          {/*  components={Input} */}
          {/*  label="Brand Logo" */}
          {/*  placeholder="Brand Logo" */}
          {/*  type="text" */}
          {/*  maxNumberOfFiles={1} */}
          {/*  minNumberOfFiles={1} */}
          {/*  getPreSignedUrl={getDealDocPresignedUrl} */}
          {/*  docType={docType} */}
          {/*  docCategory={null} */}
          {/*  handleSaveMetaData={saveMetaData} */}
          {/* /> */}
          <Grid item={true} xs={6}>Brand Logo </Grid>
          <Grid item={true} xs={6}>
            { dealId && (<FileUploader
              resourceId={dealId}
              uploadedDocumentCount={dealImages.BRAND_LOGO && dealImages.BRAND_LOGO.files.length}
              resourceType="DEAL_IMAGES"
              maxNumberOfFiles={1}
              minNumberOfFiles={1}
              getPreSignedUrl={getDealDocPresignedUrl}
              docType={getDocUploadConfig('BRAND_LOGO')}
              docCategory={null}
              handleSaveMetaData={handleImageSave}
            />) }
          </Grid>
          {
            dealImages.BRAND_LOGO && <FileList
              uploadedDocs={dealImages.BRAND_LOGO.files}
              resourceType="BRAND_LOGO"
              resourceId={dealImages.BRAND_LOGO.resourceId}
              viewImage={viewImage}
              removeFile={handleDealImageDelete}
            />
          }
        </Grid>
        <Grid item={true} xs={4} container={true} alignItems="center">
          {/* <Field */}
          {/*  name="dealCover" */}
          {/*  components={Input} */}
          {/*  label="Deal Cover" */}
          {/*  placeholder="Deal Cover" */}
          {/*  type="text" */}
          {/* /> */}
          <Grid item={true} xs={6}>Deal Cover</Grid>
          <Grid item={true} xs={6}>
            { dealId && (<FileUploader
              resourceId={dealId}
              uploadedDocumentCount={dealImages.DEAL_COVER && dealImages.DEAL_COVER.files.length}
              resourceType="DEAL_IMAGES"
              maxNumberOfFiles={1}
              minNumberOfFiles={1}
              getPreSignedUrl={getDealDocPresignedUrl}
              docType={getDocUploadConfig('DEAL_COVER')}
              docCategory={null}
              handleSaveMetaData={handleImageSave}
            />) }
          </Grid>
          {
            dealImages.DEAL_COVER && <FileList
              uploadedDocs={dealImages.DEAL_COVER.files}
              resourceType="BRAND_LOGO"
              resourceId={dealImages.DEAL_COVER.resourceId}
              viewImage={viewImage}
              removeFile={handleDealImageDelete}
            />
          }
        </Grid>
        <Grid item={true} xs={4} container={true} alignItems="center">
          {/* <Field */}
          {/*  name="dealBanner" */}
          {/*  components={Input} */}
          {/*  label="Deal Banner" */}
          {/*  placeholder="Deal Banner" */}
          {/*  type="text" */}
          {/* /> */}
          <Grid item={true} xs={6}>Deal Banner</Grid>
          <Grid item={true} xs={6}>
            { dealId && (<FileUploader
              resourceId={dealId}
              uploadedDocumentCount={dealImages.DEAL_BANNER && dealImages.DEAL_BANNER.files.length}
              resourceType="DEAL_IMAGES"
              maxNumberOfFiles={1}
              minNumberOfFiles={1}
              getPreSignedUrl={getDealDocPresignedUrl}
              docType={getDocUploadConfig('DEAL_BANNER')}
              docCategory={null}
              handleSaveMetaData={handleImageSave}
            />) }
          </Grid>
          {
            dealImages.DEAL_BANNER && <FileList
              uploadedDocs={dealImages.DEAL_BANNER.files}
              resourceType="BRAND_LOGO"
              resourceId={dealImages.DEAL_BANNER.resourceId}
              viewImage={viewImage}
              removeFile={handleDealImageDelete}
            />
          }
        </Grid>
      </Grid>
    </form>
  );
};

DealHeaderForm.propTypes = {
  handleSubmit: PropTypes.func
};

DealHeaderForm.defaultProps = {
  handleSubmit: () => { }
};

export default DealHeaderForm;
