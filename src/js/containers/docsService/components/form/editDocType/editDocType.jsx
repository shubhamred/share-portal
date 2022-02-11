import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import { Grid, FormControlLabel, Checkbox, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm, Field } from 'redux-form';
import { AutocompleteCustom, Button, Input, NumberField, RichTextEditor } from 'app/components';
import { BlazeStatus, GroStatus } from 'app/containers/applications/data';
import { fileTypeData } from '../../../mockData';
import styles from '../styles.scss';

const GreenSwitch = withStyles({
  switchBase: {
    color: '#00b300',
    '&$checked': {
      color: '#00b500'
    },
    '&$checked + $track': {
      backgroundColor: '#00b500'
    }
  },
  checked: {},
  track: {}
})(Switch);

const AddDocType = (props) => {
  const { onSubmit, handleCancel, docTypeData, resourceTypes, selectedResource } = props;
  const { documentType } = docTypeData;
  const [fileType, setFileType] = useState(
    documentType?.allowedContentTypes?.length ? documentType.allowedContentTypes : []
  );
  const [fileTypeError, setFileTypeError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [maximumFilesError, setMaximumFilesError] = useState(false);
  const [maximumFileSizeError, setMaximumFileSizeError] = useState(false);
  const [name, setName] = useState(documentType?.name || '');
  const [description, setDescription] = useState(docTypeData?.description || '');
  const [maximumFiles, setMaximumFiles] = useState(documentType?.maximumFiles || '');
  const [maximumFileSize, setMaximumFileSize] = useState(
    documentType?.maximumFileSize ? documentType.maximumFileSize / (1024 * 1024) : ''
  );
  const [isDocSigning, setIsDocSigning] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [productList, setProdList] = useState([{ name: 'BLAZE', key: 'PRD-BLAZE' }, { name: 'GRO', key: 'PRD-GRO' }]);
  // eslint-disable-next-line no-unused-vars
  const [selectedProduct, setProduct] = useState(productList.find((prod) => prod.key === selectedResource) || {});
  const [selectedAppStatus, setAppStatus] = useState({});
  const [selectedRes, setSelectedResource] = useState();

  let statusList = selectedProduct.key === 'PRD-GRO' ? GroStatus : BlazeStatus;
  statusList = statusList.map((status) => ({ name: status.label, key: status.value }));
  const resourceList = resourceTypes.map((resource) => ({ name: resource, key: resource }));

  const handleSelectAll = (selectedData, groupDataList) => {
    const isPush = selectedData.length === groupDataList.length;
    const mData = [...fileType];
    for (let i = 0; i < groupDataList.length; i += 1) {
      if (isPush) {
        const index = mData.findIndex((l) => l === groupDataList[i]);
        if (index >= 0) {
          mData.splice(index, 1);
        }
      } else if (mData.findIndex((l) => l === groupDataList[i]) < 0) {
        mData.push(groupDataList[i]);
      }
    }
    setFileType(mData);
  };

  const handleFormSubmit = () => {
    if (!name) {
      setNameError(true);
      return;
    }
    if (!maximumFiles) {
      setMaximumFilesError(true);
      return;
    }

    if (!maximumFileSize) {
      setMaximumFileSizeError(true);
      return;
    }

    if (fileType.length <= 0) {
      setFileTypeError(true);
      return;
    }
    onSubmit({
      name,
      maximumFiles,
      maximumFileSize,
      fileType,
      documentTypeId: documentType.id,
      documentCategoryId: docTypeData.id,
      description,
      resource: selectedRes,
      applicationStatus: selectedAppStatus,
      isDocSigning,
      isTemplate
    });
  };

  const handleOptionChange = (ext, isChecked) => {
    const mData = [...fileType];
    if (isChecked) {
      mData.push(ext);
    } else {
      const index = mData.findIndex((exts) => exts === ext);
      if (index >= 0) mData.splice(index, 1);
    }
    setFileType(mData);
  };

  useEffect(() => {
    if (docTypeData.resource && !selectedRes) {
      setSelectedResource({ name: docTypeData.resource, key: docTypeData.resource });
    }
    if (docTypeData.isSignatureRequired) {
      setIsDocSigning(true);
    }
    if (docTypeData.isTemplateRequired) {
      setIsTemplate(true);
    }
  }, [docTypeData]);

  const ProductStatusRow = (
    <>
      <Grid item={true} xs={6}>
        <Grid className={styles.lableStyle}>
          Resource
          {' '}
          <span className={styles.error}>*</span>
        </Grid>
        <Field
          name="resource"
          options={resourceList || []}
          selector="name"
          freeSolo={true}
          label=""
          isArray={false}
          debouncedInputChange={() => { }}
          selectedOption={selectedRes}
          handleSelectedOption={(eve, val) => {
            setSelectedResource(val);
          }}
          component={AutocompleteCustom}
          variant="standard"
        />
      </Grid>
      <Grid item={true} xs={6}>
        <Grid className={styles.lableStyle}>
          Application Status
          {' '}
          <span className={styles.error}>*</span>
        </Grid>
        <Field
          name="applicationStatus"
          options={statusList || []}
          selector="name"
          freeSolo={true}
          label=""
          isArray={false}
          debouncedInputChange={() => { }}
          selectedOption={selectedAppStatus?.key ? selectedAppStatus : docTypeData?.applicationStatus ? { name: docTypeData.applicationStatus, key: docTypeData.applicationStatus } : selectedAppStatus}
          handleSelectedOption={(eve, val) => {
            setAppStatus(val);
          }}
          component={AutocompleteCustom}
          variant="standard"
        />
      </Grid>
    </>
  );

  return (
    <Grid>
      <Grid container={true}>
        {ProductStatusRow}
        <Grid item={true} xs={5} className={styles.formLabelStyle}>
          <Input
            name="name"
            propValue={name}
            label="Name"
            onValueChange={(value) => {
              setName(value);
              if (value) {
                setNameError(false);
              } else {
                setNameError(true);
              }
            }}
            type="text"
            isFieldValue={false}
            isRequiredField={true}
          />
          {nameError && <p className={styles.error}>Please enter name</p>}
        </Grid>
        <Grid item={true} xs={1} />
        <Grid item={true} xs={6} className={styles.formLabelStyle}>
          <NumberField
            name="maximumFiles"
            label="Maximum Files"
            type="text"
            isFieldValue={false}
            onValueChange={(value) => {
              setMaximumFiles(value);
              if (value) {
                setMaximumFilesError(false);
              } else {
                setMaximumFilesError(true);
              }
            }}
            propValue={maximumFiles}
            isRequiredField={true}
          />
          {maximumFilesError && <p className={styles.error}>Please enter maximum files</p>}
        </Grid>
        <Grid item={true} xs={6} className={styles.formLabelStyle}>
          <NumberField
            name="maximumFileSize"
            label="Maximum File Size (MB)"
            isFieldValue={false}
            onValueChange={(value) => {
              setMaximumFileSize(value);
              if (value) {
                setMaximumFileSizeError(false);
              } else {
                setMaximumFileSizeError(true);
              }
            }}
            propValue={maximumFileSize}
            type="text"
            isRequiredField={true}
          />
          {maximumFileSizeError && <p className={styles.error}>Please enter maximum file size</p>}
        </Grid>
        <Grid item={true} xs={12} className={styles.formLabelStyle}>
          <Grid container={true}>
            <Grid item={true} xs={12} className={styles.formLabelStyle}>
              <RichTextEditor
                name="description"
                label="Description"
                propValue={description}
                onValueChange={(value) => {
                  setDescription(value);
                }}
              // onValueChange={(value) => handleOptionChange('description', value, docTypeData)}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <div className={styles.label} style={{ paddingBottom: '14px' }}>
                Select File Type
                {' '}
                <span className={styles.error}>*</span>
                {fileType?.length ? <span className={styles.length}>{`(${fileType?.length})`}</span> : null}
              </div>
            </Grid>
            <Grid item={true} xs={12} style={{ paddingBottom: '14px' }}>
              <Grid container={true}>
                {fileTypeData.map((data) => {
                  const selectedData = intersection(fileType, data.list);
                  return (
                    <Grid
                      xs="auto"
                      className={`${styles.innerStyle} ${selectedData.length ? styles.innerStyleActive : ''
                      }`}
                      onClick={() => handleSelectAll(selectedData, data.list)}
                    >
                      {selectedData.length
                        ? `${data.groupName} ${selectedData.length}/${data.list.length}`
                        : data.groupName}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true} className={styles.box}>
                <Grid item={true} xs={12} className={styles.fileContainer}>
                  {fileTypeData.map((data) => (
                    <Grid container={true} className={styles.boxContainer}>
                      <Grid item={true} xs={12} className={styles.boxContainerHeader}>
                        {data.groupName}
                      </Grid>
                      {data.list.map((ext) => (
                        <Grid item={true} xs={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={fileType.findIndex((l) => l === ext) >= 0}
                                onChange={({ target }) => handleOptionChange(ext, target.checked)}
                                name={ext}
                                color="primary"
                              />
                            }
                            label={ext}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              {fileTypeError && <p className={styles.error}>Select file type</p>}
            </Grid>
            <Grid item={true} xs={12} className={`${styles.formLabelStyle1} ${styles.switchDescriptor}`}>
              <Grid container={true}>
                <Grid item={true} xs={10}>
                  <div className={styles.lableStyle1}>Doc signing is Required</div>
                </Grid>
                <Grid item={true} xs={2} className={styles.switchContainer}>
                  <FormControlLabel
                    control={
                      <GreenSwitch
                        size="small"
                        checked={isDocSigning}
                        onChange={() => setIsDocSigning(!isDocSigning)}
                        color="primary"
                      />
                    }
                  />
                </Grid>
              </Grid>
              <Grid container={true}>
                <Grid item={true} className={styles.text}>
                  Does this files/documents have/required a signed copy?
                </Grid>
              </Grid>
            </Grid>
            <Grid item={true} xs={12} className={`${styles.formLabelStyle1} ${styles.switchDescriptor}`}>
              <Grid container={true}>
                <Grid item={true} xs={10}>
                  <div className={styles.lableStyle1}>Template upload required</div>
                </Grid>
                <Grid item={true} xs={2} className={styles.switchContainer}>
                  <FormControlLabel
                    control={
                      <GreenSwitch
                        size="small"
                        checked={isTemplate}
                        onChange={() => setIsTemplate(!isTemplate)}
                        color="primary"
                      />
                    }
                  />
                </Grid>
              </Grid>
              <Grid container={true}>
                <Grid item={true} className={styles.text}>
                  Templates are the files/docs that are required for a Doc type and need to be shown on Brands app for user reference.
                  <br />
                  <br />
                  For example: BR2 template are required for PAS3 filing.
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} className={styles.formLabelStyle}>
          <Grid container={true} justify="flex-end">
            <Grid item={true} xs={2}>
              <Button
                onClick={handleCancel}
                label="Cancel"
                style={{
                  backgroundColor: '#fff',
                  color: '#4754D6',
                  minWidth: 100,
                  border: 'none',
                  width: '85%',
                  margin: '0px',
                  display: 'block'
                }}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <Button
                label="Save"
                onClick={handleFormSubmit}
                style={{
                  backgroundColor: '#4754D6',
                  minWidth: 100,
                  width: '85%',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

AddDocType.propTypes = {
  docTypeData: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

AddDocType.defaultProps = {
  docTypeData: {},
  onSubmit: () => { },
  handleCancel: () => { }
};

const EditCategoryFormWrapper = reduxForm({
  form: 'addDocConfig',
  enableReinitialize: true
})(AddDocType);

export default EditCategoryFormWrapper;
