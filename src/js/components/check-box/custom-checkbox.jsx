import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const ThemedCheckbox = withStyles({
  root: {
    color: '#B4B8C1',
    '&$checked': {
      color: '#212529'
    }
  },
  checked: {}
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox color="default" {...props} />);

const InterminateCheckbox = withStyles({
  root: {
    color: '#999',
    // position: 'absolute !important',
    '&$checked': {
      color: '#212529'
    }
  },
  checked: {}
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox color="default" {...props} />);

export default function CustomCheckBox({ defaultChecked = false, onChange, label = '', indeterminate = false }) {
  const [checked, setChecked] = React.useState(defaultChecked);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  if (indeterminate) {
    return (
      <div>
        <FormControlLabel
          control={<InterminateCheckbox checked={checked} onChange={handleChange} indeterminate={indeterminate} />}
          label={label}
        />
      </div>
    );
  }

  return (
    <div>
      <FormControlLabel
        control={<ThemedCheckbox checked={checked} onChange={handleChange} indeterminate={indeterminate} />}
        label={label}
      />
    </div>
  );
}
