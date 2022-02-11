import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Grid,
  FormControlLabel,
  Switch,
  TextField
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  AutocompleteCustom,
  RichTextEditor
} from 'app/components';
import {
  getDocumentTypes,
  getDocumentCategories
} from 'app/containers/docsService/saga';
import AddDocType from '../addDocType';
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

const AddCategory = (props) => {
  const { onSubmit, handleSubmit, handleCancel, selectedResource } = props;
  // eslint-disable-next-line no-unused-vars
  const [docTypelist, setDocTypelist] = useState([]);
  const [docCategorylist, setDocCategorylist] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [productList, setProdList] = useState([{ name: 'BLAZE', key: 'PRD-BLAZE' }, { name: 'GRO', key: 'PRD-GRO' }]);
  const [selectedProduct, setProduct] = useState(productList.find((prod) => prod.key === selectedResource) || {});
  const [noOfDocTypesRequired, setNoOfDocTypesRequired] = useState(0);
  const [noOfDocTypesRequiredError, setNoOfDocTypesRequiredError] = useState(false);
  const [selectedDocCategory, setSelectedDocCategory] = useState('');
  const [isDocMandatory, setIsDocMandatory] = useState(false);
  // const [isTemplate, setIsTemplate] = useState(false);
  const isDoc = false;

  const fetchData = (val) => {
    const query = {
      take: 100,
      where: {
        name: val
      }
    };
    getDocumentTypes(query).then((res) => {
      if (res.data) {
        setDocTypelist(res.data);
      }
    });
  };

  const fetchCategoryData = (val) => {
    const query = {
      take: 100,
      where: {
        name: val
      }
    };
    getDocumentCategories(query).then((res) => {
      if (res.data) {
        setDocCategorylist(res.data);
      }
    });
  };

  const handleCategoryChange = (val) => {
    if (val && val.length > 3) {
      fetchCategoryData(val);
    }
  };

  useEffect(() => {
    fetchData('');
    fetchCategoryData('');
  }, []);

  const handleFormSubmit = (values) => {
    const selectedProductResource = productList.find((prod) => prod.key === selectedResource);
    if (+noOfDocTypesRequired > 0) {
      onSubmit({
        ...values,
        noOfDocTypesRequired,
        isDocMandatory,
        isDoc,
        // isTemplate,
        product: values.product?.key || selectedProductResource?.key,
        applicationStatus: values.applicationStatus?.name
      });
    } else {
      setNoOfDocTypesRequiredError(true);
    }
  };

  const handleNoOfDocTypesRequired = (event) => {
    const {
      target: { value }
    } = event;
    setNoOfDocTypesRequired(value);
    setNoOfDocTypesRequiredError(false);
  };

  const handleAddDocType = (values) => {
    onSubmit({
      ...values,
      isDoc
    });
  };

  return (
    <Grid>
      {isDoc ? (
        <AddDocType
          handleCancel={handleCancel}
          onSubmit={handleAddDocType}
          isDocCategory={true}
          docCategorylist={docCategorylist}
          handleCategoryChange={handleCategoryChange}
        />
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.mt10}>
          <Grid container={true} xs={12}>
            <Grid item={true} xs={6}>
              <Grid className={styles.lableStyle}>
                Product
                {' '}
                <span className={styles.error}>*</span>
              </Grid>
              <Field
                name="product"
                options={productList || []}
                selector="name"
                freeSolo={true}
                label=""
                isArray={false}
                debouncedInputChange={() => {}}
                handleSelectedOption={(eve, val) => {
                  setProduct(val);
                }}
                selectedOption={selectedProduct}
                component={AutocompleteCustom}
                variant="standard"
                disabled={true}
              />
            </Grid>
            <Grid item={true} xs={6}>
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
                  setNoOfDocTypesRequired(val?.noOfDocTypesRequired);
                  setNoOfDocTypesRequiredError(false);
                }}
                selectedOption={selectedDocCategory}
                component={AutocompleteCustom}
                variant="standard"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <Grid item={true} xs={10} className={styles.pb10}>
                <div className={styles.lableStyle}>Description</div>
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
            <Grid item={true} xs={8} className={styles.formLabelStyle1}>
              <Grid className={styles.lableStyle}>
                No Of Doc Types Required
                {' '}
                <span className={styles.error}>*</span>
              </Grid>
              <TextField
                InputLabelProps={{ shrink: true }}
                className={styles.w90}
                value={noOfDocTypesRequired}
                onChange={handleNoOfDocTypesRequired}
                type="number"
                label=""
                name="noOfDocTypesRequired"
              />
              {noOfDocTypesRequiredError && (
                <Grid item={true} xs={11} className={styles.error}>
                  Please enter no. of doc types required
                </Grid>
              )}
            </Grid>
            <Grid item={true} xs={8} className={styles.formLabelStyle1}>
              <Grid container={true}>
                <Grid item={true} xs={10}>
                  <div className={styles.lableStyle1}>Doc Type Is Mandatory</div>
                </Grid>
                <Grid item={true} xs={2}>
                  <FormControlLabel
                    control={
                      <GreenSwitch
                        size="small"
                        checked={isDocMandatory}
                        onChange={({ target }) => {
                          setIsDocMandatory(target.checked);
                        }}
                        name="PrivateDeal"
                        color="primary"
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item={true} xs={12} className={`${styles.formLabelStyle1} ${styles.switchDescriptor}`}>
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
            </Grid> */}
          </Grid>
          <Grid
            item={true}
            xs={12}
            className={`${styles.formLabelStyle} ${styles.pt14}`}
          >
            <Grid container={true} justify="flex-end">
              <Grid item={true} xs="auto">
                <Button
                  onClick={handleCancel}
                  label="Cancel"
                  style={{
                    backgroundColor: '#fff',
                    color: '#4754D6',
                    minWidth: 100,
                    border: 'none',
                    width: '85%',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </Grid>
              <Grid item={true} xs="auto">
                <Button
                  type="submit"
                  label="Save"
                  // label={isTemplate ? `Save & Next` : `Save`}
                  style={{
                    backgroundColor: '#4754D6',
                    minWidth: 100,
                    width: 'fit-content',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Grid>
  );
};

AddCategory.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

AddCategory.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {}
};

export default AddCategory;
