import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import DialogComponent from 'app/components/dialogComponent/dialogComponent';
import { AddButton } from 'app/components';
import AddNumberForm from '../../forms/addNumberForm';
import EditNumberForm from '../../forms/editNumberForm';
import styles from '../styles.scss';

const NumberTabContent = (props) => {
  const [openDialog, setOpenDialogstatus] = useState(false);
  const {
    getPhones,
    saveAddNumber,
    numbers,
    updateNumber,
    resourceId,
    resource,
    communicationDetailsUpdate,
    phonesFetchInProgress,
    clearPhones
  } = props;

  useEffect(() => {
    if (getPhones && resourceId) getPhones(resourceId);
  }, [resourceId]);

  // Clear phones data in store componentWillUnmount
  useEffect(() => () => clearPhones(), []);

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };
  const handleSubmit = (values) => {
    if (values) {
      saveAddNumber({ ...values, id: resourceId, phoneType: values.phoneType.split(' ').join(''), resource });
      setOpenDialogstatus(!openDialog);
    }
  };
  const numberTypelist = [
    'Personal Mobile',
    'Official Mobile',
    'Official Landline'
  ];
  const type = [
    { label: 'Communication', name: 'Communication', checked: false },
    { label: 'Whatsapp', name: 'Whatsapp', checked: false }
  ];
  const renderNumbers = () => {
    if (numbers && !phonesFetchInProgress) {
      return numbers.map(
        (data, index) => {
          const number = { ...data };
          const contactType = [];
          if (number.isCommunication) contactType.push('Communication');
          if (number.isWhatsapp) contactType.push('Whatsapp');
          number.contactType = contactType;
          number.phoneType = number.phoneType && number.phoneType.split(/(?=[A-Z])/).join(' ');
          return (
            <Grid className={styles.editFormContainer}>
              <EditNumberForm
                form={`numberForm${index}${1}`}
                onSubmit={updateNumber}
                handleCancel={() => {}}
                initialValues={number}
                numberTypelist={numberTypelist}
                type={type}
                resourceId={resourceId}
                resource={resource}
                communicationDetailsUpdate={communicationDetailsUpdate}
              />
            </Grid>
          );
        }
      );
    }
    return (
      <div className={styles.progressWrapper}>
        <CircularProgress />
      </div>
    );
  };
  return (
    <Grid className={styles.tabOffset}>
      <Grid xs={12} container={true} style={{ justifyContent: 'flex-end' }}>
        <Grid item={true}>
          <AddButton onClick={handleOpenModal} label="Add Number" />
        </Grid>
      </Grid>
      {renderNumbers()}
      {openDialog && (
      <DialogComponent onClose={() => setOpenDialogstatus(false)}>
        <AddNumberForm
          onSubmit={handleSubmit}
          formTitle="Add a new Number"
          handleCancel={() => {
            setOpenDialogstatus(false);
          }}
          numberTypelist={numberTypelist}
          type={type}
        />
      </DialogComponent>
      )}
    </Grid>
  );
};

NumberTabContent.propTypes = {
  getPhones: PropTypes.func,
  saveAddNumber: PropTypes.func,
  updateNumber: PropTypes.func,
  numbers: PropTypes.shape([]),
  resourceId: PropTypes.string,
  resource: PropTypes.string,
  communicationDetailsUpdate: PropTypes.bool,
  phonesFetchInProgress: PropTypes.bool,
  clearPhones: PropTypes.func
};

NumberTabContent.defaultProps = {
  getPhones: () => {},
  saveAddNumber: () => {},
  updateNumber: () => {},
  numbers: [],
  resourceId: '',
  resource: '',
  communicationDetailsUpdate: false,
  phonesFetchInProgress: false,
  clearPhones: () => {}
};

export default NumberTabContent;
