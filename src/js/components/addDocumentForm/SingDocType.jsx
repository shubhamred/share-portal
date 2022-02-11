import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import styles from './style.scss';

const SingleDocType = (props) => {
  const {
    name,
    isVisible,
    isMultiple,
    isMandatory,
    deleteRequired,
    handleDelete,
    isEditable,
    onFieldUpdate,
    docType,
    docTypesArr,
    id,
    isAdditionalDoc
  } = props;

  const handleOptionChange = (fieldType, value) => {
    onFieldUpdate(id, fieldType, value);
  };

  return (
    <>
      <Grid
        container={true}
        justify="space-between"
        alignItems="center"
        className={styles.mainContainer}
      >
        <Grid item={true} className={styles.fileNameContainer} xs={3}>
          {isEditable ? (
            <FormControl style={{ width: '100%' }}>
              <Select
                value={docType}
                onChange={({ target }) => handleOptionChange('docType', target.value)}
              >
                <MenuItem value="" disabled={true}>Select Doc Type</MenuItem>
                {
                  docTypesArr.map((type) => (
                    <MenuItem value={type.id}>{type.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          ) : (
            <p className={styles.fileName}>
              {name}
              {' '}
              {isMandatory ? '*' : null}
            </p>
          )}
        </Grid>
        <Grid
          item={true}
          container={true}
          alignItems="center"
          xs={9}
          justify="flex-end"
        >
          <Grid item={true} style={{ display: 'none' }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isVisible}
                  onChange={({ target }) => handleOptionChange('visibility', target.checked)}
                  name={name}
                  color="primary"
                />
              }
              label={isVisible ? 'Visible' : 'Hidden'}
            />
          </Grid>
          <Grid item={true} style={{ display: 'none' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMultiple}
                  onChange={({ target }) => handleOptionChange('multiple', target.checked)}
                  name={name}
                  color="primary"
                />
              }
              label="Multiple Files"
            />
          </Grid>
          <Grid item={true}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={isAdditionalDoc}
                  checked={isMandatory}
                  onChange={({ target }) => handleOptionChange('mandatory', target.checked)}
                  name={name}
                  color="primary"
                />
              }
              label="Mark Mandatory"
            />
          </Grid>
          {deleteRequired && (
            <Grid item={true}>
              <IconButton
                color="primary"
                aria-label="Delete file"
                component="span"
                onClick={() => handleDelete(id)}
                style={{ color: 'rgba(176, 0, 32, 0.87)' }}
              >
                <HighlightOffIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

SingleDocType.propTypes = {
  name: PropTypes.string,
  isMandatory: PropTypes.bool,
  isVisible: PropTypes.bool,
  isEditable: PropTypes.bool,
  isMultiple: PropTypes.bool,
  deleteRequired: PropTypes.bool,
  handleDelete: PropTypes.func,
  onFieldUpdate: PropTypes.func,
  docType: PropTypes.string,
  docTypesArr: PropTypes.array
};

SingleDocType.defaultProps = {
  name: '',
  isMandatory: true,
  isVisible: true,
  isEditable: false,
  isMultiple: true,
  deleteRequired: false,
  handleDelete: () => {},
  onFieldUpdate: () => {},
  docType: '',
  docTypesArr: []
};

export default React.memo(SingleDocType);
