import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import { Grid, FormControlLabel } from '@material-ui/core';
import { Input, Button, DropDown, NumberField, Switch, MultiSelectDropDown } from 'app/components';
import { getApplicationsOfBrand } from 'app/containers/applications/saga';
import { getRevenueSources } from 'app/containers/brands/saga';
import styles from '../addAccount/styles.scss';

const AddApplication = (props) => {
  const { handleSubmit, onClose, brandId, change, onSubmit } = props;
  const [applicationList, setApplicationList] = useState([]);
  const [selectedApplication, setApplicationCode] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [revenueSources, setRevenueSources] = useState([]);

  const handleFormSubmit = (values) => {
    const payload = {
      applicationCode: selectedApplication,
      isActive: isActive ? 1 : 0,
      revenueSource: selectedSources,
      split: values.split,
      narration: values.narration
    };
    onSubmit(payload);
  };

  const getApplicationList = (companyId) => {
    getApplicationsOfBrand(companyId).then((res) => {
      if (res.data) {
        const options = res.data.map((application, index) => ({
          key: application.applicationCode,
          value: `Application ${index + 1} - ${application.applicationCode}`,
          id: application.id
        }));
        setApplicationCode('');
        change('applicationCode', '');
        setApplicationList(options);
      } else {
        setApplicationCode('');
        change('applicationCode', '');
        setApplicationList([]);
      }
    });
  };

  const getResources = () => {
    getRevenueSources().then((res) => {
      if (res.data) {
        const filteredOptions = res.data.map((resource) => resource.CODE);
        setRevenueSources(filteredOptions);
      }
    });
  };

  useEffect(() => {
    if (brandId) {
      getApplicationList(brandId);
    }
  }, [brandId]);

  useEffect(() => {
    getResources();
  }, []);

  return (
    <Grid container={true} className={styles.addPartnerForm}>
      <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          <Grid className={styles.formLabelStyle} container={true} xs={12}>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="applicationCode"
                  label="Application"
                  isRequiredField={true}
                  options={applicationList}
                  selectedOption={selectedApplication}
                  placeholder="Select Application"
                  isOtherFieldRequired={false}
                  component={DropDown}
                  required={true}
                  handleSelectedOption={(value) => {
                    setApplicationCode(value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field name="split" component={NumberField} label="Split Percentage" isRequiredField={true} />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="revenueSource"
                  component={MultiSelectDropDown}
                  label="Choose Source Name (Multiselect)"
                  placeholder="Select Revenue Source"
                  isRequiredField={true}
                  options={revenueSources}
                  handleSelectedOption={(value) => {
                    setSelectedSources(value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer}>
              <Grid item={true} xs={12} className={styles.childDivWidth}>
                <Field
                  name="narration"
                  component={Input}
                  label="Description"
                  isRequiredField={true}
                  type="text"
                />
              </Grid>
            </Grid>
            <Grid container={true} item={true} xs={12} className={styles.fieldRowContainer} justify="space-between">
              <div className={styles.label}>Status</div>
              <Grid item={true} className={`${styles.headerValue3} ${styles.switchStyle}`}>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={() => setIsActive((isChecked) => !isChecked)}
                      checked={isActive}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container={true}
            className={styles.buttonStyle}
            alignItems="center"
          >
            <Grid
              onClick={() => onClose()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              <Grid style={{ padding: '4px', color: '#1518AF' }}>Cancel</Grid>
            </Grid>
            <Button type="submit" label="Save" />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default AddApplication;
