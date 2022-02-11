import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    flexShrink: 0
  },
  drawerPaper: {
    overflowX: 'hidden',
    width: '370px',
    top: '64px'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between'
  },
  draweLogo: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px'
  },
  drawerIcon: {
    margin: '0px !important',
    height: '32px',
    width: '32px',
    backgroundColor: '#f8f8fd !important',
    border: '1px solid #e0e7ff !important',
    boxShadow: '0px 1px 3px #0000001a',
    position: 'fixed',
    right: '358px',
    transform: 'rotate(180deg)'
  },
  title: {
    padding: '8px',
    fontSize: '20px'
  },
  drawerImgContainer: {
    '& img': {
      width: '25px',
      height: '25px'
    }
  },
  menuBtn: {
    color: '#2c2fb7'
  },
  listContainer: {
    padding: '0',
    marginBottom: '60px'
  }
}));

const FIlterDrawer = (props) => {
  const classes = useStyles();
  const { open, handleClose, title, children, anchor, contentStyle } = props;
  return (
    <Drawer
      className={classes.drawer}
      // variant="persistent"
      anchor={anchor}
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
      onClose={handleClose}>
      <div className={classes.drawerHeader}>
        <div className={classes.draweLogo}>
          <Typography className={classes.title} variant="h5" noWrap={true}>
            {title}
          </Typography>
          {/* <IconButton
            className={classes.drawerIcon}
            color="inherit"
            aria-label="open drawer"
            onClick={handleClose}
            edge="start">
            <ChevronLeftIcon style={{ color: '#1518AF' }} />
          </IconButton> */}
        </div>
      </div>
      <Divider />
      <List
        className={classes.listContainer}
        // onKeyDown={handleClose}
        // onClick={handleClose}
        style={contentStyle ? { ...contentStyle } : { overflowX: 'hidden', width: '270px' }}>
        {children}
      </List>
    </Drawer>
  );
};

FIlterDrawer.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.shape({}).isRequired,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  anchor: PropTypes.string
};

FIlterDrawer.defaultProps = {
  open: false,
  handleClose: () => {},
  title: '',
  anchor: 'left'
};

export default FIlterDrawer;
