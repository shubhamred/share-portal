import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { ControlledAccordion } from 'app/components';
import { useHistory } from 'react-router-dom';
import { getAssociatedCompanies } from 'app/containers/patrons/saga';
import styles from './styles.scss';
import globalStyles from '../../../../global.scss';

const AssociatedCompanies = (props) => {
  const { customerId } = props;
  const history = useHistory();

  const [companyList, setCompanyData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (customerId) {
      getAssociatedCompanies(customerId).then((res) => {
        if (res.data) {
          setCompanyData(res.data);
        }
      });
    }
  }, [customerId]);

  const handleViewProfile = (company) => {
    if (company.company.id) {
      if (company.company.companyType === 'Brand') {
        history.push(`/brands/${company.company.brandProfile.id}`);
      } else if (company.company.companyType === 'InstitutionalInvestor') {
        history.push(`/companies/${company.company.id}`);
      }
    }
  };

  const handleAccChange = (isExpanded, panel) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container={true} className={globalStyles.commonSpacing}>
      <Grid item={true} xs={12}>
        <Grid container={true} justify="space-between" alignItems="center">
          <p>Associated Companies</p>
        </Grid>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid container={true}>
          {companyList.length ? (
            companyList.map((company) => (
              <Grid item={true} key={company.id} xs={12}>
                <ControlledAccordion
                  heading={
                    <>
                      <p className={styles.accMainHeading}>
                        {company.company.businessName}
                      </p>
                      {' '}
                      <p className={styles.accSubHeading}>
                        {' '}
                        Association Type:
                        <span>{company.associationType}</span>
                      </p>
                    </>
                  }
                  expanded={expanded}
                  id={company.id}
                  handleChange={handleAccChange}
                >
                  <Grid container={true} className={styles.fieldContainer}>
                    <Grid item={true} xs={12}>
                      <div className={styles.btnContainer}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewProfile(company)}
                        >
                          {company.company.companyType === 'Brand' ? 'View Brand' : 'View Entity'}
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </ControlledAccordion>
              </Grid>
            ))
          ) : (
            <p>No Directors/Founders Found</p>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(AssociatedCompanies);
