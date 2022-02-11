import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import HideButton from '../hideButton/hideButton';
import styles from './styles.scss';

const CustomRadio = withStyles({
  root: {
    // color: '#1518AF',
    '&$checked': {
      color: '#164363'
    }
  },
  disabled: {
    '&$checked': {
      color: '#bdbdbd'
    }
  },
  checked: {}
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio color="default" {...props} />);

const RadioButtonsGroup = (props) => {
  // const classes = useStyles();
  const { handleChange, options, selected, label, input, hideButton, visible, onHideBtnClick, disabled } = props;
  let currentSelected = selected && input && input.value === '' && selected;
  if (input && input.value !== '') {
    currentSelected = input.value;
  }
  input.onChange(currentSelected);
  return (
    <div>
      <FormControl component="fieldset" disabled={disabled}>
        <FormLabel className={styles.label}>
          {label}
          {hideButton && <HideButton visible={visible} onHideBtnClick={onHideBtnClick} />}
        </FormLabel>
        <RadioGroup
          className={styles.radioGroup}
          value={currentSelected}
          onChange={(event) => {
            input.onChange(event.target.value);
            handleChange(event.target.value);
          }}
        >
          {options.map((option) => <FormControlLabel
            key={`option-${option}`}
            className={styles.input}
            value={option}
            control={<CustomRadio />}
            label={option}
          />)}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

RadioButtonsGroup.propTypes = {
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  selected: PropTypes.string,
  label: PropTypes.string,
  hideButton: PropTypes.bool,
  handleChange: PropTypes.func,
  onHideBtnClick: PropTypes.func,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string
  }),
  options: PropTypes.arrayOf(PropTypes.any)

};

RadioButtonsGroup.defaultProps = {
  disabled: false,
  visible: false,
  selected: '',
  label: '',
  hideButton: false,
  handleChange: () => { },
  onHideBtnClick: () => { },
  input: {
    onChange: () => { },
    value: ''
  },
  options: []
};

export default RadioButtonsGroup;
