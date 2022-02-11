import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  NumberField
} from 'app/components';
import styles from '../../styles.scss';

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

const UpdateTypeConfig = (props) => {
  const {
    onSubmit,
    handleSubmit,
    handleCancel
  } = props;
  const [isMandatory, setIsMandatory] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isDocSigning, setIsDocSigning] = useState(false);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      isTemplate,
      isDocSigning,
      isMandatory
    });
  };

  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          <Grid item={true} xs={6} className={styles.formLabelStyle1}>
            <Grid className={styles.lableStyle}>
              Maximum Files
              {' '}
              <span className={styles.error}>*</span>
            </Grid>
            <Field
              name="maximumFiles"
              component={NumberField}
              label=""
              type="text"
            />
          </Grid>
          <Grid item={true} xs={6} className={styles.formLabelStyle1}>
            <Grid className={styles.lableStyle}>
              Maximum File Size (MB)
              {' '}
              <span className={styles.error}>*</span>
            </Grid>
            <Field
              name="maximumFileSize"
              component={NumberField}
              label=""
              type="text"
              isRequiredField={true}
            />
          </Grid>

          <Grid item={true} xs={6} className={styles.formLabelStyle1}>
            <Grid container={true}>
              <Grid item={true} xs={10}>
                <div className={styles.lableStyle1}>
                  Is Mandatory
                </div>
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

          <Grid item={true} xs={12} className={`${styles.formLabelStyle1} ${styles.switchDescriptor}`}>
            <Grid container={true}>
              <Grid item={true} xs={10}>
                <div className={styles.lableStyle1}>Doc signing is Required</div>
              </Grid>
              <Grid item={true} xs={2} className={styles.switchContainer}>
                <FormControlLabel
                  control={
                    <GreenSwitch
                      size="small"
                      checked={isDocSigning}
                      onChange={() => setIsDocSigning(!isDocSigning)}
                      color="primary"
                    />
                    }
                />
              </Grid>
            </Grid>
            <Grid container={true}>
              <Grid item={true} className={styles.text}>
                Does this files/documents have/required a signed copy?
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item={true} xs={6} className={styles.formLabelStyle1}>
            <Grid container={true}>
              <Grid item={true} xs={10}>
                <div className={styles.lableStyle1}>
                  Template upload required
                </div>
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
          </Grid> */}

          <Grid item={true} xs={1} />
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
                  type="submit"
                  label="Save"
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
      </form>
    </Grid>
  );
};

UpdateTypeConfig.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

UpdateTypeConfig.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {}
};

export default UpdateTypeConfig;
