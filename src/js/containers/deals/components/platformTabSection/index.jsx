import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { destroy } from 'redux-form';
import {
  Button as MaterialBtn,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Button, Input, NavBarComponent } from 'app/components';
// eslint-disable-next-line no-unused-vars
import { sortBy, upperFirst, groupBy } from 'lodash';
import DealForm from '../dealForm';
import {
  addSingleSection,
  getAllGroup,
  getAllSections,
  getSingleSection,
  postNewGroup
} from '../../saga';

import styles from './styles.scss';

const ALL_FIELDS = { title: 'Show All Fields', id: 0 };

const useStyles = makeStyles(() => ({
  background: {
    background: '#fff',
    boxShadow: '0px 7px 9px -5px #dad5d5',
    maxHeight: '50px'
  },
  shadowHide: {
    boxShadow: 'none'
  },
  btn: {
    color: '#1518af'
  }
}));

const PlatFormTabSection = (props) => {
  // console.log(props);
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'RESET_DEAL_DETAIL' });
  }, []);
  const currentSection = useSelector(
    (state) => state.dealReducer.currentSectionData
  );
  const currentSectionGroups = useSelector(
    (state) => state.dealReducer.sectionGroups
  );
  const selctedGroups = useSelector(
    (state) => state.dealReducer.selectedGroups
  );

  const isDealSectionChanged = useSelector(
    (state) => state.dealReducer.isDealSectionChanged
  );
  const formSelect = useSelector((state) => state.form);
  const [currentTab, setTab] = useState(0);
  const [openGroupModal, toggleGroupModal] = useState(false);
  const [labelDialogOpen, toggleLabelDialog] = useState(false);
  const [labelValue, setLabelValue] = useState('');
  const [groupLabel, setGroupLabel] = useState('');
  const [groupListSelected, setGroupList] = useState([ALL_FIELDS]);
  const [currentGroup, setCurrentGroup] = useState(ALL_FIELDS.id);
  const [currentGroupFields, setCurrentGroupFields] = useState(null);

  const { changeSectionVisibility, deal, sectionConfig, setBreadcrumbsData, position } = props;

  const sortedSections = deal && sortBy(deal.sections || [], 'order');

  const [currentSectionConfig, setCurrentSectionConfig] = useState(
    sectionConfig
  );

  const sectionVisibility = currentSection && currentSection.length
    ? currentSection[0].visibility
    : false;

  useEffect(() => {
    if (sectionConfig) {
      setCurrentSectionConfig(sectionConfig);
    }
    if (sortedSections.length) {
      handleSectionClick(sortedSections[0]);
    }
  }, [deal, sectionConfig]);

  useEffect(() => {
    if (sortedSections.length) {
      setBreadcrumbsData(sortedSections[currentTab].name, position, true);
      setBreadcrumbsData('Show All Fields', position + 1, true);
    }
  }, [currentTab]);

  const changeVisibility = (visibilityValue) => {
    const sectionName = currentSection[0].key;
    changeSectionVisibility(visibilityValue, sectionName);
  };
  const handleSectionClick = (item) => {
    if (item.id) {
      getAllGroup();
      // eslint-disable-next-line no-unused-vars
      getSingleSection(deal.id, item.id).then((res) => {
        // if (res.data) {
        //   if (res.data.fields && res.data.fields.length) {
        //     const t = groupBy(res.data.fields, 'group');
        //     res.data.fields = Object.values(t).flat();
        //
        //     setSectionGroups(Object.keys(t));
        //     return;
        //   }
        //   setSectionGroups([]);
        //   setCurrentSectionData([res.data]);
        // } else {
        //   handleBackClick();
        // }
      });
    }
  };

  const handleSectionCancel = (section) => {
    handleSectionClick(section);
  };
  const handleBackClick = () => {
    getAllSections(deal.id);
    setCurrentSectionConfig(null);
    dispatch({ type: 'DEAL_SECTION:SET_NULL' });
    Object.keys(formSelect).map((formName) => destroy(formName));
  };
  const handleAddField = () => {
    if (!labelValue) return;
    toggleLabelDialog(false);
    setLabelValue('');
    const data = {
      dealId: deal.id,
      visibility: false,
      order: (deal.sections && deal.sections.length + 1) || 1,
      name: labelValue
    };
    addSingleSection(data).then((res) => {
      if (res.data) {
        getAllSections(deal.id);
        // setCurrentSectionData([res.data]);
      }
    });
  };

  const AddSectionBtn = (
    <MaterialBtn
      startIcon={<AddIcon />}
      onClick={() => toggleLabelDialog(true)}
      className={styles.addBtn}
      color="primary"
    >
      Add Section
    </MaterialBtn>
  );

  const [saveDialogue, toggleSaveDialogue] = useState({
    flag: false,
    nextTab: 1
  });
  const handleTabChange = (event, newValue) => {
    const selectedSection = sortedSections[newValue];
    if (selectedSection) {
      if (isDealSectionChanged) {
        toggleSaveDialogue({ flag: true, nextTab: newValue });
        return;
      }
      handleSectionClick(selectedSection);
      setTab(newValue);
      setCurrentGroup(ALL_FIELDS.id);
    } else {
      toggleLabelDialog(true);
    }
  };

  const handleGroupAdd = () => {
    toggleGroupModal(false);
    setGroupLabel('');
    postNewGroup({ title: groupLabel }).then(() => {
      // console.log(res);
      dispatch({
        type: 'show',
        payload: 'Group added successfully',
        msgType: 'success'
      });
      getAllGroup();
      getSingleSection(deal.id, currentSection[0].id);
    });
  };

  const handleSaveDialgoueClose = (val = false) => {
    if (val) {
      const btn = document.getElementById('formSubmitBtn');
      if (btn) {
        btn.click();
      }
    } else {
      handleSectionClick(sortedSections[saveDialogue.nextTab]);
      setTab(saveDialogue.nextTab);
    }
    toggleSaveDialogue({ flag: false, nextTab: 0 });
    dispatch({ type: 'RESET_DEAL_SECTION_CHANGE' });
  };

  const handleGroupScroll = (groupId) => {
    const firstEl = document.querySelector(`[data-fieldid='${groupId}']`);
    if (firstEl) {
      firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    // console.log({ selctedGroups, currentSectionGroups, groupListSelected });
    if (
      selctedGroups
      && selctedGroups.length
      && currentSectionGroups
      && currentSectionGroups.length
    ) {
      const tempList = selctedGroups.map((groupId) => currentSectionGroups.find((group) => group.id === groupId));
      // const labelList = tempList.map((group) => (group && group.title) || '').filter(Boolean);
      const labelList = tempList.filter(Boolean);
      // console.log(tempList, labelList);
      setGroupList([ALL_FIELDS, ...labelList]);
    } else {
      setGroupList([ALL_FIELDS]);
    }
    // console.log({ groupListSelected, currentSection, currentSectionGroups, selctedGroups });
  }, [selctedGroups, currentSectionGroups, currentSection]);

  const handleGroupClick = (name) => {
    setBreadcrumbsData(name.title, position + 1, true);
    if (name.id === ALL_FIELDS.id) {
      setCurrentGroupFields(null);
      setCurrentGroup(ALL_FIELDS.id);
      return;
    }

    const selected = currentSectionGroups.find((group) => group.id === name.id);
    if (selected) {
      const groupedFields = groupBy(currentSection[0].fields, 'fieldGroupId');
      setCurrentGroupFields({
        ...currentSection[0],
        fields: sortBy(groupedFields[selected.id], 'order')
      });
      // console.log({
      //   groupedFields,
      //   currentGroupFields,
      //   selected,
      //   currentSection
      // });
      setCurrentGroup(selected.id);
      handleGroupScroll(selected.id);
    }
  };

  useEffect(() => {
    if (currentGroup === ALL_FIELDS.id) {
      setCurrentGroupFields(null);
    } else if (currentGroup) {
      const selected = currentSectionGroups.find(
        (group) => group.id === currentGroup
      );
      // console.log(selected, currentGroup, currentSectionGroups);
      if (selected) {
        const groupedFields = groupBy(currentSection[0].fields, 'fieldGroupId');
        setCurrentGroupFields({
          ...currentSection[0],
          fields: sortBy(groupedFields[selected.id], 'order')
        });
      }
    }
    // console.log('section updated', { currentSection, currentGroupFields, currentGroup });
  }, [currentSection]);

  return (
    <Grid container={true}>
      {/* {AddGroupBtn} */}
      <Grid item={true} xs={12} className={styles.stickyHeader} style={{ marginBottom: '10px' }}>
        <Paper square={true} className={classes.shadowHide}>
          <AppBar position="static" elevation={2} className={classes.background}>
            <Tabs
              value={currentTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="Deal Sections"
              // style={{ paddingRight: '130px' }}
            >
              {sortedSections.length
                && sortedSections.map((list) => (
                  <Tab label={list.name || upperFirst(list.key)} key={list.key} />
                ))}
              <Tab label={AddSectionBtn} />
            </Tabs>
          </AppBar>
        </Paper>
      </Grid>
      <Dialog open={labelDialogOpen} onClose={() => toggleLabelDialog(false)}>
        <DialogTitle>Enter Section Label</DialogTitle>
        <DialogContent>
          <Grid className={styles.formLabelStyle} item={true} xs={12}>
            <Input
              isFieldValue={false}
              onValueChange={setLabelValue}
              propValue={labelValue}
            />
          </Grid>
          <Grid container={true} xs={12} justify="space-around">
            <Grid className={styles.cancelButtonStyle} item={true}>
              <Button
                type="button"
                label="Cancel"
                onClick={() => toggleLabelDialog(false)}
              />
            </Grid>
            <Grid className={styles.updateButtonStyle} item={true}>
              <Button
                type="button"
                label="Add"
                onClick={handleAddField}
                disabled={!labelValue.trim().length}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={saveDialogue.flag}
        onClose={() => handleSaveDialgoueClose(false)}
        classes={{ paper: styles.dialoguePadd }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you want to Save the Changes ?
        </DialogTitle>
        <DialogActions>
          <MaterialBtn
            onClick={() => handleSaveDialgoueClose(false)}
            color="default"
          >
            Cancel
          </MaterialBtn>
          <MaterialBtn
            onClick={() => handleSaveDialgoueClose(true)}
            variant="contained"
            color="primary"
            autoFocus={true}
          >
            Save
          </MaterialBtn>
        </DialogActions>
      </Dialog>
      <Grid item={true} xs={12}>
        <div
          className={
            deal && deal.sections && deal.sections.length
              ? styles.tabContainer
              : ''
          }
        >
          {currentSection && (
            <Grid container={true}>
              <Grid item={true} xs={2} className={styles.sideBarContainer}>
                <Grid
                  container={true}
                  direction="column"
                  className={styles.stickyGroup}
                >
                  <NavBarComponent
                    sectionList={groupListSelected}
                    handleNavClick={handleGroupClick}
                    selectedSection={currentGroup}
                    isObj={true}
                  />
                  <MaterialBtn
                    style={{ padding: '18px' }}
                    variant="text"
                    color="primary"
                    onClick={() => toggleGroupModal(true)}
                  >
                    Add Global Group
                  </MaterialBtn>
                </Grid>
              </Grid>
              <Grid item={true} xs={10} className={styles.formContainer}>
                <DealForm
                  sectionGroups={currentSectionGroups}
                  dealDataSections={
                    (currentGroupFields && [currentGroupFields])
                    || currentSection
                  }
                  fieldData={currentSectionConfig || []}
                  sectionIndex={0}
                  currentSection={
                    currentGroupFields || (currentSection && currentSection[0])
                  }
                  sectionVisibility={sectionVisibility}
                  handleBackClick={handleBackClick}
                  handleSectionCancel={handleSectionCancel}
                  hideSection={(visibilityValue) => changeVisibility(visibilityValue)}
                />
              </Grid>
              <Dialog
                open={openGroupModal}
                onClose={() => toggleGroupModal(false)}
                classes={{ paper: styles.grousAddDialoguePadding }}
              >
                <DialogTitle>Add a Global Group</DialogTitle>
                <small style={{ padding: '0 24px' }}>
                  Note: Adding a global group will reflect in all deals. You can
                  hide the group for that deal though.
                </small>
                <DialogContent>
                  <Grid className={styles.formLabelStyle} item={true} xs={12}>
                    <Input
                      isFieldValue={false}
                      onValueChange={setGroupLabel}
                      propValue={groupLabel}
                    />
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <MaterialBtn
                    onClick={() => toggleGroupModal(false)}
                    color="default"
                  >
                    Cancel
                  </MaterialBtn>
                  <MaterialBtn
                    onClick={handleGroupAdd}
                    variant="contained"
                    color="primary"
                    disabled={!groupLabel.trim().length}
                  >
                    Add
                  </MaterialBtn>
                </DialogActions>
              </Dialog>
            </Grid>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default PlatFormTabSection;
