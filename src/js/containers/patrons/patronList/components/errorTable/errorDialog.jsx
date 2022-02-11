import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  label: {
    backgroundColor: '#fff0 !important'
  }
});

const TreeViews = ({ data = [] }) => {
  const classes = useStyles();

  const getList = (listData) => listData.map((list) => {
    if (list?.data?.length > 0) {
      return (
        <TreeItem
          classes={{ label: classes.label }}
          nodeId={list?.key || ''}
          label={list?.label || ''}
        >
          {getList(list.data)}
        </TreeItem>
      );
    }
    return (
      <TreeItem
        classes={{ label: classes.label }}
        nodeId={list?.key || ''}
        label={list?.label || ''}
      />
    );
  });

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ArrowDropDownIcon style={{ fontSize: '30px' }} />}
      defaultExpandIcon={<ArrowRightIcon style={{ fontSize: '30px' }} />}
    >
      {getList(data)}
    </TreeView>
  );
};

TreeViews.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any)
};

TreeViews.defaultProps = {
  data: []
};

export default TreeViews;
