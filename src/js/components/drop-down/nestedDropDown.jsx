/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import DropdownMenu from './components/dropdownMenu';
import SideMenu from './components/sideMenu';

const btnStyles = {
  color: '#212529',
  fontSize: '14px'
};

function MenuItem(props) {
  const { text, onClick } = props;

  return (
    <Grid item={true} xs={true}>
      <Button color="inherit" size="large" style={btnStyles} fullWidth={true} onClick={() => onClick(text)}>
        {text}
      </Button>
    </Grid>
  );
}

function NestedDrodown({ children, list = [], onClick }) {
  const handleClick = () => {};
  return (
    <>
      <Grid
        container={true}
        direction="row"
        justify="space-around"
        alignItems="flex-start"
      >
        <DropdownMenu text="Dropdown" color="primary" label={children}>
          {list.map((menuItem) => (
            <SideMenu text={menuItem.label} isNested={menuItem?.subList?.length > 0} onClick={onClick}>
              {menuItem?.subList?.map((subList) => <MenuItem text={subList} onClick={handleClick} />)}
            </SideMenu>
          ))}
        </DropdownMenu>
      </Grid>
    </>
  );
}

NestedDrodown.propTypes = {
  onClick: PropTypes.func,
  list: PropTypes.arrayOf.isRequired,
  children: PropTypes.any.isRequired
};

NestedDrodown.defaultProps = {
  onClick: PropTypes.func
};

export default NestedDrodown;
