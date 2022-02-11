import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const gridStyles = {
  padding: '0px 25px'
};

const btnStyles = {
  justifyContent: 'flex-start',
  paddingLeft: '20px',
  color: '#212529',
  fontSize: '14px',
  position: 'relative'
};

const iconStyles = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '20px',
  marginLeft: '8px',
  width: '0.9em'
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1, 0),
    width: '180px'
  }
}));

function SideMenu(props) {
  const { text, children, isNested, onClose, onClick } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event, subItem) {
    onClick({ parent: text, child: subItem });
    if (!isNested) {
      onClose();
      return;
    }
    if (event) {
      setAnchorEl(event.currentTarget);
    } else {
      handleClose();
    }
  }

  function handleNestedClick(value) {
    handleClick(null, value);
  }

  function handleClose() {
    setAnchorEl(null);
    onClose();
  }

  const childrenWithNewProps = React.Children.map(children, (child) => React.cloneElement(child, { onClick: handleNestedClick }));

  return (
    <>
      <Grid item={true} xs={true} style={{ width: '180px' }}>
        <Button color="inherit" size="large" style={btnStyles} fullWidth={true} onClick={handleClick}>
          {text}
          {' '}
          {isNested && (<ChevronRightIcon style={iconStyles} />)}
        </Button>
        <Popover
          id="dropdown-id"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          // style={{ background: 'red' }}
          classes={{ paper: classes.paper }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Grid
            container={true}
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            style={gridStyles}
          >
            {childrenWithNewProps}
          </Grid>
        </Popover>
      </Grid>
    </>
  );
}

export default SideMenu;
