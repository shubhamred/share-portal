import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControlLabel, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Button, Input, NumberField } from 'app/components';
import styles from '../styles.scss';

const GreenSwitch = withStyles({
  switchBase: {
    color: '#00b300',
    '&$checked': {
      color: '#00b500'
    },
    '&$checked + $track': {
      backgroundColor: '#00b500'
    }
  },
  checked: {},
  track: {}
})(Switch);

const EditDocCategory = (props) => {
  const { onSubmit, handleCancel, uploadDoc } = props;
  const [nameError, setNameError] = useState(false);
  const [requiredTypesError, setRequiredDocTypesError] = useState(false);
  const [name, setName] = useState('');
  const [requiredDocTypes, setRequiredDocTypes] = useState(0);
  const [isMandatory, setIsMandatory] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);

  const handleFormSubmit = () => {
    if (!name) {
      setNameError(true);
    }
    onSubmit({
      name,
      noOfDocTypesRequired: requiredDocTypes,
      isMandatory,
      isTemplate
    });
  };

  useEffect(() => {
    if (uploadDoc?.documentCategory) {
      const config = uploadDoc.documentCategory;
      if (config?.isMandatory) setIsMandatory(true);
      if (config?.name) setName(config.name);
      if (config?.noOfDocTypesRequired) setRequiredDocTypes(config.noOfDocTypesRequired);

      if (uploadDoc.isTemplateRequired) {
        setIsTemplate(true);
      }
    }
  }, [uploadDoc]);

  return (
    <Grid>
      <Grid container={true}>
        <Grid item={true} xs={5} className={styles.formLabelStyle}>
          <Input
            name="name"
            propValue={name}
            label="Name"
            onValueChange={(value) => {
              setName(value);
              if (value) {
                setNameError(false);
              } else {
                setNameError(true);
              }
            }}
            type="text"
            isFieldValue={false}
            isRequiredField={true}
          />
          {nameError && <p className={styles.error}>Please enter name</p>}
        </Grid>
        <Grid item={true} xs={1} />
        <Grid item={true} xs={6} className={styles.formLabelStyle}>
          <NumberField
            name="noOfDocTypesRequired"
            label="No Of Doc Types Required"
            type="text"
            isFieldValue={false}
            onValueChange={(value) => {
              setRequiredDocTypes(value);
              if (value) {
                setRequiredDocTypesError(false);
              } else {
                setRequiredDocTypesError(true);
              }
            }}
            propValue={requiredDocTypes}
            isRequiredField={true}
          />
          {requiredTypesError && <p className={styles.error}>Please enter maximum files</p>}
        </Grid>

        <Grid item={true} xs={12} className={styles.formLabelStyle1}>
          <Grid container={true}>
            <Grid item={true} xs={10}>
              <div className={styles.lableStyle1}>Is Mandatory</div>
            </Grid>
            <Grid item={true} xs={2}>
              <FormControlLabel
                control={
                  <GreenSwitch
                    size="small"
                    checked={isMandatory}
                    onChange={({ target }) => {
                      setIsMandatory(target.checked);
                    }}
                    color="primary"
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item={true} xs={12} className={`${styles.formLabelStyle1} ${styles.switchDescriptor}`}>
          <Grid container={true}>
            <Grid item={true} xs={10}>
              <div className={styles.lableStyle1}>Template upload required</div>
            </Grid>
            <Grid item={true} xs={2} className={styles.switchContainer}>
              <FormControlLabel
                control={
                  <GreenSwitch
                    size="small"
                    checked={isTemplate}
                    onChange={() => setIsTemplate(!isTemplate)}
                    color="primary"
                  />
                }
              />
            </Grid>
          </Grid>
          <Grid container={true}>
            <Grid item={true} className={styles.text}>
              Templates are the files/docs that are required for a Doc category and need to be shown on Brands app for user reference.
              <br />
              <br />
              For example: BR2 template are required for PAS3 filing.
            </Grid>
          </Grid>
        </Grid>

        <Grid item={true} xs={12} className={styles.formLabelStyle}>
          <Grid container={true} justify="flex-end">
            <Grid item={true} xs={2}>
              <Button
                onClick={handleCancel}
                label="Cancel"
                style={{
                  backgroundColor: '#fff',
                  color: '#4754D6',
                  minWidth: 100,
                  border: 'none',
                  width: '85%',
                  margin: '0px',
                  display: 'block'
                }}
              />
            </Grid>
            <Grid item={true} xs={3}>
              <Button
                label="Update"
                onClick={handleFormSubmit}
                style={{
                  backgroundColor: '#4754D6',
                  minWidth: 100,
                  width: '85%',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

EditDocCategory.propTypes = {
  docTypeData: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

EditDocCategory.defaultProps = {
  docTypeData: {},
  onSubmit: () => { },
  handleCancel: () => { }
};

export default EditDocCategory;
