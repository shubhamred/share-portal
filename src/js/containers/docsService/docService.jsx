/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  MenuItem,
  Select,
  ListSubheader,
  List,
  ListItem,
  IconButton,
  ListItemSecondaryAction
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ControlledAccordion, DialogComponent, Breadcrumb } from 'app/components';
import { startCase, remove } from 'lodash';
import { formatDate, getHashPositionValue } from 'app/utils/utils';
import { getDocResource, addDocConfig, updateDocCategory, getDocConfigByProduct, updateConfiguration } from 'app/containers/docsService/saga';
import { getProducts } from 'app/containers/products/saga';
import DocCategory from './components/docCategory';
import AddCategory from './components/form/addDocCategory';
import LinkDocType from './components/form/linkDocType';
import LinkDocuments from './components/form/linkDocuments';
import UploadDoc from './components/form/addTemplateConfig/uploadDoc';

import WithBreadcrumb from '../../hoc/breadcrumbWrapper';
import styles from './styles.scss';
import global from '../global.scss';
import { postNewDocType } from '../applications/saga';
import Feedback from './components/feedback/feedback';
import EditDocCategory from './components/form/editDocCategory';
import { getDocs, removeFile } from '../patrons/saga';

const DocServiceManagement = (props) => {
  const { BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [openDialog, setOpenDialogstatus] = useState(false);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [linkTypesDialog, setDocTypesDialog] = useState(false);
  const [editCategoryDialog, setEditCategoryDialog] = useState(false);
  const [linkDocsDialog, setLinkDocsDialog] = useState(false);
  const [selectedResource, setResource] = useState('');
  const [resourceTypes, setResourceTypes] = useState([]);
  const [docConfig, setDocConfig] = useState([]);
  const [productList, setProductLIst] = useState([]);
  const [uploadDoc, setUploadDocConfig] = useState({});
  const [editCateogryOption, setEditOption] = useState('');
  const handleAccChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSelectChange = (value) => {
    if (value) {
      setExpanded(false);
      setResource(value);
      getDocConfigOfProduct(value);
      const newValue = value.replace('-', ' ');
      setBreadcrumbsData(newValue, 2, false, () => { }, true);
    }
  };

  const getDocConfigOfProduct = (resource) => {
    // setExpanded(false);
    getDocConfigByProduct(resource).then((res) => {
      if (res.data) {
        const formattedList = [];
        // eslint-disable-next-line no-unused-expressions
        res.data?.forEach((doc) => {
          if (doc.resources?.length) {
            doc.resources.map((cat) => formattedList.push(cat));
          }
        });
        if (formattedList?.length > 0) {
          setDocConfig(formattedList);
        }
      } else {
        setDocConfig([]);
      }
    });
  };

  const getResources = () => {
    getDocResource().then((res) => {
      if (res.data) {
        remove(res.data, (n) => n === 'PRODUCT');
        setResourceTypes(res.data);
        getApplicationsData();
      }
    });
  };

  const getApplicationsData = () => {
    getProducts().then((res) => {
      if (res.data) {
        const products = res.data.map((product) => product.productCode);
        setProductLIst(products);
      }
    });
  };

  const updateCategory = (data, id) => {
    setEditOption('Edit Options');
    updateDocCategory(id || uploadDoc.documentCategoryId, data)
      .then((res) => {
        if (res.error) {
          dispatch({
            type: 'show',
            payload: res?.message || 'Failed to update the category',
            msgType: 'error'
          });
          return;
        }
        dispatch({
          type: 'show',
          payload: 'Category updated successfully!',
          msgType: 'success'
        });
        setEditCategoryDialog(false);
        getDocConfigOfProduct(selectedResource);
      });
    if (!data.isTemplate) {
      const resource = uploadDoc.resource || uploadDoc.documentCategoryId;
      getDocs(uploadDoc.id, resource).then((response) => {
        if (response.data) {
          // eslint-disable-next-line no-unused-expressions
          response.data?.forEach((list) => (
            list?.files?.forEach((file) => removeFile(file.id))
          ));
        }
      });
      updateConfiguration(uploadDoc.id, { isTemplateRequired: false });
    } else {
      updateConfiguration(uploadDoc.id, { isTemplateRequired: true });
    }
  };

  useEffect(() => {
    getResources();
    setBreadcrumbsData('Document Configurations', 1, false, () => {
      setResource('');
      setBreadcrumbsData('All Products', 2, false, () => { }, true);
    });
  }, []);

  useEffect(() => {
    if (productList?.length > 0 && resourceTypes?.length > 0) {
      const dataList = [...productList, ...resourceTypes];
      const mData = getHashPositionValue(0);
      if (mData) {
        defaultHashHandler();
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = dataList.find((list) => list.match(re) !== null);
        if (TabValue) {
          handleSelectChange(TabValue);
        }
      }
    }
  }, [productList, resourceTypes]);

  const handleCancel = () => {
    setExpanded(false);
  };

  const handleSubmit = (value) => {
    const data = {
      resource: typeof value.resource !== 'string' ? value?.resource?.key : value.resource,
      isMandatory: value?.isMandatory || false,
      description: value?.description || null,
      defaultTemplate: data?.defaultTemplate || null,
      isTemplateRequired: value?.isTemplate || false,
      isSignatureRequired: value?.isDocSigning || false,
      displayOrder: 0,
      product: value?.product,
      applicationStatus: value?.applicationStatus
    };
    if (value.isDoc) {
      data.documentType = {
        name: data?.name || '',
        maximumFiles: data?.maximumFiles || 0,
        maximumFileSize: data.maximumFileSize * (1024 * 1024) || 0,
        allowedContentTypes: data?.fileType || []
      };
    } else {
      data.documentTypeId = value?.docType?.id || undefined;
    }

    if (value?.docCategory?.id) {
      data.documentCategoryId = value?.docCategory?.id;
    } else {
      data.documentCategory = {
        name: value?.docCategory?.name || '',
        noOfDocTypesRequired: +value?.noOfDocTypesRequired || 1,
        isMandatory: value?.isDocMandatory || false,
        displayOrder: 0
      };
    }
    docConfigHandler(data);
  };

  const docConfigHandler = (mData) => {
    addDocConfig(mData).then((res) => {
      if (res.data) {
        setOpenDialogstatus(false);
        getDocConfigOfProduct(selectedResource);
        setOpenDocDialog(true);
        setUploadDocConfig(res.data);
      } else {
        dispatch({
          type: 'show',
          payload: res?.message || '',
          msgType: 'error'
        });
      }
    });
  };

  const docCategoryHandler = (value) => {
    const data = {
      resource: selectedResource,
      isMandatory: value?.isMandatory || false,
      displayOrder: 0,
      isTemplateRequired: value?.isTemplateRequired,
      documentTypeId: value?.documentTypeId,
      documentCategory: {
        name: value?.docCategory?.name || ''
      }
    };
    addDocConfig(data);
  };

  const handleLinkDocTypes = (data) => {
    postNewDocType(data)
      .then((res) => {
        if (res.error) {
          dispatch({
            type: 'show',
            payload: res?.message || 'Failed to link document types!',
            msgType: 'error'
          });
        } else {
          dispatch({
            type: 'show',
            payload: 'Document types linked successfully!',
            msgType: 'success'
          });
        }
        setSuccessDialog(true);
        setDocTypesDialog(false);
      });
  };

  const getProductName = (code) => {
    switch (code) {
      case 'PRD-BLAZE': return 'Blaze';
      case 'PRD-GRO': return 'Gro';
      default: return '';
    }
  };

  const tag = (
    <Grid item={true} className={styles.tag}>
      {uploadDoc?.documentCategory?.name}
    </Grid>
  );

  return (
    <Grid className={global.wrapper} direction="column">
      <Grid className={global.commanPadding} item={true} xs={12}>
        <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} />
      </Grid>
      {!selectedResource && (
        <Grid item={true} xs={12} className={global.commanPadding}>
          <Grid item={true} xs={12} className={styles.heading}>
            All Products
          </Grid>
        </Grid>
      )}
      {!selectedResource && (
        <Grid className={global.commonSpacing} item={true} xs={12}>
          <List>
            {resourceTypes.length || productList.length ? (
              <>
                {/* {resourceTypes.length
                  ? resourceTypes.map((list) => (
                    <ListItem className={styles.listItemPadding} key={list} onClick={() => handleSelectChange(list)}>
                      <Grid container={true}>
                        <Grid item={true} xs={12} container={true} justify="space-between">
                          <Grid item={true} xs={3} className={styles.listSubContainer}>
                            {startCase(list)}
                          </Grid>
                          <Grid item={true} xs={3} className={styles.listSubContainer} />
                          <Grid item={true} xs={5} />
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="Visit"
                          onClick={() => handleSelectChange(list)}
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  : null} */}
                {productList.length
                  ? productList.map((list) => (
                    <ListItem className={styles.listItemPadding} key={list} onClick={() => handleSelectChange(list)}>
                      <Grid container={true}>
                        <Grid item={true} xs={12} container={true} justify="space-between">
                          <Grid item={true} xs={3} className={styles.listSubContainer}>
                            {getProductName(list)}
                          </Grid>
                          <Grid item={true} xs={3} className={styles.listSubContainer} />
                          <Grid item={true} xs={5} />
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="Visit"
                          onClick={() => handleSelectChange(list)}
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  : null}
              </>
            ) : (
              <p>No Data Available</p>
            )}
          </List>
        </Grid>
      )}

      {selectedResource && (
        <Grid
          className={global.commanPadding}
          item={true}
          xs={12}
          container={true}
          alignItems="center"
          justify="space-between"
        >
          <Grid container={true} item={true} xs={4}>
            <Grid item={true} xs={12}>
              <p className={styles.heading}>{getProductName(selectedResource)}</p>
            </Grid>
          </Grid>
          <Grid item={true} xs="auto">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedResource}
              className={styles.resourceSelect}
              onChange={({ target }) => handleSelectChange(target.value)}
              variant="outlined"
              color="primary"
              classes={{ root: styles.selectPadding }}
            >
              {/* <MenuItem value="" disabled={true}>
                Resource Type
              </MenuItem>
              {resourceTypes.map((resource) => (
                <MenuItem key={resource} value={resource}>
                  {startCase(resource)}
                </MenuItem>
              ))} */}
              <ListSubheader defaultValue="">Products</ListSubheader>
              {productList.map((product) => (
                <MenuItem key={product} value={product}>
                  {startCase(product)}
                </MenuItem>
              ))}
            </Select>
            <Button
              className={styles.buttonStyle}
              onClick={() => setOpenDialogstatus(true)}
              variant="contained"
              color="primary"
            >
              Add doc category
            </Button>
          </Grid>
        </Grid>
      )}
      {selectedResource && (
        <Grid className={global.commanPadding} item={true} xs={12}>
          <Grid container={true} item={true} xs={12}>
            {docConfig.map((config) => (
              <ControlledAccordion
                key={config.id}
                fullWidth={true}
                heading={
                  <Grid container={true} justify="space-between" alignItems="center">
                    <Grid item={true} xs={4} className={styles.accHeading}>
                      {config?.documentCategory?.name || ''}
                    </Grid>
                    {/* <Grid item={true} xs={4} style={{ display: 'flex' }}>
                      {config?.product && (
                        <>
                          <p className={styles.listItemValue}>Resource:</p>
                          <p className={styles.listItemValue}>
                            {config?.resource || '--'}
                          </p>
                        </>
                      )}
                    </Grid> */}
                    <Grid item={true} xs={2} style={{ display: 'flex' }}>
                      <p className={styles.listItemValue}>Last Updated:</p>
                      <p className={styles.listItemValue}>
                        {config?.updatedAt && formatDate(config.updatedAt)}
                      </p>
                    </Grid>
                    {expanded === config.id && (
                      <Grid item={true}>
                        <Select
                          labelId="simple-select"
                          id="simple-select"
                          value={editCateogryOption || 'Edit Options'}
                          label="Edit category"
                          className={styles.editOption}
                          onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            setEditOption(e.target.value);
                            setUploadDocConfig(config);

                            switch (e.target.value) {
                              case 'Edit category':
                                setEditCategoryDialog(true);
                                break;
                              case 'Upload templates':
                                setOpenDocDialog(true);
                                break;
                              case 'Link documents':
                                setLinkDocsDialog(true);
                                break;
                              default: break;
                            }
                          }}
                          color="primary"
                          classes={{ root: styles.selectPadding }}
                        >
                          <MenuItem value="Edit Options" disabled={true}>
                            Edit Options
                          </MenuItem>
                          <MenuItem value="Edit category">
                            Edit category
                          </MenuItem>
                          {/* <MenuItem value="Upload templates">
                            Upload templates
                          </MenuItem> */}
                          <MenuItem value="Link documents">
                            Link documents
                          </MenuItem>
                        </Select>
                      </Grid>
                    )}
                    <Grid item={true} xs={1} />
                  </Grid>
                }
                expanded={expanded}
                id={config.id}
                handleChange={handleAccChange}
                unmountOnExit={true}
              >
                <Grid container={true} item={true} xs={12}>
                  <DocCategory
                    config={config}
                    handleCancel={handleCancel}
                    resourceTypes={resourceTypes}
                    fetchConfigData={() => getDocConfigOfProduct(selectedResource)}
                    currentResource={selectedResource}
                  />
                </Grid>
              </ControlledAccordion>
            ))}
          </Grid>
        </Grid>
      )}

      {/* Add Document Category */}
      {openDialog && (
        <DialogComponent
          title="Create document category"
          customWidth="600px"
          closeButton={false}
          onClose={() => setOpenDialogstatus(false)}
          steps={{ total: 2, active: 1 }}
          disableFocus={true}
        >
          <AddCategory
            onSubmit={handleSubmit}
            selectedResource={selectedResource}
            resourceTypes={resourceTypes}
            handleCategory={docCategoryHandler}
            handleCancel={() => {
              setOpenDialogstatus(false);
            }}
          />
        </DialogComponent>
      )}
      {/* Add Document Category */}

      {/* Upload Templates at Category level */}
      {openDocDialog && (
        <DialogComponent
          title="Upload Templates"
          customWidth="600px"
          closeButton={false}
          onClose={() => setOpenDocDialog(false)}
          tag={tag}
          steps={{ total: 2, active: 2 }}
        >
          <UploadDoc
            uploadDoc={uploadDoc}
            handleCancel={() => {
              if (editCateogryOption) {
                setEditOption('Edit Options');
                setOpenDocDialog(false);
                return;
              }
              setEditOption('Edit Options');
              setOpenDocDialog(false);
              // setDocTypesDialog(true);
            }}
            // customCancelText={editCateogryOption ? '' : 'Skip to doc types'}
            customCTAText={editCateogryOption ? '' : 'Save'}
          />
        </DialogComponent>
      )}
      {/* Upload Templates at Category level */}

      {/* Link document types */}
      {linkTypesDialog && (
        <DialogComponent
          title="Add doc types"
          customWidth="600px"
          closeButton={false}
          onClose={() => setDocTypesDialog(false)}
          tag={tag}
          steps={{ total: 3, active: 3 }}
        >
          <LinkDocType
            uploadDoc={uploadDoc}
            onSubmit={handleLinkDocTypes}
            handleCancel={() => {
              setEditOption('Edit Options');
              setDocTypesDialog(false);
            }}
          />
        </DialogComponent>
      )}
      {/* Link document types */}

      {/* Edit document category */}
      {editCategoryDialog && (
        <DialogComponent
          title="Edit document category"
          customWidth="600px"
          closeButton={false}
          onClose={() => setEditCategoryDialog(false)}
          tag={tag}
          disableFocus={true}
        >
          <EditDocCategory
            uploadDoc={uploadDoc}
            onSubmit={updateCategory}
            handleCancel={() => {
              setEditOption('Edit Options');
              setEditCategoryDialog(false);
            }}
          />
        </DialogComponent>
      )}
      {/* Edit document category */}

      {/* Success */}
      {successDialog && (
        <DialogComponent closeButton={false} steps={null}>
          <Feedback
            message={
              <>
                Doc Category
                {' '}
                <br />
                {' '}
                Successfully
                {' '}
                {editCateogryOption ? 'Updated' : 'Created'}
              </>
            }
            ctaText="Okay!"
            onClose={() => setSuccessDialog(false)}
          />
        </DialogComponent>
      )}
      {/* Success */}

      {/* Link documents */}
      {linkDocsDialog && (
        <DialogComponent
          title="Link documents"
          customWidth="600px"
          closeButton={false}
          onClose={() => setLinkDocsDialog(false)}
          tag={tag}
          steps={null}
        >
          <LinkDocuments
            uploadDoc={uploadDoc}
            onSubmit={handleLinkDocTypes}
            resourceTypes={resourceTypes}
            docConfig={docConfig}
            setDocConfig={setDocConfig}
            handleCancel={(fetchData, linkedSuccess) => {
              if (fetchData) {
                getDocConfigOfProduct(uploadDoc.product);
              }
              if (linkedSuccess === 'error') {
                dispatch({
                  type: 'show',
                  payload: 'Failed to link Documents!',
                  msgType: 'error'
                });
                return;
              }
              if (linkedSuccess) {
                dispatch({
                  type: 'show',
                  payload: 'Documents linked successfully!',
                  msgType: 'success'
                });
              }
              setEditOption('Edit Options');
              setLinkDocsDialog(false);
            }}
          />
        </DialogComponent>
      )}
      {/* Link documents */}

    </Grid>
  );
};

const defaultArray = [
  { title: '', level: 0, functions: () => { } },
  { title: 'Document Configurations', level: 1, functions: () => { } },
  { title: 'All Resources', level: 2, functions: () => { } }
];
export default WithBreadcrumb(DocServiceManagement, defaultArray);
