/* eslint-disable react/no-multi-comp */
import { Button as MuiBtn, Grid, IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
  AdvanceTable,
  AutocompleteCustom, Button, CustomCheckBox
} from 'app/components';
// eslint-disable-next-line no-unused-vars
import { getDocConfigSet, updateConfiguration } from 'app/containers/docsService/saga';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Field } from 'redux-form';
import styles from '../styles.scss';

const LinkDocuments = (props) => {
  const {
    handleSubmit,
    handleCancel,
    uploadDoc
  } = props;

  const [openIndex, setOpen] = useState(0);
  const [docTypeSet, setSelectedDocTypes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [selectedType, setSelectedType] = useState('');
  const [docConfigSet, setDocConfigData] = useState([]);
  const [docCategoies, setCategories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allChecked, setAllChecked] = useState(true);
  const [selectedRowIDs, setSelectedRows] = useState([]);
  const [selectedDocsIDs, setSelectedDocs] = useState([]);
  const { product = 'PRD-BLAZE', id } = uploadDoc || {};

  const handleCentralCheckbox = () => {};
  const handleCheckChange = (checked, selectedId) => {
    if (checked && !selectedRowIDs.includes(selectedId)) {
      setSelectedRows([...selectedRowIDs, selectedId]);
    } else {
      const IDs = [...selectedRowIDs];
      IDs.splice(IDs.indexOf(selectedId), 1);
      setSelectedRows(IDs);
    }
  };

  const handleDocsCheckChange = (checked, selectedId) => {
    if (checked && !selectedDocsIDs.includes(selectedId)) {
      setSelectedDocs([...selectedDocsIDs, selectedId]);
    } else {
      const IDs = [...selectedDocsIDs];
      IDs.splice(IDs.indexOf(selectedId), 1);
      setSelectedDocs(IDs);
    }
  };

  const tableColumns = [
    {
      Header: <CustomCheckBox defaultChecked={allChecked} indeterminate={true} onChange={handleCentralCheckbox} />,
      accessor: 'selection',
      customStyle: { maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <div className={styles.selectionBox}>
          <CustomCheckBox
            onChange={(val) => handleCheckChange(val, row.row?.original.id)}
            defaultChecked={selectedRowIDs.includes(row.row?.original.id)}
          />
        </div>
      )
    },
    {
      Header: 'Category',
      accessor: 'documentCategory.name',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: 'Product',
      accessor: 'product',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: 'Resource',
      accessor: 'resource',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: '',
      accessor: 'collapse',
      customStyle: { maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: () => (
        <div className={styles.selectionBox}>
          <img src="/assets/arrow-drop-up.svg" style={{ height: 8, transform: 'rotate(180deg)' }} className={styles.open} alt="arrow" />
        </div>
      )
    }
  ];

  const tableDocColumns = [
    {
      Header: <CustomCheckBox defaultChecked={allChecked} indeterminate={true} onChange={handleCentralCheckbox} />,
      accessor: 'selection',
      customStyle: { maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <div className={styles.selectionBox}>
          <CustomCheckBox
            onChange={(val) => handleDocsCheckChange(val, row.row?.original.id)}
            defaultChecked={selectedDocsIDs.includes(row.row?.original.id)}
          />
        </div>
      )
    },
    {
      Header: 'Document Type',
      accessor: 'documentType.name',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: 'Product',
      accessor: 'product',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: 'Resource',
      accessor: 'resource',
      // customStyle: {marginLeft: '-20px' },
      disableSortBy: true,
      disableFilters: true,
      Cell: (row) => (
        <span className={styles.docName}>
          {row.value}
        </span>
      )
    },
    {
      Header: '',
      accessor: 'collapse',
      customStyle: { maxWidth: 15, width: 15 },
      disableSortBy: true,
      disableFilters: true,
      Cell: () => (
        <div />
      )
    }
  ];

  // filter category based on user search
  const handleCategoryChange = (val) => {
    const tempConfig = [...docConfigSet];
    setCategories(tempConfig.filter((config) => config.name?.toLowerCase().includes(val.toLowerCase())));
  };

  const handleTypeChange = (val) => {
    // Prevent searching if typed chars are less than 3.
    if (val && val.length < 3) {
      return;
    }
    handleCategoryChange(val);
  };

  // Making an API call to link documents.
  const handleFormSubmit = () => {
    updateConfiguration(id, {
      ...uploadDoc,
      linkedDocumentIds: selectedDocsIDs?.length > 0 ? selectedDocsIDs : null
    }).then((res) => {
      if (res.error) {
        handleCancel(false, 'error');
        return;
      }
      handleCancel(true, true);
    })
      .catch(() => {
        handleCancel(false, 'error');
      });
  };

  const updateSet = (key, index, value) => {
    const tempSet = [...docTypeSet];
    tempSet[index][key] = value;
    setSelectedDocTypes(tempSet);
  };

  // const collapsibleData = [];
  // list.map((item) => {
  //   if (item.documentTypes?.length > 0) {
  //     collapsibleData.push(item);
  //     // collapsibleData.push();
  //   }
  // });
  const getTableData = (list) => list;

  // fetch combination records
  useEffect(() => {
    getDocConfigSet(product)
      .then((res) => {
        if (res.data) {
          setDocConfigData(res.data);
        }
      });
  }, []);

  // pre-populate the already linked documents
  useEffect(() => {
    if (Array.isArray(uploadDoc.linkedDocumentIds)) {
      const linkedDocSet = [];
      uploadDoc.linkedDocumentIds.forEach((linkedDocId) => {
        const obj = docConfigSet.filter((config) => config.resources[0].documentTypes.findIndex((cat) => cat.id === linkedDocId) > -1);
        if (obj?.length > 0) {
          linkedDocSet.push(...obj);
        }
      });
      const uniqueData = Array.from(new Set(linkedDocSet.map((item) => item.key)))
        .map((key) => ({ key, ...(linkedDocSet.find((item) => item.key === key)) }));
      setSelectedDocTypes(uniqueData.map((record) => ({ category: record })));
      setSelectedDocs(uploadDoc.linkedDocumentIds);
    }
  }, [uploadDoc.linkedDocumentIds, docConfigSet]);

  const handleDelete = (type, typeIndex) => {
    const docTypes = [...docTypeSet];
    if (type?.key) {
      const docTypeIndex = docTypeSet.findIndex((doc) => doc.category.key === type.key);
      if (docTypeIndex > -1) {
        if (type.resources[0].documentTypes?.length) {
          const filteredDocTypeIDs = type.resources[0].documentTypes.map((docType) => docType.id);
          const selectedDocs = selectedDocsIDs.filter((Id) => filteredDocTypeIDs.indexOf(Id) < 0);
          setSelectedDocs(selectedDocs);
        }
        docTypes.splice(docTypeIndex, 1);
      }
    } else {
      docTypes.splice(typeIndex, 1);
    }
    setSelectedDocTypes(docTypes);
  };

  return (
    <Grid>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container={true}>
          <Grid item={true} className={styles.formLabelStyle1} xs={12}>
            <Grid item={true} xs={10}>
              <div className={`${styles.lableStyle} ${styles.helpText}`}>
                Linked/associated documents are the documents that are required for this
                {' '}
                Doc category and need to be shown on Brands app for user reference but are present
                {' '}
                in another doc category.
                <br />
                <br />
                Please ensure you are linking documents from the same Product [Gro, Blaze etc,]
              </div>
            </Grid>
          </Grid>

          {docTypeSet?.map((type, typeIndex) => (
            <Grid container={true} className={styles.linkedContainer}>
              <Grid item={true} xs={12} className={styles.linkedTitle} onClick={() => setOpen(typeIndex)} justify="space-between">
                <Grid item={true}>
                  Linked document
                  {' '}
                  {typeIndex + 1}
                  <img src="/assets/arrow-drop-up.svg" className={typeIndex === openIndex ? styles.open : ''} alt="arrow" />
                </Grid>
                <Grid item={true}>
                  <IconButton
                    color="primary"
                    aria-label="Delete linked document"
                    component="span"
                    onClick={() => handleDelete(type.category, typeIndex)}
                    style={{ color: 'rgba(176, 0, 32, 0.87)' }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {typeIndex === openIndex && (
                <>
                  <Grid container={true}>
                    <Grid container={true}>
                      <Grid item={true} xs={12} className={styles.typeList} style={{ marginTop: 14 }}>
                        <Grid className={styles.lableStyle}>
                          Doc Category
                        </Grid>
                        <Field
                          name="docCategory"
                          options={docCategoies || []}
                          selector="name"
                          label=""
                          isArray={false}
                          debouncedInputChange={handleTypeChange}
                          handleSelectedOption={async (eve, val) => {
                            updateSet('category', typeIndex, val);
                            setSelectedCategory(val);
                          }}
                          selectedOption={type.category}
                          component={AutocompleteCustom}
                          variant="standard"
                        />
                      </Grid>

                      <AdvanceTable
                        fetchNextData={() => {}}
                        totalCount={10}
                        tableColumns={tableColumns}
                        tableData={getTableData(type?.category?.resources || [])}
                        // tableData={type?.category?.resources || []}
                        rowsPerPage={10}
                        setRowsPerPage={() => {}}
                        currentPage={0}
                        setPage={() => { /* setPage(pageNo) */ }}
                        isLoading={false}
                        isStatusCheckboxRequired={false}
                        disableFilter={false}
                        isPaginationRequired={false}
                        onChangeSort={() => {}}
                      />
                    </Grid>

                    <Grid container={true}>
                      <Grid item={true} xs={12} className={styles.typeList} style={{ marginTop: 14 }}>
                        <Grid className={styles.lableStyle} style={{ paddingBottom: 10 }}>
                          Document Types
                        </Grid>
                      </Grid>
                      <AdvanceTable
                        fetchNextData={() => {}}
                        totalCount={10}
                        tableColumns={tableDocColumns}
                        tableData={getTableData(type?.category?.resources[0].documentTypes || [])}
                        rowsPerPage={10}
                        setRowsPerPage={() => {}}
                        currentPage={0}
                        setPage={() => { }}
                        isLoading={false}
                        isStatusCheckboxRequired={false}
                        disableFilter={false}
                        isPaginationRequired={false}
                        onChangeSort={() => {}}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          )
          )}

          <Grid item={true} xs={8} className={styles.selfAlignmentCenter}>
            <MuiBtn
              className={`${styles.addTypeLink} ${styles.mt10}`}
              type="button"
              onClick={() => setSelectedDocTypes([...docTypeSet, {}])}
            >
              <Grid className={styles.buttonLabel}>
                {docTypeSet?.length > 0 ? 'Link another document' : 'Link documents'}
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

LinkDocuments.propTypes = {
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func
};

LinkDocuments.defaultProps = {
  handleSubmit: () => { },
  handleCancel: () => { }
};

export default LinkDocuments;
