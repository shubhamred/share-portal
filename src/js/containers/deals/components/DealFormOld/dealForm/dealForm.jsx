import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Grid, DialogContent, DialogTitle } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ButtonBase from '@material-ui/core/ButtonBase';
import { startCase, upperFirst } from 'lodash';
import Alert from '@material-ui/lab/Alert';
import ButtonMaterial from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DialogActions from '@material-ui/core/DialogActions';
import { getParameterValuesFromHash } from 'app/utils/utils';
import { DEAL_SINGLE_SECTION_UPDATE_SUCCESS } from 'app/actions';
import { Button, ItemSelector, HideButton, DialogComponent } from 'app/components';
import styles from './styles.scss';
import DynamicForm from './dealFieldRender';
import { mapDealToFormValuesOld as mapDealToFormValues, getLabelFromKey, findActiveFieldCount } from '../../../mappers';
import { saveSingleSection, getSingleSection } from '../../../saga';

const DealForm = (props) => {
  const dispatch = useDispatch();
  // console.log(props);
  const { dealId } = getParameterValuesFromHash('/deals/:dealId');
  const { fieldData, sectionIndex, dealConfig, submitSection,
    validateMaxVisible, dealDataSections, changeVisibility, sectionVisibility, hideSection, deleteSubFieldValue, currentSection, dealFormError, currentSectionDataUpdated } = props;
  let fields = [];
  let activeFieldCount = 0;
  const fieldLabelArray = [];
  const findField = (name) => {
    const fieldKey = Object.keys(fieldData).find((key) => key === name);
    const fieldObject = fieldData[fieldKey];
    // console.log({
    //   name,
    //   fieldKey,
    //   fieldObject
    // });
    return ({ fieldKey, fieldObject });
  };

  const sectionVisibleMax = Object.values(dealConfig.config)[sectionIndex].maxVisible;
  const sectionName = Object.keys(dealConfig.config)[sectionIndex];
  const [section] = dealDataSections;
  // console.log({
  //   sectionName,
  //   section,
  //   sectionVisibleMax,
  //   dealDataSections
  // });
  if (section && section.fields && section.fields.length > 0) {
    const fieldNameList = section.fields.map((field) => field.key);
    fields = fieldNameList.map((name) => findField(name));
    // eslint-disable-next-line array-callback-return
    section.fields.map((fieldValue) => {
      const labelValue = getLabelFromKey(dealConfig.config, sectionName, fieldValue);
      fieldLabelArray.push(labelValue);
    });
    activeFieldCount = findActiveFieldCount(section);
    validateMaxVisible(activeFieldCount, sectionVisibleMax);
  }

  let fieldLabelList = [];
  Object.values(fieldData).forEach((value) => {
    fieldLabelList.push(value.label);
  });
  fieldLabelList = fieldLabelList.filter((label) => !fieldLabelArray.includes(label));
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [fieldCount, setFieldCount] = useState(fieldLabelList);
  const [selectedFieldLabel, setSelectedFieldLabel] = useState(fieldLabelList[0]);
  const handleAddField = () => {
    const selectedFieldName = Object.keys(fieldData).find((key) => fieldData[key].label === selectedFieldLabel);
    fieldLabelArray.push(selectedFieldLabel);
    fieldLabelList = fieldLabelList.filter((label) => !fieldLabelArray.includes(label));
    setSelectedFieldLabel(fieldLabelList[0]);
    props.addField(sectionName, selectedFieldName, selectedFieldLabel);
    setDialogOpen(false);
    // setFieldCount(fieldCount + 1);
    validateMaxVisible(activeFieldCount, sectionVisibleMax);
  };
  // console.log(section, activeFieldCount, sectionVisibleMax);
  const handleCloseField = (fieldKey) => {
    fieldLabelArray.pop(selectedFieldLabel);
    fieldLabelList = fieldLabelList.filter((label) => !fieldLabelArray.includes(label));
    setSelectedFieldLabel(fieldLabelList[0]);
    props.deleteField(sectionName, fieldKey);

    setDialogOpen(false);
    // setFieldCount(fieldCount + 1);
    validateMaxVisible(activeFieldCount, sectionVisibleMax);
  };
  const submit = (values) => {
    // console.log(values);
    if (Object.keys(values).length > 0) {
      submitSection(sectionName, values);
    }
  };
  const getInitialValues = () => {
    const { formValues } = mapDealToFormValues(sectionName, dealDataSections, dealConfig.config);
    return formValues;
  };

  const getVisibility = () => {
    const { visibility } = mapDealToFormValues(sectionName, dealDataSections, dealConfig.config);
    return visibility;
  };

  const initiateAddField = () => {
    // Reset nextTab to avoid accidental redirection when form is submitted on clicking Add Field button
    // props.resetNextTab();
    // props.remoteSubmit();
    setSelectedFieldLabel(fieldLabelList[0]);
    setDialogOpen(true);
  };

  const dealFieldVisibilityChange = (fieldKey, visibilityValue) => {
    changeVisibility(fieldKey, sectionName, visibilityValue);
  };
  const [showSaveErrorDialog, toggleSaveErrorDialogue] = useState(false);

  const handleDealSaveStatus = (status) => {
    toggleSaveErrorDialogue(false);
    if (status) {
      getSingleSection(dealId, section.id).then((res) => {
        if (res.data) {
          dispatch({
            type: 'show',
            payload: 'Section Data Updated Successfully',
            msgType: 'success'
          });
        }
      });
    }
  };

  useEffect(() => {
    if (currentSectionDataUpdated) {
      saveSingleSection(dealId, section.id, section).then((res) => {
        dispatch({ type: 'SECTION:DETAIL:UPDATED' });
        if (res.data) {
          dispatch({ type: DEAL_SINGLE_SECTION_UPDATE_SUCCESS, data: { data: res.data } });
          dispatch({
            type: 'show',
            payload: 'Section Updated Successfully',
            msgType: 'success'
          });
        } else if (res.statusCode && res.statusCode === 409) {
          toggleSaveErrorDialogue(true);
        }
      });
    }
  }, [currentSectionDataUpdated]);

  // const handleSubFieldValueDelete = (key, field, values) => {
  //   deleteSubFieldValue(sectionName, field, values);
  // };
  // eslint-disable-next-line react/no-multi-comp
  const getErrorMessage = (messageArr) => {
    // const allMessages = messageArr.map((message) => message.split('_')[0]);
    // let uniqFields = uniq(allMessages);
    let uniqFields = messageArr;
    uniqFields = uniqFields.map((field) => startCase(field));
    return (
      <div>
        Error: Please check the following Component
        { uniqFields.length > 1 ? 's' : null}
        :
        {' '}
        { uniqFields.join(', ') }
        {' '}
      </div>
    );
  };
  // const hideErrorAlert = () => {
  //   dispatch({ type: 'REMOVE:DEAL_FORM_ERROR' });
  // };
  // console.log({
  //   fields,
  //   fieldLabelArray,
  //   fieldLabelList
  // });
  return (
    <Grid container={true} style={{ paddingLeft: '1%' }}>
      <Grid item={true} xs={12} className={styles.stickyHeader}>
        <Grid container={true} alignItems="center" justify="space-between" className={styles.bgWhite}>
          <Grid container={true} xs={8} alignItems="center">
            <Grid item={true} xs={1}>
              <IconButton onClick={props.handleBackClick}>
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item={true} xs={3}>
              {
                section && section.key && (
                  <p className={styles.sectionName}>{upperFirst(section.key) }</p>
                )
              }
            </Grid>
            { section && typeof section.visibility !== 'undefined' && (
              <Grid item={true} xs={2}>
                <p className={section.visibility ? styles.sectionVisiblity : styles.sectionHidden}>
                  {section.visibility ? 'Visible' : 'Hidden' }
                </p>
              </Grid>
            ) }
            {
              section && section.updatedAt && (
                <Grid item={true}>
                  <p className={styles.sectionUpdateTime}>
                    Last updated on
                    {' '}
                    {new Date(section.updatedAt).toLocaleString()}
                  </p>
                </Grid>
              )
            }
          </Grid>
          <Grid item={true} xs={3}>
            <Grid container={true} justify="space-around">
              <Grid item={true}>
                <ButtonMaterial onClick={() => props.handleSectionCancel(section)} variant="outlined">Cancel</ButtonMaterial>
              </Grid>
              <Grid item={true}>
                <ButtonMaterial form="myDealFormId" type="submit" variant="contained" color="primary">Save Changes</ButtonMaterial>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {
        dealFormError ? (
          <Grid item={true} xs={12} style={{ marginBottom: '20px' }}>
            <Alert severity="error">{getErrorMessage(dealFormError)}</Alert>
          </Grid>) : null
      }
      {activeFieldCount > sectionVisibleMax && (
        <div style={{ color: 'red' }}>{`Please select only ${sectionVisibleMax} fields to show`}</div>
      )}
      <Grid container={true} justify="space-between" item={true} style={{ cursor: 'pointer', marginBottom: '3%', padding: '15px 3% 0' }}>
        <HideButton isSection={true} hideButton={true} onHideBtnClick={() => hideSection(!sectionVisibility)} visible={sectionVisibility} />
        {fieldLabelList.length > 0 && (
          <ButtonBase onClick={initiateAddField}>
            <AddCircleIcon style={{ fill: '#5064e2', backgroundColor: '#ffffff', fontSize: '28' }} />
            <div style={{ marginLeft: '12px', fontSize: '20px' }}>Add Field</div>
          </ButtonBase>
        )}
      </Grid>
      <DynamicForm
        fields={fields}
        currentSection={currentSection}
        onSubmit={submit}
        onCloseButtonClick={(field) => handleCloseField(field)}
        maxVisible={sectionVisibleMax}
        initialValues={getInitialValues()}
        visibilityValues={getVisibility()}
        deleteSubFieldValue={deleteSubFieldValue}
        changeVisibility={(fieldKey, visibilityValue) => dealFieldVisibilityChange(fieldKey, visibilityValue)}
      />
      {dialogOpen && (
        <Dialog open={true} onClose={() => setDialogOpen(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add field</DialogTitle>
          <DialogContent>
            <Grid className={styles.formLabelStyle} item={true} xs={12}>
              <ItemSelector
                options={fieldLabelList}
                selectedOption={selectedFieldLabel}
                handleSelectedOption={(fieldName) => setSelectedFieldLabel(fieldName)}
              />
            </Grid>
            <Grid container={true} xs={12} justify="space-around">
              <Grid className={styles.cancelButtonStyle} item={true}>
                <Button type="button" label="Cancel" onClick={() => setDialogOpen(false)} />
              </Grid>
              <Grid className={styles.updateButtonStyle} item={true}>
                <Button type="button" label="Add" onClick={handleAddField} />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
      {
        showSaveErrorDialog && (
          <DialogComponent closeButton={true} onClose={() => toggleSaveErrorDialogue(false)}>
            <Grid container={true}>
              <Grid item={true} xs={12}>
                <h3>Your section data is Outdated</h3>
                <p>Please Note</p>
                {/* <p> Clicking overwrite will overwrite all changes of the previous update with new data</p> */}
                <p> Clicking Discard will overwrite the local changes with new Data </p>
              </Grid>
              <Grid item={true} xs={12}>
                <DialogActions>
                  {/* <Button label="Overwrite" onClick={() => handleDealSaveStatus(0)} /> */}
                  <Button label="Discard" onClick={() => handleDealSaveStatus(1)} />
                </DialogActions>
              </Grid>
            </Grid>
          </DialogComponent>
        )
      }
    </Grid>
  );
};

export default DealForm;
