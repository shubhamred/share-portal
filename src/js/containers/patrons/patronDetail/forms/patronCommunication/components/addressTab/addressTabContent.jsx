import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import { AddButton, DialogComponent } from 'app/components';
import AddAddressForm from '../../forms/addAddressForm';
import EditAddressForm from '../../forms/editAddressForm';
import styles from '../styles.scss';

const AddressTabContent = (props) => {
  const [openDialog, setOpenDialogstatus] = useState(false);
  const {
    saveAddAddress,
    addresses,
    updateAddress,
    resourceId,
    resourceCode,
    getAddresses,
    resource,
    communicationDetailsUpdate,
    addressesFetchInProgress,
    clearAddresses
  } = props;
  useEffect(() => {
    if (getAddresses && resourceCode) getAddresses(resourceCode);
  }, [resourceCode]);

  // Clear addresses data in store componentWillUnmount
  useEffect(() => () => clearAddresses(), []);

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };
  const handleSubmit = (values) => {
    if (values) {
      saveAddAddress({ ...values, id: resourceId, resourceCode, premiseOwnership: values.premiseOwnership.split(' ').join('_'), resource });
      setOpenDialogstatus(!openDialog);
    }
  };

  const addressTypelist = [
    'Permanent',
    'Registered',
    'Business',
    'Correspondence',
    'Other'
  ];
  const ownershipList = [
    'Owned by Self',
    'Owned by Family',
    'Rented'
  ];
  const renderAddresses = () => {
    if (addresses && !addressesFetchInProgress) {
      return addresses.map(
        (data, index) => {
          const address = { ...data };
          address.premiseOwnership = address.premiseOwnership ? address.premiseOwnership.split('_').join(' ') : '';
          return (
            <Grid className={styles.editFormContainer}>
              <EditAddressForm
                form={`addressForm${index}${1}`}
                onSubmit={updateAddress}
                handleCancel={() => { }}
                initialValues={address}
                addressTypelist={addressTypelist}
                ownershipList={ownershipList}
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
          <AddButton onClick={handleOpenModal} label="Add Address" />
        </Grid>
      </Grid>
      {renderAddresses()}
      {openDialog && (
        <DialogComponent onClose={() => setOpenDialogstatus(false)}>
          <AddAddressForm
            onSubmit={handleSubmit}
            formTitle="Add new address"
            handleCancel={() => {
              setOpenDialogstatus(false);
            }}
            addressTypelist={addressTypelist}
            ownershipList={ownershipList}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

AddressTabContent.propTypes = {
  getAddresses: PropTypes.func,
  saveAddAddress: PropTypes.func,
  addresses: PropTypes.shape([]),
  updateAddress: PropTypes.func,
  resourceId: PropTypes.string,
  resource: PropTypes.string,
  resourceCode: PropTypes.string,
  communicationDetailsUpdate: PropTypes.bool,
  addressesFetchInProgress: PropTypes.bool,
  clearAddresses: PropTypes.func
};

AddressTabContent.defaultProps = {
  getAddresses: () => { },
  saveAddAddress: () => { },
  addresses: [],
  updateAddress: () => {},
  resourceId: '',
  resource: '',
  resourceCode: '',
  communicationDetailsUpdate: false,
  addressesFetchInProgress: false,
  clearAddresses: () => { }
};

export default AddressTabContent;
