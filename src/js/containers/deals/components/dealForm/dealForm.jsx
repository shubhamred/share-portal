import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  Grid,
  DialogContent,
  DialogTitle,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { upperFirst, uniq } from 'lodash';
import Alert from '@material-ui/lab/Alert';
import ButtonMaterial from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DialogActions from '@material-ui/core/DialogActions';
import Fab from '@material-ui/core/Fab';
import { getParameterValuesFromHash } from 'app/utils/utils';
import {
  DEAL_SINGLE_FIELD_UPDATE,
  DEAL_SINGLE_SECTION_UPDATE_SUCCESS
} from 'app/actions';
import { Button, HideButton, DialogComponent, Input } from 'app/components';
import styles from './styles.scss';
import DynamicForm from './dealFieldRender';
import { mapDealToFormValues, mapFormValuesToDeal } from '../../mappers';
import {
  saveSingleSection,
  getSingleSection,
  postNewField,
  deleteField,
  updateField
} from '../../saga';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(8),
    zIndex: 99
  }
}));

const fieldDesc = {
  score: '',
  calculator: '',
  content: 'About the Brand, Resugent Brand',
  bullets: 'Income and Balance sheet Highlights',
  section: 'Highlight Cards, Standard Descriptors',
  ratio: 'All corporate ratios and runway',
  list: 'Timeline, List - USPs, ',
  card: 'Offerings, Investors',
  rating: 'Market place Ratings',
  testimonial: '',
  chart: 'All charts',
  'heading-bullets': '',
  founder: '',
  media: 'Videos and News'
};

const DealForm = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  // console.log(props);
  const { dealId } = getParameterValuesFromHash('/deals/:dealId');
  const {
    fieldData,
    sectionIndex,
    dealConfig,
    submitSection,
    dealDataSections,
    changeVisibility,
    sectionVisibility,
    hideSection,
    deleteSubFieldValue,
    currentSection,
    dealFormError,
    showDealError,
    currentSectionDataUpdated,
    sectionGroups
  } = props;
  let fields = [];
  // eslint-disable-next-line consistent-return
  const findField = (name, formId, label, infoText, fieldGroupId) => {
    const fieldObject = fieldData.find((key) => key.type === name);
    // console.log({ name, formId, fieldObject, label });
    if (fieldObject) {
      const fieldKey = name;
      const temp = {
        ...fieldObject,
        title: label,
        information: infoText,
        fieldGroupId
      };
      return { fieldKey, fieldObject: temp, formId, infoText };
    }
  };

  const sectionName = (dealConfig?.config) ? Object.keys(dealConfig.config)[sectionIndex] : {};
  const [section] = dealDataSections;
  // console.log({
  //   sectionName,
  //   section,
  //   dealDataSections
  // });
  if (section && section.fields && section.fields.length > 0) {
    const fieldNameList = section.fields.map((field) => ({
      type: field.type,
      formId: field.formId,
      id: field.id,
      label: field.title || field.label,
      infoText: field.information,
      fieldGroupId: field.fieldGroupId
    }));
    fields = fieldNameList.map((name) => findField(
      name.type,
      name.id || name.formId,
      name.label,
      name.infoText,
      name.fieldGroupId
    ));
  }

  // console.log(fields, currentSection);

  const fieldLabelList = fieldData.map((singleField) => upperFirst(singleField.type));
  const finalFieldList = fieldData.map((singleField) => ({
    value: upperFirst(singleField.type),
    text: (
      <div className={styles.selectorContainer}>
        <b>{upperFirst(singleField.type)}</b>
        {' '}
        <small>
          {' '}
          {fieldDesc[singleField.type]}
          {' '}
        </small>
        {' '}
      </div>
    )
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [labelValue, setLabelValue] = useState('');
  const [selectedFieldLabel, setSelectedFieldLabel] = useState(
    fieldLabelList[0]
  );
  const [selectedFieldGroup, setSelectedGroup] = useState(
    sectionGroups && sectionGroups[0] && sectionGroups[0].id
  );

  const handleAddField = () => {
    if (!labelValue) return;
    const selectedFieldName = fieldData.find(
      (singleField) => singleField.type.toLowerCase() === selectedFieldLabel.toLowerCase()
    );
    setSelectedFieldLabel(fieldLabelList[0]);
    const payload = {
      title: labelValue,
      type: selectedFieldName.type,
      value: [],
      visibility: false,
      order: (currentSection.fields && currentSection.fields.length + 1) || 1,
      sectionId: currentSection.id,
      fieldGroupId: selectedFieldGroup
    };
    // console.log(payload);
    postNewField(payload).then((res) => {
      if (res.data) {
        dispatch({
          type: 'show',
          payload: 'Field added successfully',
          msgType: 'success'
        });
        getSingleSection(dealId, currentSection.id);
      }
    });
    // props.addField(sectionName, selectedFieldName.type, labelValue);
    setDialogOpen(false);
    setLabelValue('');
  };
  const handleCloseField = (fieldKey) => {
    // props.deleteField(sectionName, fieldKey);
    const id = fieldKey.split('_')[1];
    deleteField(id).then(() => {
      getSingleSection(dealId, currentSection.id);
    });
    setDialogOpen(false);
  };

  const submit = (values, currentFieldId) => {
    if (Object.keys(values).length > 0) {
      if (currentFieldId) {
        const [valuesUpdatedSection] = mapFormValuesToDeal(
          [currentSection],
          undefined,
          undefined,
          values
        );
        if (
          valuesUpdatedSection
          && valuesUpdatedSection.fields
          && valuesUpdatedSection.fields.length
        ) {
          const idTemp = currentFieldId.split('_')[1];
          const currentField = valuesUpdatedSection.fields.find(
            (field) => field.id === idTemp
          );
          // console.log('currentField', currentField);
          updateField(currentField.id, currentField).then((res) => {
            if (res.data) {
              dispatch({ type: DEAL_SINGLE_FIELD_UPDATE, data: res });
              dispatch({
                type: 'show',
                payload: 'Field updated successfully',
                msgType: 'success'
              });
            } else if (res.statusCode === 409) {
              dispatch({
                type: 'show',
                payload: res.message,
                msgType: 'error'
              });
            }
          });
        }
      } else {
        submitSection(sectionName, values);
      }
    }
  };

  const handleSectionSave = () => {
    saveSingleSection(dealId, currentSection.id, currentSection).then((res) => {
      if (res.data) {
        getSingleSection(dealId, currentSection.id);
      }
    });
  };

  const getInitialValues = () => {
    const { formValues } = mapDealToFormValues(
      sectionName,
      dealDataSections,
      fieldData
    );
    // console.log('getInitialValues', fields, formValues);
    return formValues;
  };

  const getVisibility = () => {
    const { visibility } = mapDealToFormValues(
      sectionName,
      dealDataSections,
      fieldData
    );
    // console.log("visibility", {
    //   visibility,
    //   sectionName,
    //   dealDataSections,
    //   fieldData,
    // });
    return visibility;
  };

  const initiateAddField = () => {
    setSelectedFieldLabel(fieldLabelList[0]);
    if (!sectionGroups.length) {
      dispatch({
        type: 'show',
        payload: 'Please add a Group before adding a Field',
        msgType: 'error'
      });
      return;
    }
    setSelectedGroup(sectionGroups[0] && sectionGroups[0].id);
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
          dispatch({
            type: DEAL_SINGLE_SECTION_UPDATE_SUCCESS,
            data: { data: res.data }
          });
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
    const allIds = messageArr.map((message) => message.split('_')[1]);
    const allMessages = allIds.map((id) => {
      const currentField = currentSection.fields.find(
        (field) => field.id === id || field.formId === id
      );
      return (currentField && currentField.title) || '';
    });
    const uniqFields = uniq(allMessages);
    // let uniqFields = allMessages;
    // uniqFields = uniqFields.map((field) => startCase(field));
    return (
      <div>
        Error: Please check the following Component
        {uniqFields.length > 1 ? 's' : null}
        :
        {uniqFields.join(', ')}
        {' '}
      </div>
    );
  };

  const handleVisibilityToggle = () => {
    hideSection(!sectionVisibility);
  };

  //
  // useEffect(() => {
  //   console.log('isInitalLoaded', isInitalLoaded);
  //   if (isInitalLoaded) {
  //     handleSectionSave();
  //   }
  // }, [sectionVisibility]);

  return (
    <Grid container={true}>
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add Component"
        variant="extended"
        onClick={initiateAddField}
      >
        <AddIcon />
        Add Component
      </Fab>
      <Grid item={true} xs={12} className={styles.stickyHeader}>
        <Grid
          container={true}
          alignItems="center"
          justify="space-between"
          className={styles.bgWhite}
        >
          <Grid container={true} xs={8} alignItems="center">
            {section && typeof section.visibility !== 'undefined' && (
              <Grid
                item={true}
                className={styles.headerMR}
                style={{ marginLeft: '35px' }}
              >
                <p
                  className={
                    section.visibility
                      ? styles.sectionVisiblity
                      : styles.sectionHidden
                  }
                >
                  {section.visibility ? 'Visible' : 'Hidden'}
                </p>
              </Grid>
            )}
            {section && section.updatedAt && (
              <Grid item={true} className={styles.headerMR}>
                <p className={styles.sectionUpdateTime}>
                  Last updated on
                  {' '}
                  {new Date(section.updatedAt).toLocaleString()}
                </p>
              </Grid>
            )}
            <Grid item={true}>
              {
                section && (
                  <HideButton
                    isSection={true}
                    hideButton={true}
                    onHideBtnClick={handleVisibilityToggle}
                    visible={sectionVisibility}
                  />
                )
              }
            </Grid>
          </Grid>
          <Grid item={true} xs={3} style={{ display: 'none' }}>
            <Grid container={true} justify="flex-end">
              <Grid item={true} className={styles.headerMR}>
                <ButtonMaterial
                  onClick={() => props.handleSectionCancel(section)}
                  variant="outlined"
                >
                  Cancel
                </ButtonMaterial>
              </Grid>
              <Grid item={true}>
                <ButtonMaterial
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSectionSave}
                >
                  Save Changes
                </ButtonMaterial>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {showDealError && dealFormError ? (
        <Grid item={true} xs={12} className={styles.errorAlert}>
          <Alert severity="error">{getErrorMessage(dealFormError)}</Alert>
        </Grid>
      ) : null}
      <DynamicForm
        sectionGroups={sectionGroups}
        fields={fields}
        currentSection={currentSection}
        onSubmit={submit}
        onCloseButtonClick={(field) => handleCloseField(field)}
        initialValues={getInitialValues()}
        visibilityValues={getVisibility()}
        deleteSubFieldValue={deleteSubFieldValue}
        changeVisibility={(fieldKey, visibilityValue) => dealFieldVisibilityChange(fieldKey, visibilityValue)}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle style={{ width: '360px' }} id="form-dialog-title">
          Add Component
        </DialogTitle>
        <DialogContent>
          <Grid item={true} xs={12} className={styles.formLabelStyle}>
            <p className={styles.formLabel}>Name of the Component</p>
            <Input
              isFieldValue={false}
              onValueChange={setLabelValue}
              propValue={labelValue}
            />
          </Grid>
          <Grid className={styles.formLabelStyle} item={true} xs={12}>
            <p className={styles.formLabel}>Select Component type</p>
            <Select
              style={{ width: '90%' }}
              value={selectedFieldLabel}
              onChange={(event) => setSelectedFieldLabel(event.target.value)}
            >
              {finalFieldList.map((label) => (
                <MenuItem key={label.value} value={label.value}>
                  {label.text}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid className={styles.formLabelStyle} item={true} xs={12}>
            <p className={styles.formLabel}>Select Group</p>
            <Select
              style={{ width: '90%' }}
              value={selectedFieldGroup}
              onChange={(event) => setSelectedGroup(event.target.value)}
            >
              {sectionGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.title}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid container={true} xs={12} justify="flex-end">
            <Grid className={styles.cancelButtonStyle} item={true}>
              <ButtonMaterial
                variant="outlined"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </ButtonMaterial>
            </Grid>
            <Grid className={styles.updateButtonStyle} item={true}>
              <ButtonMaterial
                type="button"
                variant="contained"
                color="primary"
                disabled={!labelValue.trim().length}
                onClick={() => {
                  setDialogOpen(false);
                  handleAddField();
                }}
              >
                Save
              </ButtonMaterial>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {showSaveErrorDialog && (
        <DialogComponent
          closeButton={true}
          onClose={() => toggleSaveErrorDialogue(false)}
        >
          <Grid container={true}>
            <Grid item={true} xs={12}>
              <h3>Your section data is Outdated</h3>
              <p>Please Note</p>
              {/* <p> Clicking overwrite will overwrite all changes of the previous update with new data</p> */}
              <p>
                {' '}
                Clicking Discard will overwrite the local changes with new Data
                {' '}
              </p>
            </Grid>
            <Grid item={true} xs={12}>
              <DialogActions>
                {/* <Button label="Overwrite" onClick={() => handleDealSaveStatus(0)} /> */}
                <Button
                  label="Discard"
                  onClick={() => handleDealSaveStatus(1)}
                />
              </DialogActions>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

export default DealForm;
