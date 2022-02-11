/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  width: {
    width: '100%'
  }
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandsGroupStyle="lakh"
      thousandSeparator={true}
      isNumericString={true}
      prefix="₹"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

// eslint-disable-next-line react/no-multi-comp
const MaskedInputs = (props) => {
  const { value, handleChange, label, name } = props;
  const classes = useStyles();
  return (
    <Grid className={classes.root} container={true}>
      <Grid item={true} xs={12}>
        <TextField
          value={value}
          label={label}
          name={name || label}
          onChange={handleChange}
          classes={{ root: classes.width }}
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
      </Grid>
    </Grid>
  );
};
MaskedInputs.propTypes = {
  value: PropTypes.number,
  handleChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string
};

MaskedInputs.defaultProps = {
  value: 0,
  handleChange: () => {},
  label: '',
  name: ''
};
export default MaskedInputs;
