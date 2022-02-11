import React, { useState, useEffect } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Grid, FormControlLabel, Switch, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import {
  RichTextEditor,
  AutocompleteCustom
} from 'app/components';
import { getDocumentTypes, updateDocType } from 'app/containers/docsService/saga';
import { BlazeStatus, GroStatus } from 'app/containers/applications/data';
import AddDocType from '../addDocType';
import UpdateTypeConfig from '../addDocType/updateConfig';
import styles from '../styles.scss';
import rootStyles from '../../../styles.scss';

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

const AddDocConfig = (props) => {
  const { uploadDoc, config, onSubmit, handleSubmit, handleCancel, handleUpdateType, selectedResource, resourceTypes } = props;
  const [docTypelist, setDocTypelist] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [isDocSigning, setIsDocSigning] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isDoc, setIsDoc] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [productList, setProdList] = useState([{ name: 'BLAZE', key: 'PRD-BLAZE' }, { name: 'GRO', key: 'PRD-GRO' }]);
  const [selectedProduct, setProduct] = useState(productList.find((prod) => prod.key === selectedResource) || {});
  const [selectedAppStatus, setAppStatus] = useState({});
  const [selectedRes, setSelectedResource] = useState();

  let statusList = selectedProduct.name === 'GRO' ? GroStatus : BlazeStatus;
  statusList = statusList.map((status) => ({ name: status.label, key: status.value }));
  const resourceList = resourceTypes.map((resource) => ({ name: resource, key: resource }));

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

  const handleTypeChange = (val) => {
    if (val && val.length > 3) {
      fetchData(val);
    }
  };

  useEffect(() => {
    fetchData('');
  }, []);

  const handleFormSubmit = (values) => {
    const selectedProductResource = productList.find((prod) => prod.key === selectedResource);
    onSubmit({
      ...values,
      isMandatory,
      isDoc,
      isDocSigning,
      isTemplate,
      product: values.product?.key || selectedProductResource?.key,
      applicationStatus: values.applicationStatus?.name
    });
  };

  const handleAddDocType = (values) => {
    const selectedProductResource = productList.find((prod) => prod.key === selectedResource);
    onSubmit({
      ...values,
      product: values.product?.key || selectedProductResource?.key,
      applicationStatus: values.applicationStatus?.name,
      isDoc
    });
    setIsDoc(false);
  };

  const handleUpdateDocType = (values) => {
    const payload = {
      ...values,
      isTemplateRequired: values.isTemplate,
      isSignatureRequired: values.isDocSigning
    };
    updateDocType(payload, uploadDoc.documentTypeId)
      .then(() => {
        handleUpdateType({ ...uploadDoc, documentType: { ...uploadDoc.documentType, ...payload } }, values.isTemplate);
      });
  };

  const ProductStatusRow = (
    <>
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
          Resource
          {' '}
          <span className={styles.error}>*</span>
        </Grid>
        <Field
          name="resource"
          options={resourceList || []}
          selector="name"
          freeSolo={true}
          label=""
          isArray={false}
          debouncedInputChange={() => {}}
          selectedOption={selectedRes}
          handleSelectedOption={(eve, val) => {
            setSelectedResource(val);
          }}
          component={AutocompleteCustom}
          variant="standard"
          disabled={config?.applicationStatus}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <Grid className={styles.lableStyle}>
          Application Status
          {' '}
          <span className={styles.error}>*</span>
        </Grid>
        <Field
          name="applicationStatus"
          options={statusList || []}
          selector="name"
          freeSolo={true}
          label=""
          isArray={false}
          debouncedInputChange={() => {}}
          selectedOption={config?.applicationStatus ? { name: config.applicationStatus, key: config.applicationStatus } : selectedAppStatus}
          handleSelectedOption={(eve, val) => {
            setAppStatus(val);
          }}
          component={AutocompleteCustom}
          variant="standard"
          disabled={config?.applicationStatus}
        />
      </Grid>
    </>
  );

  return (
    <Grid>
      {isDoc ? (
        (uploadDoc?.documentType)
          ? <UpdateTypeConfig uploadDoc={uploadDoc} onSubmit={handleUpdateDocType} />
          : <AddDocType
              linkingRow={ProductStatusRow}
              handleCancel={handleCancel}
              onSubmit={handleAddDocType}
              isDocCategory={false}
              uploadDoc={uploadDoc}
          />
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container={true} xs={12} className={styles.formLabelStyle1}>
            {ProductStatusRow}
            <Grid item={true} xs={8}>
              <Grid className={styles.lableStyle}>
                Doc Type
                {' '}
                <span className={styles.error}>*</span>
              </Grid>
              <Field
                name="docType"
                options={docTypelist || []}
                selector="name"
                label=""
                isArray={false}
                debouncedInputChange={handleTypeChange}
                handleSelectedOption={(eve, val) => setSelectedDocType(val)}
                selectedOption={selectedDocType}
                component={AutocompleteCustom}
                variant="standard"
              />
            </Grid>
            <Grid item={true} xs={4} className={styles.selfAlignmentCenter}>
              <Button
                className={`${rootStyles.outlineButtonStyle} ${styles.mt10}`}
                type="button"
                onClick={() => setIsDoc(true)}
              >
                <Grid className={styles.buttonLabel}>
                  <AddIcon />
                  Add Doc Type
                </Grid>
              </Button>
            </Grid>
          </Grid>
          <Grid item={true} xs={8}>
            <Grid container={true}>
              <Grid item={true} xs={10}>
                <div className={styles.lableStyle1}>Doc Type Is Mandatory</div>
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
                      name="PrivateDeal"
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={12} className={styles.formLabelStyle1}>
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
                Templates are the files/docs that are required for a Doc type and need to be shown on Brands app for user reference.
                <br />
                <br />
                For example: BR2 template are required for PAS3 filing.
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={12} className={styles.formLabelStyle}>
            <Grid container={true} justify="flex-end" alignItems="baseline">
              <Grid item={true} xs="auto">
                <Button
                  className={rootStyles.outlineButtonStyle}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item={true} xs="auto">
                <Button
                  className={rootStyles.buttonStyle}
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  {isTemplate ? 'Next' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Grid>
  );
};

AddDocConfig.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

AddDocConfig.defaultProps = {
  handleSubmit: () => {},
  onSubmit: () => {},
  handleCancel: () => {}
};

export default AddDocConfig;
