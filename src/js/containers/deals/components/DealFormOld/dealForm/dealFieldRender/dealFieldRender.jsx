/* eslint-disable react/no-multi-comp,no-nested-ternary,react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Field, reduxForm, FieldArray, getFormSyncErrors } from 'redux-form';
import { connect, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import _ from 'lodash';
// import { AddCircle } from '@material-ui/icons';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { getParameterValuesFromHash } from 'app/utils/utils';
import {
  DropDown, Input, TextArea, HideButton,
  AdornmentInput, NumberField, CloseButton
} from 'app/components';
import FileUpload from '../../../fileUploadField/fileUpload';
import styles from './styles.scss';
import { validateMinLength, validateMaxLength, validateRequired, validateMaxValue,
  validateMinValue } from './validateUtils';
// import MultipleSubField from './multipleSubfieldComponent';

const stringToComponentMapper = {
  Hidden: Input,
  NumberRange: NumberField,
  NumberField,
  TextArea,
  TextBox: Input,
  Dropdown: DropDown,
  PercentageField: AdornmentInput,
  FileUpload
};

const getFieldInputType = (field) => {
  let inputType = 'text';
  if (field.meta) {
    if (field.meta.ui.component === 'NumberField'
      || field.meta.ui.component === 'NumberRange') {
      inputType = 'number';
    } else if (field.meta.ui.component === 'Hidden') {
      inputType = 'hidden';
    }
  }

  return inputType;
};

const FieldArrayComponent = (props) => {
  // console.log('FieldArrayComponent', props);
  const { fields, fieldObject, fieldValue, fieldLevel } = props;
  if (fields.length === 0) {
    fields.insert(0, {});
  }
  return (
    <>
      {fields.map((member, index) => {
        // eslint-disable-next-line no-unused-vars
        const temp = member; // just for retaining the console statement
        return (
          <Grid container={true} alignItems="center" className={styles.sectionMargin} key={member}>
            <Grid item={true} xs={11}>
              <GroupField
                fieldName={member}
                fieldObject={fieldObject}
                fieldValue={fieldValue}
                fieldLevel={fieldLevel}
                isFromArray={true}
              />
            </Grid>
            <Grid item={true} xs={1}>
              {
                // eslint-disable-next-line max-len
                (fields.length > 1) && <RemoveCircleOutlineIcon style={{ cursor: 'pointer', opacity: '0.8' }} onClick={() => fields.remove(index)} />
              }
            </Grid>
          </Grid>
        );
      })}
      <Grid container={true} style={{ marginTop: '15px', marginBottom: '15px' }}>
        <Grid item={true} xs={12}>
          {/* <AddCircle style={{ cursor: 'pointer' }} onClick={() => handleAddSubField()} /> */}
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a className={styles.addField} onClick={() => fields.push({})}>Add Field </a>
        </Grid>
      </Grid>
    </>
  );
};

const ArrayFieldNew = React.memo(FieldArrayComponent);

const GroupFieldComponent = (props) => {
  // console.log('GroupFieldComponent', props);
  const { fieldName, fieldObject, fieldValue, fieldLevel, currentSection, deleteSubFieldValue, isFromArray = false } = props;
  const subFieldsObj = fieldObject.subFields || [];
  const subFieldArr = _.map(subFieldsObj, (value, key) => ({ key, ...value }));
  const sortedSubFields = _.sortBy(subFieldArr, ['order']);
  return (
    <Grid direction="row" xs={12} container={true} className={styles.subField}>
      {
        (fieldLevel > 0 && fieldObject.label) && (
          <Grid className={`${styles.label}`} justify="space-between">
            {fieldObject.label}
          </Grid>
        )
      }
      {sortedSubFields.map((subFieldObj, subFieldIndex) => {
        let subField;
        const subFieldName = isFromArray ? `${fieldName}.${subFieldObj.key}` : `${fieldName}.${subFieldObj.key}`;
        const subFieldDefaultValue = fieldValue[subFieldObj.key] || subFieldObj.value || '';
        const subFieldLevel = fieldLevel + 1;
        const key = `${subFieldName}_${subFieldIndex}`;
        // console.log('GroupFieldComponent', subFieldObj.valueType, subFieldDefaultValue, subFieldName);
        if (subFieldObj && subFieldObj.subFields && subFieldObj.valueType
          && subFieldObj.valueType === 'array') {
          subField = (
            <FieldArray
              key={key}
              name={subFieldName}
              component={ArrayFieldNew}
              fieldObject={subFieldObj}
              fieldValue={subFieldDefaultValue}
              fieldLevel={subFieldLevel}
              currentSection={currentSection}
              deleteSubFieldValue={deleteSubFieldValue}
            />
          );
        } else if (subFieldObj && subFieldObj.subFields && subFieldObj.valueType
          && subFieldObj.valueType !== 'array') {
          subField = (
            <GroupField
              key={key}
              fieldName={subFieldName}
              fieldObject={subFieldObj}
              fieldValue={subFieldDefaultValue}
              fieldLevel={subFieldLevel}
              currentSection={currentSection}
              deleteSubFieldValue={deleteSubFieldValue}
            />
          );
        } else {
          subField = (
            <FormField
              key={key}
              fieldName={subFieldName}
              fieldObject={subFieldObj}
              fieldValue={subFieldDefaultValue}
              fieldLevel={subFieldLevel}
            />
          );
        }

        return subField;
      })}
    </Grid>
  );
};

const GroupField = React.memo(GroupFieldComponent);

const FormFieldComponent = (props) => {
  // console.log('FormFieldComponent', props);
  const { fieldName, fieldObject, fieldValue, fieldLevel } = props;
  const [selectedFieldValue, setSelectedFieldValue] = useState({
    [fieldName]: fieldValue
  });

  const { meta } = fieldObject || {};
  const { validation } = meta || {};
  const validateArr = [];
  if (fieldObject.meta.ui.component !== 'Hidden') {
    validateArr.push(validateRequired);
  }
  if (validation) {
    const { min, max, maxLength, minLength } = validation || {};
    if (min) validateArr.push(validateMinValue(min));
    if (max) validateArr.push(validateMaxValue(max));
    if (minLength) validateArr.push(validateMinLength(minLength));
    if (maxLength) validateArr.push(validateMaxLength(maxLength));
  }
  // validate={(value) => validate(value, fieldObject)}
  const field = (
    <Field
      name={fieldName}
      placeholder={fieldObject.label}
      component={stringToComponentMapper[fieldObject.meta.ui.component]}
      field={fieldObject}
      selected={(selectedFieldValue && selectedFieldValue[fieldName]) || ''}
      handleChange={(value) => setSelectedFieldValue({
        [fieldName]: value
      })}
      inputType={getFieldInputType(fieldObject)}
      values={fieldObject.type === 'checkbox'}
      handleCheckBoxValue={fieldObject.type === 'checkbox'}
      options={fieldObject.meta.ui.component === 'Dropdown'
      && fieldObject.meta.possibleValues}
      selectedOption={(selectedFieldValue && selectedFieldValue[fieldName]) || ''}
      handleSelectedOption={(value) => setSelectedFieldValue({
        [fieldName]: value
      })}
      label={(fieldObject.meta.ui.component !== 'Hidden' && fieldLevel > 0 && fieldObject.label) && fieldObject.label}
      isFieldValue={true}
      validate={validateArr}
      {...validation}
    />
  );
  return (
    <Grid
      item={true}
      xl={(fieldObject.meta.ui.component === 'Hidden') ? 0 : 3}
      lg={(fieldObject.meta.ui.component === 'Hidden') ? 0 : (fieldObject.meta.ui.component === 'TextArea') ? 8 : 3}
      md={(fieldObject.meta.ui.component === 'Hidden') ? 0 : 6}
      sm={(fieldObject.meta.ui.component === 'Hidden') ? 0 : 6}
      xs={(fieldObject.meta.ui.component === 'Hidden') ? 0 : 12}
      style={{ marginBottom: '15px' }}
    >
      {field}
    </Grid>
  );
};
const FormField = React.memo(FormFieldComponent);

const DynamicForm = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Object.keys(props.formSyncErrors).length) {
      dispatch({ type: 'REMOVE:DEAL_FORM_ERROR' });
      return;
    }
    dispatch({ type: 'SET:DEAL_FORM_ERRORS', error: true, meta: Object.keys(props.formSyncErrors) });
  }, [props.formSyncErrors]);

  const paramValues = getParameterValuesFromHash('/deals/:dealId');
  const { dealId } = paramValues;
  const { fields, viewImage, removeFile, getDealDocPresignedUrl, postMetaData, onCloseButtonClick, postedMetaData, getDocTypeConfig,
    visibilityValues, changeVisibility, uploadedDocument, currentSection, getDocsbyId, metaData, saveMetaData, cancelMetaData, docTypeConfig, deleteSubFieldValue } = props;
  const getField = (fieldKey, fieldObject, fieldValue, prefix = '', level = 0) => {
    let field = null;
    const fieldName = `${(prefix !== '') ? `${prefix}_${fieldKey}` : fieldKey}`;
    if (fieldObject) {
      if (fieldObject.meta && fieldObject.meta.ui.component === 'FileUpload') {
        field = (
          <Field
            label={fieldObject.label}
            name={fieldName}
            component={stringToComponentMapper[fieldObject.meta.ui.component]}
            field={fieldObject}
            docTypeConfig={docTypeConfig}
            docCategory={fieldObject.meta.fileUploadInfo.docCategory}
            docType={fieldObject.meta.fileUploadInfo.docType}
            viewImage={viewImage}
            getPreSignedUrl={getDealDocPresignedUrl}
            postMetaData={postMetaData}
            removeFile={removeFile}
            applicationId={dealId}
            uploadedDocument={uploadedDocument}
            getDocTypeConfig={getDocTypeConfig}
            hideButton={true}
            onHideBtnClick={() => changeVisibility(fieldKey, !visibilityValues[fieldKey])}
            visible={visibilityValues[fieldKey]}
            getDocsbyId={getDocsbyId}
            saveMetaData={saveMetaData}
            cancelMetaData={cancelMetaData}
            metaData={metaData}
            postedMetaData={postedMetaData}
          />
        );
      } else if (fieldObject && fieldObject.subFields && fieldObject.valueType
        && fieldObject.valueType === 'array') {
        field = (
          <FieldArray
            name={fieldName}
            component={ArrayFieldNew}
            fieldObject={fieldObject}
            fieldValue={fieldValue}
            fieldLevel={level}
            currentSection={currentSection}
          />
        );
      } else if (fieldObject && fieldObject.subFields && fieldObject.valueType !== 'array') {
        field = (
          <GroupField
            fieldName={fieldName}
            fieldObject={fieldObject}
            fieldValue={fieldValue}
            fieldLevel={level}
            currentSection={currentSection}
            deleteSubFieldValue={deleteSubFieldValue}
          />
        );
      } else {
        const defaultFieldValue = (fieldValue && fieldValue[fieldKey]) || fieldObject.value || '';
        field = (
          <FormField
            fieldName={fieldName}
            fieldObject={fieldObject}
            fieldValue={defaultFieldValue}
            fieldLevel={level}
          />
        );
      }
    }

    return field;
  };

  return (
    <form style={{ width: 'inherit', padding: '0 4%' }} onSubmit={props.handleSubmit} id="myDealFormId">
      <Grid container={true} direction="row">
        {fields.map((field) => {
          const { fieldKey, fieldObject } = field;
          const fieldsArr = (currentSection && currentSection.fields) || [];
          const fieldValueObj = Array.isArray(fieldsArr) && fieldsArr.find((currentField) => currentField.key === fieldKey);
          let renderedField;
          let fieldValue;
          if (fieldObject && fieldObject.valueType === 'array') {
            fieldValue = (fieldValueObj && fieldValueObj.value) || [];
          } else if (fieldObject && fieldObject.valueType === 'object') {
            fieldValue = (fieldValueObj && fieldValueObj.value && fieldValueObj.value[0]) || {};
          } else {
            fieldValue = (fieldValueObj && fieldValueObj.value && fieldValueObj.value[0]) || '';
          }

          if (fieldValue) {
            renderedField = getField(fieldKey, fieldObject, fieldValue);
          } else {
            renderedField = getField(fieldKey, fieldObject);
          }
          return renderedField && (
            <Grid
              item={true}
              className={styles.fieldContainer}
              key={fieldKey}
            >
              <Grid className={`${styles.label} ${styles.mainLabel}`} justify="space-between">
                {fieldObject.label}
                <div className={styles.buttons}>
                  <HideButton
                    hideButton={true}
                    onHideBtnClick={() => changeVisibility(fieldKey, !visibilityValues[fieldKey])}
                    visible={visibilityValues[fieldKey]}
                  />
                  <CloseButton onCloseButtonClick={() => onCloseButtonClick(fieldKey)} />
                </div>
              </Grid>
              {renderedField}
            </Grid>
          );
        })}
      </Grid>
    </form>
  );
};

const DynamicReduxForm = reduxForm({
  form: 'DealForm',
  enableReinitialize: true,
  destroyOnUnmount: true,
  keepDirtyOnReinitialize: true
})(DynamicForm);

export default connect((state) => ({
  formSyncErrors: getFormSyncErrors('DealForm')(state)
}))(DynamicReduxForm);
