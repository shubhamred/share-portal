import { Button as MuiBtn, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  AutocompleteCustom, Button
} from 'app/components';
import { getDocumentTypeDetails, getDocumentTypes } from 'app/containers/docsService/saga';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Field } from 'redux-form';
import styles from '../styles.scss';

const LinkDocType = (props) => {
  const {
    onSubmit,
    handleSubmit,
    handleCancel,
    uploadDoc
  } = props;

  const [docTypelist, setDocTypelist] = useState([]);
  const [docTypeSet, setSelectedDocTypes] = useState([{}]);
  // eslint-disable-next-line no-unused-vars
  const [selectedDocType, setSelectedDocType] = useState('');

  const fetchDocTypes = (val) => {
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

  const fetchTypeDetails = (key) => getDocumentTypeDetails(key);

  const handleTypeChange = (val) => {
    if (val && val.length > 3) {
      fetchDocTypes(val);
    }
  };

  const handleFormSubmit = () => {
    onSubmit({
      // ...uploadDoc,
      resource: uploadDoc.resource,
      documentCategoryId: uploadDoc?.documentCategory.id,
      configuredDocumentTypes: docTypeSet
    });
  };

  const disableSubmit = docTypeSet?.filter((doc) => Object.keys(doc)?.length < 1)?.length > 0;

  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>

          {uploadDoc?.id && (
            <Grid item={true} xs={6} className={styles.formLabelStyle1}>
              <Grid className={styles.lableStyle}>
                Doc Category
              </Grid>
              <Grid className={styles.readOnlyText}>
                {uploadDoc?.documentCategory?.name}
              </Grid>
            </Grid>
          )}

          <Grid item={true} className={styles.formLabelStyle1} xs={12}>
            <Grid item={true} xs={10}>
              <div className={`${styles.mainTitle}`}>
                Add document types
              </div>
            </Grid>
            <Grid item={true} xs={10}>
              <div className={`${styles.lableStyle} ${styles.helpText}`}>
                Document types are files that need to be grouped under this document category.
              </div>
            </Grid>
          </Grid>

          {docTypeSet?.map((type, typeIndex) => (
            <Grid item={true} xs={12} className={styles.typeList}>
              <Grid className={styles.lableStyle}>
                Doc Type
              </Grid>
              <Field
                name="docType"
                options={docTypelist || []}
                selector="name"
                label=""
                isArray={false}
                debouncedInputChange={handleTypeChange}
                handleSelectedOption={async (eve, val) => {
                  setSelectedDocType(val);
                  const response = await fetchTypeDetails(val.key);
                  if (response.data) {
                    const tempSet = [...docTypeSet];
                    tempSet[typeIndex] = { ...response.data, isMandatory: response?.data?.isMandatory || false, documentTypeId: response.data?.id };
                    setSelectedDocTypes(tempSet);
                  }
                }}
                selectedOption={type}
                component={AutocompleteCustom}
                variant="standard"
              />
            </Grid>
          )
          )}

          <Grid item={true} xs={4} className={styles.selfAlignmentCenter}>
            <MuiBtn
              className={`${styles.addTypeLink} ${styles.mt10}`}
              type="button"
              onClick={() => setSelectedDocTypes([...docTypeSet, {}])}
            >
              <Grid className={styles.buttonLabel}>
                <AddIcon style={{ height: 18 }} />
                Add Doc Type
              </Grid>
            </MuiBtn>
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
                  disabled={disableSubmit}
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

LinkDocType.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

LinkDocType.defaultProps = {
  handleSubmit: () => { },
  onSubmit: () => { },
  handleCancel: () => { }
};

export default LinkDocType;
