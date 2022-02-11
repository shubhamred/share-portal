/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Grid, Button, InputLabel, MenuItem, Select, FormControl } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import SingDocType from 'app/components/addDocumentForm/SingDocType';
import { getDocumentCategories, getDocumentTypes } from 'app/containers/applications/saga';

const AddDocumentSection = (props) => {
  const { onClose, onSave, isAdditionalDoc = false, product, application, docCategoryDisable = false } = props;
  const defaultFileType = {
    docType: '',
    description: null,
    isVisible: false,
    isMandatory: isAdditionalDoc,
    isMultiple: false
  };
  const [docsArr, setDocsArr] = useState([{ ...defaultFileType, id: 0 }]);
  const [selectedDocCat, setDocCat] = useState('');
  const [docCatOptions, setDocCatOptions] = useState([]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);

  const handleAddField = () => {
    setDocsArr((prevState) => [...prevState, { ...defaultFileType, id: prevState.length }]);
  };

  const handleOnSave = () => {
    const docData = [];
    docsArr.forEach((element, index) => {
      docData.push({
        documentTypeId: element.docType,
        isMandatory: element.isMandatory,
        displayOrder: index,
        description: element.description
      });
    });
    const mData = {
      resource: product?.productCode || application?.applicationCode || '',
      documentCategoryId: selectedDocCat,
      configuredDocumentTypes: [...docData]
    };

    if (application?.id) {
      onSave({ docsArr, selectedDocCat });
    } else {
      onSave(mData);
    }
  };

  const handleDocCatChange = (event) => {
    const { value } = event.target;
    setDocCat(value);
  };

  const handleInputChange = (event, index) => {
    const values = [...docsArr];
    const { value } = event.target;
    values[index].description = value;
    setDocsArr(values);
  };

  const handleFieldChange = (id, name, value) => {
    const values = [...docsArr];
    switch (name) {
      case 'visibility':
        values[id].isVisible = value;
        break;
      case 'multiple':
        values[id].isMultiple = value;
        break;
      case 'mandatory':
        values[id].isMandatory = value;
        break;
      case 'docType':
        values[id].docType = value;
        break;
      default:
        break;
    }
    setDocsArr(values);
  };

  const handleDelete = (index) => {
    const values = [...docsArr];
    values.splice(index, 1);
    setDocsArr(values);
  };

  useEffect(() => {
    getDocumentCategories(100)
      .then((res) => {
        if (res.data) {
          setDocCatOptions(res.data);

          if (docCategoryDisable) {
            const mdata = res.data.find((list) => list.key === 'ADDITIONAL_DOCUMENTS');
            setDocCat(mdata.id || '');
          }
          if (res.data.length === 1) {
            setDocCat(res.data[0].id);
          }
        }
      });
    getDocumentTypes(100)
      .then((res) => {
        if (res.data) {
          setDocTypeOptions(res.data);
        }
      });
    // }
  }, [product]);

  return (
    <Grid container={true}>
      <Grid item={true} xs={12} container={true} style={{ display: 'none' }}>
        <Grid item={true} xs={3} style={{ marginBottom: '10px' }}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id="doc_cat">Select Document Category</InputLabel>
            <Select
              labelId="doc_cat"
              value={selectedDocCat}
              onChange={handleDocCatChange}
              disabled={docCatOptions.length === 1}
            >
              {docCatOptions.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item={true} xs={12} container={true}>
        {docsArr.map((doc, docIndex) => (
          <Grid container={true} key={`index_${doc.id}`} justify="space-between" alignItems="center">
            <Grid item={true} xs={3} style={{ marginBottom: '10px' }}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="doc_cat">Document Category</InputLabel>
                <Select
                  labelId="doc_cat"
                  value={selectedDocCat}
                  onChange={handleDocCatChange}
                  disabled={docCategoryDisable || docCatOptions.length === 1}
                >
                  {docCatOptions.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item={true} xs={8}>
              <SingDocType
                isEditable={true}
                deleteRequired={true}
                isAdditionalDoc={isAdditionalDoc}
                {...doc}
                docTypesArr={docTypeOptions}
                id={doc.id}
                onFieldUpdate={handleFieldChange}
                handleDelete={handleDelete}
              />
            </Grid>
            {isAdditionalDoc && (
              <Grid item={true}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="description"
                  label="Note for the brand"
                  onChange={(e) => handleInputChange(e, docIndex)}
                />
              </Grid>
              )}
          </Grid>
        ))}
        <Grid item={true} xs={12}>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddField}
          >
            Add another document
          </Button>
        </Grid>
        <Grid item={true} xs={6} />
        <Grid item={true} xs={6} container={true} justify="flex-end">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleOnSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(AddDocumentSection);
