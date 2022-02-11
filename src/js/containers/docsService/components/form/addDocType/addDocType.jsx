import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { intersection } from 'lodash';
import {
  Grid,
  FormControlLabel,
  Switch,
  Checkbox,
  TextField
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Input,
  RichTextEditor,
  AutocompleteCustom
} from 'app/components';
import { fileTypeData } from '../../../mockData';
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

const AddDocType = (props) => {
  const {
    onSubmit,
    handleSubmit,
    handleCancel,
    isDocCategory,
    docCategorylist,
    handleCategoryChange,
    linkingRow
  } = props;
  const [isMandatory, setIsMandatory] = useState(false);
  const [selectedDocCategory, setSelectedDocCategory] = useState('');
  const [noOfDocTypesRequired, setNoOfDocTypesRequired] = useState(0);
  const [noOfDocTypesRequiredError, setNoOfDocTypesRequiredError] = useState(false);
  const [docCatRequiredError, setDocCatRequiredError] = useState(false);
  const [fileType, setFileType] = useState([]);
  const [fileTypeError, setFileTypeError] = useState(false);

  const handleSelectAll = (selectedData, groupDataList) => {
    const isPush = selectedData.length === groupDataList.length;
    const mData = [...fileType];
    for (let i = 0; i < groupDataList.length; i += 1) {
      if (isPush) {
        const index = mData.findIndex((l) => l === groupDataList[i]);
        if (index >= 0) {
          mData.splice(index, 1);
        }
      } else if (mData.findIndex((l) => l === groupDataList[i]) < 0) {
        mData.push(groupDataList[i]);
      }
    }
    setFileType(mData);
  };

  const handleFormSubmit = (values) => {
    if (fileType.length <= 0) {
      setFileTypeError(true);
      return;
    }

    if (isDocCategory) {
      if (!selectedDocCategory) {
        setDocCatRequiredError(true);
        return;
      }

      if (!(+noOfDocTypesRequired > 0)) {
        setNoOfDocTypesRequiredError(true);
        return;
      }

      return;
    }

    onSubmit({
      ...values,
      isMandatory,
      fileType
    });
  };

  const handleNoOfDocTypesRequired = (event) => {
    const {
      target: { value }
    } = event;
    setNoOfDocTypesRequired(value || 0);
    setNoOfDocTypesRequiredError(false);
  };

  const handleOptionChange = (ext, isChecked) => {
    const mData = [...fileType];
    if (isChecked) {
      mData.push(ext);
    } else {
      const index = mData.findIndex((exts) => exts === ext);
      if (index >= 0) mData.splice(index, 1);
    }
    setFileType(mData);
  };

  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          {linkingRow}
          {isDocCategory && (
            <Grid item={true} xs={6} className={styles.formLabelStyle1}>
              <Grid className={styles.lableStyle}>
                Doc Category
                {' '}
                <span className={styles.error}>*</span>
              </Grid>
              <Field
                name="docCategory"
                options={docCategorylist || []}
                selector="name"
                freeSolo={true}
                label=""
                isArray={false}
                debouncedInputChange={handleCategoryChange}
                handleSelectedOption={(eve, val) => {
                  setSelectedDocCategory(val);
                  setNoOfDocTypesRequired(val?.noOfDocTypesRequired || 0);
                  setNoOfDocTypesRequiredError(false);
                  setDocCatRequiredError(false);
                }}
                selectedOption={selectedDocCategory}
                component={AutocompleteCustom}
                variant="standard"
              />
              {docCatRequiredError && (
                <Grid item={true} xs={11} className={styles.error}>
                  Please enter doc category
                </Grid>
              )}
            </Grid>
          )}
          {isDocCategory && (
            <Grid item={true} xs={6} className={`${styles.formLabelStyle1} ${styles.pr5}`}>
              <Grid className={styles.lableStyle}>
                No Of Doc Types Required
                {' '}
                <span className={styles.error}>*</span>
              </Grid>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w100}
                value={noOfDocTypesRequired}
                onChange={handleNoOfDocTypesRequired}
                type="number"
                label=""
                name="noOfDocTypesRequired"
              />
              {noOfDocTypesRequiredError && (
                <Grid item={true} xs={11} className={styles.error}>
                  Please enter no of doc types required
                </Grid>
              )}
            </Grid>
          )}
          <Grid item={true} xs={6} className={`${styles.formLabelStyle1} ${styles.pr5}`}>
            <Grid className={styles.lableStyle}>Doc Type Name</Grid>
            <Field
              name="name"
              component={Input}
              label=""
              type="text"
              isRequiredField={true}
            />
          </Grid>
          <Grid item={true} xs={12} className={styles.formLabelStyle1}>
            <Grid className={styles.lableStyle}>
              Description
            </Grid>
            <Grid item={true} xs={12} className={styles.richTextBoxStyle}>
              <Field
                name="description"
                component={RichTextEditor}
                label=""
                type="text"
              />
            </Grid>
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

          <Grid item={true} xs={12} className={styles.formLabelStyle1}>
            <Grid container={true}>
              <Grid item={true} xs={12}>
                <div className={styles.label} style={{ paddingBottom: '14px' }}>
                  Select File Type
                  {' '}
                  <span className={styles.error}>*</span>
                  {fileType?.length ? (
                    <span className={styles.length}>
                      {`(${fileType?.length})`}
                    </span>
                  ) : null}
                </div>
              </Grid>
              <Grid item={true} xs={12} style={{ paddingBottom: '14px' }}>
                <Grid container={true}>
                  {fileTypeData.map((data) => {
                    const selectedData = intersection(fileType, data.list);
                    return (
                      <Grid
                        xs="auto"
                        className={`${styles.innerStyle} ${
                          selectedData.length ? styles.innerStyleActive : ''
                        }`}
                        onClick={() => handleSelectAll(selectedData, data.list)}
                      >
                        {selectedData.length
                          ? `${data.groupName} ${selectedData.length}/${data.list.length}`
                          : data.groupName}
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <Grid item={true} xs={12}>
                <Grid container={true} className={styles.box}>
                  <Grid item={true} xs={12} className={styles.fileContainer}>
                    {fileTypeData.map((data) => (
                      <Grid container={true} className={styles.boxContainer}>
                        <Grid
                          item={true}
                          xs={12}
                          className={styles.boxContainerHeader}
                        >
                          {data.groupName}
                        </Grid>
                        {data.list.map((ext) => (
                          <Grid item={true} xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    fileType.findIndex((l) => l === ext) >= 0
                                  }
                                  onChange={({ target }) => handleOptionChange(ext, target.checked)}
                                  name={ext}
                                  color="primary"
                                />
                              }
                              label={ext}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item={true} xs={12}>
                {fileTypeError && (
                  <p className={styles.error}>Select file type</p>
                )}
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

AddDocType.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  isDocCategory: PropTypes.bool,
  docCategorylist: PropTypes.shape([]),
  handleCategoryChange: PropTypes.func
};

AddDocType.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {},
  isDocCategory: false,
  docCategorylist: [],
  handleCategoryChange: () => {}
};

export default AddDocType;
