/* eslint-disable react/no-multi-comp,no-nested-ternary,react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Field, FieldArray, getFormSyncErrors, reduxForm } from 'redux-form';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import _ from 'lodash';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getParameterValuesFromHash } from 'app/utils/utils';
import {
  AdornmentInput,
  ControlledAccordion,
  DealFileUploader,
  DialogComponent,
  DropDown,
  HideButton,
  Input,
  NumberField,
  RichTextEditor,
  TextArea
} from 'app/components';
import { getAssetsSingedUrl, getSingleField, getSingleSection, updateFieldOrder } from 'app/containers/deals/saga';
import FileUpload from '../../fileUploadField/fileUpload';
import styles from './styles.scss';
import {
  validateMaxLength,
  validateMaxValue,
  validateMinLength,
  validateMinValue,
  validateRequired
} from './validateUtils';

const stringToComponentMapper = {
  text: Input,
  number: NumberField,
  NumberField,
  textarea: TextArea,
  TextBox: Input,
  select: DropDown,
  PercentageField: AdornmentInput,
  richtext: RichTextEditor,
  file: FileUpload,
  image: DealFileUploader
};

const CustomDropdownComponent = (props) => {
  const { input, options, ...custom } = props;
  return (
    <>
      <FormControl style={{ width: '100%' }}>
        <InputLabel>
          Group By
          {' '}
          <span className={styles.requiredStar}>*</span>
        </InputLabel>
        <Select
          {...input}
          {...custom}
          onChange={({ target }) => input.onChange(target.value)}
        >
          <MenuItem value="" disabled={true}>
            Select Group
          </MenuItem>
          {options
            && options.map((option) => (
              <MenuItem value={option.id}>{option.title}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};

const CustomDropdown = React.memo(CustomDropdownComponent);

const getFieldLength = (fieldType) => {
  if (fieldType === 'textarea' || fieldType === 'richtext') {
    return 12;
  }
  if (fieldType === 'image') {
    return 8;
  }
  return 3;
};

const getFieldSize = _.memoize(getFieldLength);

const getFieldInputType = (field) => {
  let inputType = 'text';
  if (field.fieldType) {
    if (field.fieldType === 'number') {
      inputType = 'number';
    } else if (field.fieldType === 'Hidden') {
      inputType = 'hidden';
    }
  }
  return inputType;
};

const FieldArrayComponent = (props) => {
  // console.log('FieldArrayComponent', props);
  const { fields, fieldObject, fieldValue, fieldLevel } = props;

  const handleAddField = () => (fieldObject && fieldObject.subFields ? {} : '');

  if (fields.length === 0) {
    fields.insert(0, handleAddField());
  }

  return (
    <>
      {fields.map((member, index) => {
        // eslint-disable-next-line no-unused-vars
        const temp = member; // just for retaining the console statement
        // console.log(member);
        return (
          <Grid
            container={true}
            alignItems="center"
            className={styles.sectionMargin}
            key={member}
          >
            {fieldObject && !fieldObject.subFields && fieldObject.multiple ? (
              <>
                <Grid item={true} xs={11}>
                  <FormField
                    key={member}
                    fieldName={member}
                    fieldObject={fieldObject}
                    fieldValue={fieldValue}
                    fieldLevel={fieldLevel}
                  />
                </Grid>
                <Grid item={true} xs={1}>
                  {
                    // eslint-disable-next-line max-len
                    fields.length > 1 && (
                      <RemoveCircleOutlineIcon
                        style={{ cursor: 'pointer', opacity: '0.8' }}
                        onClick={() => fields.remove(index)}
                      />
                    )
                  }
                </Grid>
              </>
            ) : (
              <>
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
                    fields.length > 1 && (
                      <RemoveCircleOutlineIcon
                        style={{ cursor: 'pointer', opacity: '0.8' }}
                        onClick={() => fields.remove(index)}
                      />
                    )
                  }
                </Grid>
              </>
            )}
          </Grid>
        );
      })}
      <Grid
        container={true}
        style={{ marginTop: '15px', marginBottom: '15px' }}
      >
        <Grid item={true} xs={12}>
          {/* <AddCircle style={{ cursor: 'pointer' }} onClick={() => handleAddSubField()} /> */}
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a
            className={styles.addField}
            onClick={() => fields.push(handleAddField())}
          >
            {fieldObject && fieldObject.subFields
              ? 'Add Field'
              : 'Add Sub-Field'}
          </a>
        </Grid>
      </Grid>
    </>
  );
};

const ArrayFieldNew = React.memo(FieldArrayComponent);

const GroupFieldComponent = (props) => {
  // console.log('GroupFieldComponent', props);
  const {
    fieldName,
    fieldObject,
    fieldValue,
    fieldLevel,
    currentSection,
    deleteSubFieldValue,
    isFromArray = false
  } = props;
  const subFieldsObj = fieldObject.subFields || [];
  const subFieldArr = _.map(subFieldsObj, (value, key) => ({ key, ...value }));
  const sortedSubFields = _.sortBy(subFieldArr, ['order']);
  // console.log({ subFieldArr, sortedSubFields });
  return (
    <Grid direction="row" xs={12} container={true} className={styles.subField}>
      {fieldLevel > 0 && fieldObject.label && (
        <Grid
          className={`${styles.label}`}
          justify="space-between"
          style={{ width: '100%' }}
        >
          {fieldObject.label}
        </Grid>
      )}
      {sortedSubFields.map((subFieldObj, subFieldIndex) => {
        let subField;
        const subFieldName = isFromArray
          ? `${fieldName}.${subFieldObj.key}`
          : `${fieldName}.${subFieldObj.key}`;
        const subFieldDefaultValue = fieldValue[subFieldObj.key] || subFieldObj.value || '';
        const subFieldLevel = fieldLevel + 1;
        const key = `${subFieldName}_${subFieldIndex}`;
        // console.log('GroupFieldComponent', { subFieldObj, subFieldName });
        if (subFieldObj && subFieldObj.multiple) {
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
        } else if (subFieldObj && subFieldObj.fieldType === 'group') {
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
  const { fieldName, fieldObject, fieldValue, fieldLevel } = props;
  const [selectedFieldValue, setSelectedFieldValue] = useState({
    [fieldName]: fieldValue
  });

  const { validation } = fieldObject || {};
  const validateArr = [validateRequired];
  let isRequired = true;
  if (validation && validation.required === false) {
    validateArr.pop();
    isRequired = false;
  }
  if (validation) {
    const { min, max, maxLength, minLength } = validation || {};
    if (typeof min !== 'undefined') validateArr.push(validateMinValue(min));
    if (typeof max !== 'undefined') validateArr.push(validateMaxValue(max));
    if (minLength) validateArr.push(validateMinLength(minLength));
    if (maxLength) validateArr.push(validateMaxLength(maxLength));
  }
  const field = (
    <Field
      name={fieldName}
      placeholder={fieldObject.label}
      component={stringToComponentMapper[fieldObject.fieldType]}
      field={fieldObject}
      selected={(selectedFieldValue && selectedFieldValue[fieldName]) || ''}
      handleChange={(value) => setSelectedFieldValue({
        [fieldName]: value
      })}
      inputType={getFieldInputType(fieldObject)}
      values={fieldObject.fieldType === 'checkbox'}
      handleCheckBoxValue={fieldObject.fieldType === 'checkbox'}
      options={fieldObject.fieldType === 'select' && fieldObject.possibleValues}
      selectedOption={
        (selectedFieldValue && selectedFieldValue[fieldName]) || ''
      }
      handleSelectedOption={(value) => setSelectedFieldValue({
        [fieldName]: value
      })}
      label={fieldLevel > 0 && fieldObject.label && fieldObject.label}
      isFieldValue={true}
      validate={validateArr}
      getPreSignedUrl={getAssetsSingedUrl}
      currentFieldName={fieldName}
      resourceType="field"
      isRequiredField={isRequired}
      {...validation}
    />
  );
  return (
    <Grid
      item={true}
      xl={
        fieldObject.fieldType === 'textarea'
        || fieldObject.fieldType === 'richtext'
          ? 8
          : 3
      }
      lg={getFieldSize(fieldObject.fieldType)}
      md={getFieldSize(fieldObject.fieldType)}
      sm={getFieldSize(fieldObject.fieldType)}
      xs={12}
      style={{ marginBottom: '15px' }}
    >
      {field}
    </Grid>
  );
};
const FormField = React.memo(FormFieldComponent);

const DynamicForm = (props) => {
  // console.log('DynamicForm', props);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.dealFieldsAreReordered) {
      const fields = currentSection.fields.map((field, index) => ({
        id: field.id,
        order: index + 1,
        version: field.version
      }));
      updateFieldOrder({ fields }).then((res) => {
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Fields reordered successfully',
            msgType: 'success'
          });
          dispatch({ type: 'DEAL_SECTION_FIELD_REORDER_RESET' });
          getSingleSection(dealId, currentSection.id);
        }
      });
      // props.submit();
      // props.initialize(props.initialValues);
    }
  }, [props.dealFieldsAreReordered]);

  useEffect(() => {
    if (!Object.keys(props.formSyncErrors).length) {
      dispatch({ type: 'REMOVE:DEAL_FORM_ERROR' });
      return;
    }
    dispatch({
      type: 'SET:DEAL_FORM_ERRORS',
      error: true,
      meta: Object.keys(props.formSyncErrors)
    });
  }, [props.formSyncErrors]);

  const [currentExpandedAcc, setAccExpand] = useState(false);

  const { dealId } = getParameterValuesFromHash('/deals/:dealId');
  const {
    fields,
    viewImage,
    removeFile,
    getDealDocPresignedUrl,
    postMetaData,
    onCloseButtonClick,
    postedMetaData,
    getDocTypeConfig,
    visibilityValues,
    changeVisibility,
    uploadedDocument,
    currentSection,
    getDocsbyId,
    metaData,
    saveMetaData,
    cancelMetaData,
    docTypeConfig,
    deleteSubFieldValue,
    sectionGroups,
    handleSubmit,
    onSubmit
  } = props;

  const isDealSectionChanged = useSelector(
    (state) => state.dealReducer.isDealSectionChanged
  );

  const getField = (
    fieldKey,
    fieldObject,
    fieldValue,
    prefix = '',
    level = 0,
    formId
  ) => {
    let field = null;
    // eslint-disable-next-line no-unused-vars
    const fieldName = `${prefix !== '' ? `${prefix}_${fieldKey}` : fieldKey}`;
    if (fieldObject) {
      if (fieldObject && fieldObject.fieldType === 'file') {
        field = (
          <Field
            label={fieldObject.label}
            name={`${fieldObject.type}_${formId}`}
            component={stringToComponentMapper[fieldObject.fieldType]}
            field={fieldObject}
            docTypeConfig={docTypeConfig}
            docCategory={fieldObject.fieldType.docCategory}
            docType={fieldObject.fieldType.docType}
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
      } else if (fieldObject && fieldObject.subFields && fieldObject.multiple) {
        field = (
          <FieldArray
            name={`${fieldObject.type}_${formId}`}
            component={ArrayFieldNew}
            fieldObject={fieldObject}
            fieldValue={fieldValue}
            fieldLevel={level}
            currentSection={currentSection}
          />
        );
      } else if (
        fieldObject
        && fieldObject.subFields
        && fieldObject.fieldType === 'group'
      ) {
        field = (
          <GroupField
            fieldName={`${fieldObject.type}_${formId}`}
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
            fieldName={`${fieldObject.type}_${formId}`}
            fieldObject={fieldObject}
            fieldValue={defaultFieldValue}
            fieldLevel={level}
          />
        );
      }
    }

    return field;
  };

  const handleLabelChange = (newLabel, fieldKey) => {
    dispatch({ type: 'DEAL_SECTION_FIELD_LABEL:UPDATE', newLabel, fieldKey });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    dispatch({
      type: 'DEAL_SECTION_FIELD_REORDER',
      source: result.source.index,
      destination: result.destination.index,
      data: currentSection
    });
  };

  const [openAlertDialog, toggleAlertDialog] = useState({
    open: false,
    expanded: false,
    accId: null
  });

  const [deleteDialog, toggleDeleteDialog] = useState({
    open: false,
    accId: null
  });

  const handleDeleteDialogClose = () => {
    toggleDeleteDialog({ accId: null, open: false });
  };

  const handleDeleteDialogOpen = (id) => {
    toggleDeleteDialog({ accId: id, open: true });
  };

  const deleteComponent = () => {
    onCloseButtonClick(deleteDialog.accId);
    handleDeleteDialogClose();
  };

  const handleToggleVisibility = (id) => {
    changeVisibility(id, !visibilityValues[id]);
  };

  const handleAccClick = (expanded, accId, fromAccordion = false) => {
    if (fromAccordion && isDealSectionChanged) {
      toggleAlertDialog({ open: true, expanded, accId });
      return;
    }

    if (expanded && accId) {
      dispatch({ type: 'SHOW_LOADER' });
      const fieldId = accId.split('_')[1];
      getSingleField(fieldId).then((res) => {
        if (res.data) {
          setAccExpand(accId);
        }
      });
    } else {
      setAccExpand(false);
    }
  };

  const handleAlertClose = () => {
    dispatch({ type: 'RESET_DEAL_SECTION_CHANGE' });
    handleAccClick(openAlertDialog.expanded, openAlertDialog.accId);
    toggleAlertDialog({ open: false, expanded: false, accId: null });
  };

  const handleAlertSave = () => {
    dispatch({ type: 'RESET_DEAL_SECTION_CHANGE' });
    if (openAlertDialog.accId) {
      const firstEl = document.querySelector(
        `[data-accordionid='${openAlertDialog.accId}'] button[type=submit]`
      );
      if (firstEl) {
        firstEl.click();
      }
    }
    toggleAlertDialog({ open: false, expanded: false, accId: null });
    handleAccClick(openAlertDialog.expanded, openAlertDialog.accId);
  };

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, currentExpandedAcc))}
      id="myDealFormId"
      className={styles.mainFormContainer}
    >
      <Grid container={true} direction="row">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <Grid
                ref={provided.innerRef}
                {...provided.droppableProps}
                container={true}
                direction="row"
              >
                {fields.map((field, index) => {
                  // console.log('field', field, currentSection);
                  const { fieldKey, fieldObject, formId } = field || {};
                  if (!fieldKey) return;
                  const fieldsArr = (currentSection && currentSection.fields) || [];
                  const currentFieldTemp = fieldsArr.find(
                    (fie) => fie.id === field.formId
                  );
                  const fieldValueObj = Array.isArray(fieldsArr)
                    && fieldsArr.find(
                      (currentField) => currentField.type === formId
                    );
                  let renderedField;
                  let fieldValue;
                  if (fieldObject && fieldObject.multiple) {
                    fieldValue = (fieldValueObj && fieldValueObj.value) || [];
                  } else if (fieldObject && fieldObject.fieldType === 'group') {
                    fieldValue = (fieldValueObj
                        && fieldValueObj.value
                        && fieldValueObj.value[0])
                      || {};
                  } else {
                    fieldValue = (fieldValueObj
                        && fieldValueObj.value
                        && fieldValueObj.value[0])
                      || '';
                  }

                  if (fieldValue) {
                    renderedField = getField(
                      fieldKey,
                      fieldObject,
                      fieldValue,
                      undefined,
                      undefined,
                      formId
                    );
                  } else {
                    renderedField = getField(
                      fieldKey,
                      fieldObject,
                      undefined,
                      undefined,
                      undefined,
                      formId
                    );
                  }
                  // console.log({
                  //   fieldObject,
                  //   field,
                  //   visibilityValues,
                  //   formId
                  // });
                  // eslint-disable-next-line consistent-return
                  return (
                    renderedField && (
                      <Draggable
                        draggableId={`${fieldObject.type}_${formId}`}
                        index={index}
                        key={`${fieldObject.type}_${formId}`}
                      >
                        {(providedChild) => (
                          <>
                            <Grid
                              item={true}
                              className={styles.fieldContainer}
                              ref={providedChild.innerRef}
                              {...providedChild.draggableProps}
                              {...providedChild.dragHandleProps}
                              data-fieldid={fieldObject.fieldGroupId}
                            >
                              <ControlledAccordion
                                heading={
                                  <>
                                    <p className={styles.mainLabel}>
                                      {fieldObject.title}
                                    </p>
                                    <div className={styles.fieldNameLabel}>
                                      {fieldObject.type}
                                    </div>
                                    {currentFieldTemp ? (
                                      <p className={styles.timeContainer}>
                                        Last updated on
                                        <time
                                          dateTime={currentFieldTemp.updatedAt}
                                          style={{ marginLeft: '4px' }}
                                        >
                                          {new Date(
                                            currentFieldTemp.updatedAt
                                          ).toLocaleString()}
                                        </time>
                                      </p>
                                    ) : null}
                                  </>
                                }
                                actions={[
                                  <div className={styles.leftAlignBtn1}>
                                    <HideButton
                                      hideButton={true}
                                      onHideBtnClick={() => handleToggleVisibility(
                                        `${fieldObject.type}_${formId}`
                                      )}
                                      visible={
                                        visibilityValues[
                                          `${fieldObject.type}_${formId}`
                                        ]
                                      }
                                    />
                                  </div>,
                                  <Button
                                    className={`${styles.fs14} ${styles.leftAlignBtn2}`}
                                    size="small"
                                    startIcon={<HighlightOffIcon />}
                                    color="secondary"
                                    onClick={() => handleDeleteDialogOpen(
                                      `${fieldObject.type}_${formId}`
                                    )}
                                  >
                                    Delete Component
                                  </Button>,
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                      dispatch({
                                        type: 'RESET_DEAL_SECTION_CHANGE'
                                      });
                                      handleAccClick(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>,
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={styles.saveBtn}
                                  >
                                    Save
                                  </Button>
                                ]}
                                id={`${fieldObject.type}_${formId}`}
                                subHeading={
                                  <p
                                    className={
                                      visibilityValues[
                                        `${fieldObject.type}_${formId}`
                                      ]
                                        ? styles.sectionVisiblity
                                        : styles.sectionHidden
                                    }
                                  >
                                    {visibilityValues[
                                      `${fieldObject.type}_${formId}`
                                    ]
                                      ? 'Visible'
                                      : 'Hidden'}
                                  </p>
                                }
                                expanded={currentExpandedAcc}
                                handleChange={handleAccClick}
                                unmountOnExit={true}
                              >
                                <Grid container={true} xs={12}>
                                  <Grid
                                    item={true}
                                    xs={3}
                                    style={{ margin: '10px 0' }}
                                  >
                                    <Input
                                      isRequiredField={true}
                                      label="Component Name"
                                      isFieldValue={false}
                                      propValue={fieldObject.title}
                                      onValueChange={(val) => handleLabelChange(
                                        val,
                                        `${fieldObject.type}_${formId}`
                                      )}
                                    />
                                  </Grid>
                                  <Grid
                                    item={true}
                                    xs={3}
                                    style={{ marginTop: '15px' }}
                                  >
                                    <Field
                                      name={`${fieldObject.type}_${formId}_group`}
                                      component={CustomDropdown}
                                      validate={[validateRequired]}
                                      options={sectionGroups || []}
                                    />
                                  </Grid>
                                  <Grid
                                    item={true}
                                    container={true}
                                    xs={12}
                                    justify="space-between"
                                  >
                                    <Grid
                                      item={true}
                                      xs={12}
                                      style={{ marginBottom: '15px' }}
                                    >
                                      <Field
                                        name={`${fieldObject.type}_${formId}_information`}
                                        component={Input}
                                        validate={[validateMinLength(10)]}
                                        label="Information"
                                      />
                                    </Grid>
                                  </Grid>
                                  {renderedField}
                                </Grid>
                              </ControlledAccordion>
                            </Grid>
                          </>
                        )}
                      </Draggable>
                    )
                  );
                })}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
      {openAlertDialog.open && (
        <DialogComponent onClose={handleAlertClose} closeButton={false}>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <p className={styles.alertTitle}> Save Changes?</p>
            </Grid>
            <Grid item={true} xs={12}>
              <p className={styles.alertContent}>
                You have unsaved changes in the Component.
              </p>
            </Grid>
            <Grid item={true} xs={12}>
              <div className={styles.alertActionContainer}>
                <Button onClick={handleAlertClose} variant="text">
                  Discard
                </Button>
                <Button
                  onClick={handleAlertSave}
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
      {deleteDialog.open && (
        <DialogComponent onClose={handleDeleteDialogClose} closeButton={false}>
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <p className={styles.alertTitle}> Are you sure?</p>
            </Grid>
            <Grid item={true} xs={12}>
              <p className={styles.alertContent}>
                This action will delete the component forever.
              </p>
            </Grid>
            <Grid item={true} xs={12}>
              <div className={styles.alertActionContainer}>
                <Button onClick={handleDeleteDialogClose} variant="text">
                  Cancel
                </Button>
                <Button
                  onClick={deleteComponent}
                  color="secondary"
                  variant="contained"
                >
                  Delete
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
    </form>
  );
};

const DynamicReduxForm = reduxForm({
  form: 'DealForm',
  enableReinitialize: true,
  destroyOnUnmount: true,
  keepDirtyOnReinitialize: false
})(DynamicForm);

export default connect((state) => ({
  formSyncErrors: getFormSyncErrors('DealForm')(state)
}))(DynamicReduxForm);
