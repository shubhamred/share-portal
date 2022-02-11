/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';

const btnStyles = {
  color: '#212529'
};

function DropdownMenu(props) {
  const { label } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const childrenWithNewProps = React.Children.map(props.children, (child) => React.cloneElement(child, { onClose: handleClose }));

  return (
    <>
      <Grid item={true} xs={true}>
        <span onClick={handleClick} style={btnStyles}>
          {label}
        </span>

        <Popover
          id="dropdown-id"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Grid
            container={true}
            direction="column"
            justify="flex-start"
            alignItems="stretch"
          >
            <div style={{ padding: '15px 5px' }}>
              {childrenWithNewProps}
            </div>
          </Grid>
        </Popover>
      </Grid>
    </>
  );
}

export default DropdownMenu;
