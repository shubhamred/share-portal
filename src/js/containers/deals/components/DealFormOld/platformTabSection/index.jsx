import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { destroy } from 'redux-form';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DealForm from '../dealForm';
import { getSingleSection, addSingleSection, getAllSections } from '../../../saga';

import styles from './styles.scss';

const PlatFormTabSection = (props) => {
  const dispatch = useDispatch();
  const currentSection = useSelector((state) => state.dealReducer.currentSectionData);
  const formSelect = useSelector((state) => state.form);

  const { sectionList, dealDataSections, changeSectionVisibility, validateMaxVisible, deal, sectionConfig } = props;
  const dataList = sectionList.map((section) => {
    const temp = dealDataSections.find((dealSection) => dealSection.key === section.key);
    if (temp) {
      return {
        ...temp,
        label: section.label
      };
    }
    return {
      label: section.label,
      key: section.key,
      version: 1
    };
  });
  const [currentSectionConfig, setCurrentSectionConfig] = useState(null);
  const [currentSectionData, setCurrentSectionData] = useState(null);
  const sectionVisibility = currentSection && currentSection.length ? currentSection[0].visibility : false;
  const changeVisibility = (visibilityValue) => {
    const sectionName = currentSection[0].key;
    changeSectionVisibility(visibilityValue, sectionName);
  };
  const handleSectionClick = (item, index) => {
    const temp = sectionConfig.find((config) => config.key === item.key);
    if (temp) setCurrentSectionConfig(temp);
    if (item.id) {
      getSingleSection(deal.id, item.id).then((res) => {
        // const indexOfSection = deal.sections.findIndex((section) => section.key.toLowerCase() === item.key.toLowerCase());
        if (res.data) {
          setCurrentSectionData([res.data]);
        } else {
          handleBackClick();
        }
      });
    } else {
      const data = { dealId: deal.id, key: item.key, visibility: false, fields: [], order: index };

      addSingleSection(data).then((res) => {
        if (res.data) {
          setCurrentSectionData([res.data]);
        } else {
          handleBackClick();
        }
      });
      // dispatch({ type: DEAL_SINGLE_SECTION_UPDATE_SUCCESS, data });
    }
  };

  const handleSectionCancel = (section) => {
    handleSectionClick(section);
  };
  const handleBackClick = () => {
    getAllSections(deal.id);
    setCurrentSectionData(null);
    setCurrentSectionConfig(null);
    dispatch({ type: 'DEAL_SECTION:SET_NULL' });
    Object.keys(formSelect).map((formName) => destroy(formName));
  };

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <div className={styles.tabContainer}>
          {
            !currentSectionConfig && (
              <List>
                {
                  dataList && dataList.map((list, index) => (
                    <ListItem key={list.key} divider={true} className={styles.listItemPadding}>
                      <Grid container={true} xs={9}>
                        <Grid item={true} xs={3}>
                          <p className={styles.sectionName}>{list.label}</p>
                        </Grid>
                        {
                          typeof list.visibility !== 'undefined' && (
                            <Grid item={true} xs={3}>
                              <p className={list.visibility ? styles.sectionVisiblity : styles.sectionHidden}>
                                {list.visibility ? 'Visible' : 'Hidden' }
                              </p>
                            </Grid>
                          )
                        }
                        {
                          list.updatedAt && (
                            <Grid item={true}>
                              <p className={styles.sectionUpdateTime}>
                                Last updated on
                                {' '}
                                {new Date(list.updatedAt).toLocaleString()}
                              </p>
                            </Grid>
                          )
                        }
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="Visit" onClick={() => handleSectionClick(list, index + 1)}>
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                }
              </List>

            )
          }

          {
            currentSectionData && (
              <Grid container={true}>
                <Grid item={true} xs={12} style={{ padding: '1%' }}>
                  <DealForm
                    dealDataSections={currentSection}
                    fieldData={currentSectionConfig.fields || {}}
                    sectionIndex={(currentSectionConfig && currentSectionConfig.order - 1) || 0}
                    currentSection={currentSection && currentSection[0]}
                    sectionVisibility={sectionVisibility}
                    handleBackClick={handleBackClick}
                    handleSectionCancel={handleSectionCancel}
                    hideSection={(visibilityValue) => changeVisibility(visibilityValue)}
                    validateMaxVisible={(fieldCount, sectionVisibleMax) => validateMaxVisible(fieldCount, sectionVisibleMax)}
                  />
                </Grid>
              </Grid>
            )
          }
        </div>
      </Grid>
    </Grid>
  );
};

export default PlatFormTabSection;
