import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const RangeSilder = (props) => {
  const { input, value, label, min, max, onValChange } = props;

  const handleChange = (eve, newval) => {
    if (input) {
      input.onChange(newval);
    }
    if (onValChange) onValChange(newval);
  };
  return (
    <>
      <Typography gutterBottom={true}>{label}</Typography>
      <Slider
        value={(input && input.value) || value}
        onChange={handleChange}
        min={min}
        max={max}
        valueLabelDisplay="auto"
      />
    </>
  );
};

export default RangeSilder;
