import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import { AddButton } from 'app/components';
import DialogComponent from 'app/components/dialogComponent/dialogComponent';
import AddEmailForm from '../../forms/addEmailForm';
import EditEmailForm from '../../forms/editEmailForm';
import styles from '../styles.scss';

const EmailTabContent = (props) => {
  const [openDialog, setOpenDialogstatus] = useState(false);
  const {
    saveAddEmail,
    emails,
    updateEmail,
    resourceId,
    getEmails,
    resource,
    communicationDetailsUpdate,
    emailsFetchInProgress,
    clearEmails
  } = props;

  useEffect(() => {
    if (getEmails && resourceId) getEmails(resourceId);
  }, [resourceId]);

  const handleFormSUbmit = (values) => {
    if (values) {
      const emailType = values.emailType.split(' ').join('');
      updateEmail({ ...values, emailType });
    }
  };

  // Clear emails data in store componentWillUnmount
  useEffect(() => () => clearEmails(), []);

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };
  const handleSubmit = (values) => {
    if (values) {
      const emailType = values.emailType.split(' ').join('');
      saveAddEmail({ ...values, id: resourceId, resource, emailType });
      setOpenDialogstatus(!openDialog);
    }
  };
  const emailTypelist = [
    'Personal Email',
    'Official Email',
    'Other'
  ];
  const type = [
    { label: 'Communication', name: 'Communication', checked: false }
  ];
  const renderEmails = () => {
    if (emails && !emailsFetchInProgress) {
      return emails.map(
        (data, index) => {
          const email = { ...data, emailType: data.emailType && data.emailType.split(/(?=[A-Z])/).join(' ') };
          const contactType = [];
          if (email.isCommunication) contactType.push('Communication');
          email.contactType = contactType;
          return (
            <Grid className={styles.editFormContainer}>
              <EditEmailForm
                form={`emailForm${index}${1}`}
                onSubmit={handleFormSUbmit}
                handleCancel={() => {}}
                initialValues={email}
                emailTypelist={emailTypelist}
                type={type}
                resourceId={resourceId}
                resource={resource}
                communicationDetailsUpdate={communicationDetailsUpdate}
              />
            </Grid>);
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
          <AddButton onClick={handleOpenModal} label="Add Email" />
        </Grid>
      </Grid>
      {renderEmails()}
      {openDialog && (
        <DialogComponent onClose={() => setOpenDialogstatus(false)}>
          <AddEmailForm
            onSubmit={handleSubmit}
            formTitle="Add a new Email"
            handleCancel={() => {
              setOpenDialogstatus(false);
            }}
            emailTypelist={emailTypelist}
            type={type}
          />
        </DialogComponent>
      )}
    </Grid>
  );
};

EmailTabContent.propTypes = {
  getEmails: PropTypes.func,
  saveAddEmail: PropTypes.func,
  emails: PropTypes.shape([]),
  updateEmail: PropTypes.func,
  resourceId: PropTypes.string,
  resource: PropTypes.string,
  communicationDetailsUpdate: PropTypes.bool,
  emailsFetchInProgress: PropTypes.bool,
  clearEmails: PropTypes.func
};

EmailTabContent.defaultProps = {
  getEmails: () => {},
  saveAddEmail: () => {},
  emails: [],
  updateEmail: () => {},
  resourceId: '',
  resource: '',
  communicationDetailsUpdate: false,
  emailsFetchInProgress: false,
  clearEmails: () => {}
};

export default EmailTabContent;
