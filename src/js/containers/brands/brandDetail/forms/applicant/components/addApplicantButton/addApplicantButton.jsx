import React, { useState } from 'react';
import { ButtonBase } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { DialogComponent } from 'app/components';
import NewApplicant from '../addApplicant';

import styles from './styles.scss';
import { addNewApplicant } from '../../../../../saga';

const AddApplicantButton = (props) => {
  const { applicantList, companyId, handleApplicantSelection, selectedApplicant } = props;
  const [showNames, setShowNames] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSelectedApplicant = (value) => {
    handleApplicantSelection(value);
    setShowNames(false);
  };

  const addApplicantButton = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <AddCircleIcon style={{ fill: '#5064E2', fontSize: '33' }} />
      <div style={{ padding: '4px', fontSize: '15px' }}>Add Applicant</div>
    </div>
  );

  const onSubmit = (values) => {
    setOpenDialog(false);
    addNewApplicant(values, companyId);
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className={styles.container} tabIndex="0" onBlur={() => setShowNames(false)}>
      <div className={styles.buttonWrapper} onClick={() => setShowNames(!showNames)} role="presentation">
        <div className={styles.select}>
          <div>{selectedApplicant && selectedApplicant.name}</div>
          <ArrowDropDownIcon style={{ fill: 'white', fontSize: '30' }} />
        </div>
        <ButtonBase
          onClick={() => setOpenDialog(true)}
          className={styles.addButton}
        >
          {addApplicantButton}
        </ButtonBase>
      </div>
      {showNames && (
        <div className={styles.nameList}>
          {applicantList && applicantList.map((applicant) => (
            <div className={styles.names} onClick={() => handleSelectedApplicant({ name: applicant.customer.firstName, id: applicant.customer.id })} role="presentation">
              {applicant && applicant.customer && applicant.customer.firstName}
            </div>
          ))}
        </div>)}
      {openDialog && (
        <DialogComponent
          onClose={() => setOpenDialog(false)}
        >
          <NewApplicant
            onSubmit={onSubmit}
            formTitle="Create Applicant"
            handleCancelButton={() => setOpenDialog(false)}
          />
        </DialogComponent>
      )}
    </div>
  );
};

export default AddApplicantButton;
