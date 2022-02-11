/* eslint-disable react/forbid-prop-types,react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import styles from './styles.scss';

const AutocompleteComponent = (props) => {
  const {
    label,
    meta,
    disabled,
    options,
    handleSelectedOption,
    selector,
    handleInputChange,
    selectedOption,
    isArray,
    input,
    required,
    inputValue,
    clearOnBlur,
    error,
    debouncedInputChange,
    freeSolo,
    variant
  } = props;
  const { error: validationError, submitFailed } = meta || {};
  const { onChange, value } = input;
  const [textInputValue, setInputValue] = React.useState(inputValue || '');
  const selected = selectedOption || value;
  const handleChange = (event, val) => {
    onChange(val);
    handleSelectedOption(event, val);
  };

  const debouncedHandleAutocomplete = useCallback(
    debounce((nextValue) => debouncedInputChange(nextValue), 500),
    []
  );

  const isError = meta && validationError && submitFailed;
  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Autocomplete
          clearOnBlur={clearOnBlur}
          classes={{ root: styles.inputBorder, inputRoot: styles.inputHeight }}
          className={`${styles.wrapper} autoCompleteComponent`}
          disabled={disabled}
          options={options}
          inputValue={textInputValue}
          value={selected || null}
          onInputChange={(event, newInputValue) => {
            handleInputChange(newInputValue);
            setInputValue(newInputValue);
            debouncedHandleAutocomplete(newInputValue);
            if (freeSolo) {
              handleChange(event, { [selector]: newInputValue, title: newInputValue });
            }
          }}
          getOptionSelected={(option, optionValue) => (isArray
            ? option === optionValue
            : option.id === optionValue.id || option.name === optionValue.name)}
          getOptionLabel={(option) => (isArray ? option : option[selector])}
          freeSolo={freeSolo}
          onChange={(event, values) => {
            if (freeSolo && typeof values === 'string') {
              handleChange(event, { [selector]: values, title: values });
              return;
            }
            handleChange(event, values);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => (
            <TextField
              error={error}
              {...params}
              label={required ? `${label} *` : label}
              InputLabelProps={{
                shrink: true
                // classes: { root: styles.label }
              }}
              className={`${variant === 'standard' ? styles.standard : ''}`}
              variant={variant || 'outlined'}
            />
          )}
        />
        {isError && (
          <Grid className={styles.warning} item={true} xs={12}>
            {validationError}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

AutocompleteComponent.propTypes = {
  disabled: PropTypes.bool,
  handleSelectedOption: PropTypes.func,
  handleInputChange: PropTypes.func,
  debouncedInputChange: PropTypes.func,
  options: PropTypes.array,
  label: PropTypes.string,
  selector: PropTypes.string,
  selectedOption: PropTypes.any,
  meta: PropTypes.any,
  input: PropTypes.any,
  isArray: PropTypes.bool,
  required: PropTypes.bool,
  inputValue: PropTypes.string,
  clearOnBlur: PropTypes.bool,
  error: PropTypes.bool,
  freeSolo: PropTypes.bool,
  variant: PropTypes.string
};

AutocompleteComponent.defaultProps = {
  disabled: false,
  handleSelectedOption: () => {},
  handleInputChange: () => {},
  debouncedInputChange: () => {},
  options: [],
  label: null,
  selector: null,
  selectedOption: null,
  meta: null,
  isArray: true,
  required: false,
  input: {
    value: null,
    onChange: () => {}
  },
  inputValue: '',
  clearOnBlur: true,
  error: false,
  freeSolo: false,
  variant: 'outlined'
};

export default AutocompleteComponent;
