import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { ListItemIcon, ListItemText } from '@material-ui/core';
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
    height: 'fit-content'
  }
}));

// const handleNavClick = () => {
// };

const getIcon = (name) => {
  switch (name) {
    case 'Thumbnail':
      return '/assets/thumbnail.svg';
    case 'Overview':
      return '/assets/overview.svg';
    case 'Product':
      return '/assets/product.svg';
    case 'Brand':
      return '/assets/brand.svg';
    case 'Project':
      return '/assets/project.svg';
    case 'Assessment':
      return '/assets/assessment.svg';
    case 'Rewards':
      return '/assets/rewards.svg';
    case 'Report':
      return '/assets/reports.svg';
    case 'Control':
      return '/assets/control.svg';
    case 'Performance':
      return '/assets/speed.svg';
    default:
      return '/assets/control.svg';
  }
};

const DealNavbar = (props) => {
  const classes = useStyles();
  const { handleNavClick, selectedSectionKey, sectionList } = props;
  return (
    <List className={classes.list}>
      {sectionList && sectionList.map((name, key) => (
        <ListItem
          button={true}
          onClick={() => handleNavClick(key, name)}
          className={selectedSectionKey === key ? styles.selectedTab : styles.tab}
        >
          <ListItemIcon>
            <img src={getIcon(name)} width="20px" height="20px" alt="alt" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography
                type="body1"
                style={selectedSectionKey === key
                  ? { color: '#ffffff', fontSize: '16px', lineHeight: '19px' }
                  : { color: '#164363', fontSize: '16px', lineHeight: '19px' }}
              >
                {name}
              </Typography>
            )}
          />
        </ListItem>))}
    </List>
  );
};

DealNavbar.propTypes = {
  handleNavClick: PropTypes.func
};

DealNavbar.defaultProps = {
  handleNavClick: () => { }
};

export default DealNavbar;
