import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Grid } from '@material-ui/core';

import AddApplicantButton from './components/addApplicantButton/addApplicantButton';
import ApplicantInfo from '../../components/applicantInfo';

const Applicant = (props) => {
  const { addNewApplicant, getApplicantList, companyId, applicantList, setApplicantBasicInfo } = props;

  const [selectedApplicant, setSelectedApplicant] = useState({
    name: (applicantList && applicantList[0].customer && applicantList[0].customer.firstName) || '',
    id: (applicantList && applicantList[0].customer && applicantList[0].customer.id) || ''
  });

  useEffect(() => {
    // if (clearValues) clearValues();
    if (getApplicantList && companyId) getApplicantList(companyId);
  }, companyId);

  useEffect(() => {
    if (applicantList && applicantList[0].customer) {
      setSelectedApplicant({
        name: (applicantList && applicantList[0].customer && applicantList[0].customer.firstName) || '',
        id: (applicantList && applicantList[0].customer && applicantList[0].customer.id) || ''
      });
    }
  }, applicantList);

  const handleApplicantSelection = (value) => {
    if (!isEqual(value, selectedApplicant)) {
      setSelectedApplicant(value);
      setApplicantBasicInfo(value.id);
    }
  };
  return (
    <Grid>
      {applicantList && applicantList[0] && companyId && (
        <>
          <AddApplicantButton
            companyId={companyId}
            addNewApplicant={addNewApplicant}
            applicantList={applicantList}
            handleApplicantSelection={handleApplicantSelection}
            selectedApplicant={selectedApplicant}
          />
          <ApplicantInfo
            selectedApplicant={selectedApplicant}
            companyId={companyId}
          />
        </>
      )}
    </Grid>
  );
};

Applicant.propTypes = {
  addNewApplicant: PropTypes.func,
  getApplicantList: PropTypes.func,
  companyId: PropTypes.string,
  applicantList: PropTypes.arrayOf(PropTypes.shape({
    customer: PropTypes.shape({
      firstName: PropTypes.string,
      id: PropTypes.string
    })
  })),
  setApplicantBasicInfo: PropTypes.func
};

Applicant.defaultProps = {
  addNewApplicant: () => { },
  getApplicantList: () => { },
  companyId: '',
  applicantList: [],
  setApplicantBasicInfo: () => { }
};

export default Applicant;
