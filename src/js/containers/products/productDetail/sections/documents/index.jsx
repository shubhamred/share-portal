import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
// import { startCase } from 'lodash';
// import SingDocType from 'app/components/addDocumentForm/SingDocType';
import { ControlledAccordion, DialogComponent } from 'app/components';
// import AddIcon from '@material-ui/icons/Add';
// import HighlightOffIcon from '@material-ui/icons/HighlightOff';
// import { getConfig } from 'app/containers/patrons/saga';
import { postNewDocType } from 'app/containers/applications/saga';
import { getDocConfig } from 'app/containers/docsService/saga';
import AddDocumentSection from './addDocument';
import styles from './style.scss';
import DocCategory from '../../../../docsService/components/docCategory';
import { mockData } from '../../../../docsService/mockData';

const DocumentsTab = (props) => {
  const { product } = props;
  const [expanded, setExpanded] = useState(false);
  const [openModal, toggleModal] = useState(false);
  // const [docCat, setDocCat] = useState([]);
  const [docConfig, setDocConfig] = useState(mockData.data);

  const handleAccChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  // useEffect(() => {
  //   if (product?.productCode) {
  //     getConfig(product.productCode).then((res) => {
  //       if (res.data) {
  //         setDocCat(res.data);
  //       }
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (product?.productCode) {
      getDocConfig(product.productCode).then((res) => {
        if (res.data) {
          setDocConfig(res.data);
        }
      });
    }
  }, []);

  const addCategory = (data) => {
    if (data?.configuredDocumentTypes.length > 0) {
      postNewDocType(data).then((res) => {
        if (res.data) {
          toggleModal(false);
        }
      });
    }
  };

  const handleCancel = () => {
    setExpanded(false);
  };

  const getDocConfigOfResource = (resource) => {
    // setExpanded(false);
    getDocConfig(resource).then((res) => {
      if (res.data) {
        setDocConfig(res.data);
      } else {
        setDocConfig([]);
      }
    });
  };

  return (
    <Grid container={true}>
      <Grid
        item={true}
        xs={12}
        container={true}
        justify="space-between"
        alignItems="center"
      >
        <Grid item={true} xs={10}>
          <p className={styles.mainHeading}>required Documents</p>
          <p className={styles.detailText}>
            All the document sections will be visible to all the Brands under
            this Product. If you want to add additional documents for any brand,
            please add it from Brand documents module
          </p>
        </Grid>
        <Grid item={true} xs={2} style={{ textAlign: 'end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleModal(true)}
          >
            Add Section
          </Button>
        </Grid>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true} item={true} xs={12}>
          {docConfig.map((config) => (
            <ControlledAccordion
              key={config.documentCategoryId}
              fullWidth={true}
              heading={<p className={styles.accHeading}>{config?.documentCategory?.name || ''}</p>}
              expanded={expanded}
              id={config.documentCategoryId}
              handleChange={handleAccChange}
              unmountOnExit={true}
            >
              <Grid container={true} item={true} xs={12}>
                <DocCategory
                  config={config}
                  handleCancel={handleCancel}
                  fetchConfigData={() => getDocConfigOfResource(product?.productCode)}
                  currentResource={product?.productCode}
                />
              </Grid>
            </ControlledAccordion>
          ))}
        </Grid>
      </Grid>

      {/* <Grid item={true} xs={12} container={true}>
        {docCat.map((acc) => (
          <Grid key={acc.id} item={true} xs={12}>
            <ControlledAccordion
              heading={acc.name}
              expanded={expanded}
              handleChange={handleAccChange}
              id={acc.id}
            >
              <Grid container={true}>
                {acc.configuredDocTypes?.map((type) => (
                  <Grid item={true} xs={12} key={type.id}>
                    <SingDocType
                      isMandatory={type.isMandatory}
                      name={startCase(type.documentType.name)}
                      isMultiple={type.documentType.maximumFiles > 1}
                      isVisible={type.documentType.status === 'Active'}
                    />
                  </Grid>
                ))}
                <Grid
                  item={true}
                  xs={12}
                  container={true}
                  alignItems="center"
                  justify="space-between"
                >
                  <Button color="primary" startIcon={<AddIcon />}>
                    Add Field
                  </Button>
                  <Button color="secondary" startIcon={<HighlightOffIcon />}>
                    Delete Section
                  </Button>
                </Grid>
              </Grid>
            </ControlledAccordion>
          </Grid>
        ))}
      </Grid> */}
      {openModal ? (
        <DialogComponent
          title="ADD Document section"
          onClose={() => toggleModal(false)}
          customWidth="790px"
        >
          <AddDocumentSection onSave={addCategory} product={product} onClose={() => toggleModal(false)} />
        </DialogComponent>
      ) : null}
    </Grid>
  );
};

export default React.memo(DocumentsTab);
