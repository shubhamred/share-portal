/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { ListItemText } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import styles from './styles.scss';

const useStyles = makeStyles(() => ({
  root: {
    // fontFamily: 'Rubik !important',
    display: 'flex'
  },
  list: {
    backgroundColor: '#ffffff',
    paddingTop: 0,
    paddingBottom: 0,
    height: 'max-content',
    maxWidth: '100%'
  },
  selectedSection: {
    fontFamily: 'Rubik',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '19px'
  },
  unSelectedSection: {
    fontFamily: 'Rubik',
    color: '#000000de',
    opacity: '0.9',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '19px'
  },
  subTab: {
    display: 'flex',
    justifyContent: 'space-between',
    justifyItems: 'center'
  }
}));

// const handleNavClick = () => {
// };

const SubNavBar = (props) => {
  const classes = useStyles();
  const { handleNavClick, selectedSection, name, list } = props;
  const isSelected = list.findIndex((row) => row === selectedSection);
  const [open, setOpen] = useState(isSelected >= 0);
  return (
    <>
      <ListItem key={name} button={true} onClick={() => setOpen(!open)} className={styles.tab}>
        <ListItemText
          primary={
            <Typography type="body1" className={`${classes.unSelectedSection} ${classes.subTab}`}>
              {name}
              <ChevronLeftIcon
                className={open ? styles.chevronDownIcon : styles.chevronRightIcon}
              />
            </Typography>
          }
        />
      </ListItem>
      {open && (
        <NavBar
          handleNavClick={handleNavClick}
          selectedSection={selectedSection}
          sectionList={list}
          isSub={true}
        />
      )}
    </>
  );
};

const NavBar = (props) => {
  const classes = useStyles();
  const { handleNavClick, selectedSection, sectionList, isObj, isSub, handleClose } = props;
  const selectedTabClass = isSub ? `${styles.selectedTab} ${styles.innerTab}` : styles.selectedTab;
  const tabClass = isSub ? `${styles.tab} ${styles.innerTab}` : styles.tab;
  return (
    <List className={classes.list} id="list">
      {sectionList
        && sectionList.map((row) => (row?.isSub ? (
          <SubNavBar
            handleNavClick={handleNavClick}
            selectedSection={selectedSection}
            name={row.name}
            list={row.list}
          />
        ) : (
          <ListItem
            key={isObj ? row.id : row}
            button={true}
            onClick={() => {
              handleNavClick(row);
              handleClose();
            }}
            className={selectedSection === (isObj ? row.id : row) ? selectedTabClass : tabClass}
          >
            <ListItemText
              primary={
                <Typography
                  type="body1"
                  className={
                      selectedSection === (isObj ? row.id : row)
                        ? classes.selectedSection
                        : classes.unSelectedSection
                    }
                >
                  {isObj ? row.title : row}
                </Typography>
                }
            />
          </ListItem>
        )))}
    </List>
  );
};

NavBar.propTypes = {
  handleNavClick: PropTypes.func,
  handleClose: PropTypes.func,
  selectedSection: PropTypes.any,
  sectionList: PropTypes.arrayOf(PropTypes.string),
  isSub: PropTypes.bool,
  isObj: PropTypes.bool
};

NavBar.defaultProps = {
  handleNavClick: () => {},
  handleClose: () => {},
  selectedSection: '',
  sectionList: [],
  isSub: false,
  isObj: false
};

export default NavBar;
