import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ApplicationDetailComponent from 'app/containers/brands/brandDetail/sections/companyApplications/components/applicationDetail';
import { getApplicationDetail } from 'app/containers/applications/saga';
import { getCompanies } from 'app/containers/companies/saga';
import { List, ListItem, ListItemText } from '@material-ui/core';
import ApplicationStatus from './components/applicationStatus';
import { Breadcrumb } from '../../../components';
import style from './styles.scss';
import globalStyles from '../../global.scss';
import WithBreadcrumb from '../../../hoc/breadcrumbWrapper';

const useStyles = makeStyles({
  primary: {
    color: '#0000008A',
    fontSize: '14px'
  },
  secondary: {
    color: '#000000',
    fontSize: '16px'
  }
});

const ApplicationDetail = (props) => {
  const { BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler } = props;
  const { applicationId } = useParams();
  const classes = useStyles();
  const [applicationDetail, setApplication] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const getData = () => {
    getApplicationDetail(applicationId).then((res) => {
      if (res.data) {
        setApplication(res.data);
        const query = {
          fields: 'businessName,id',
          includes: ['brandProfile'],
          where: {
            id: res.data.companyId
          }
        };
        getCompanies(50, 1, undefined, undefined, undefined, query).then((company) => {
          if (company.data) {
            setCompanyName({
              ...company.data[0],
              company: { id: company.data[0].id, businessName: company.data[0].businessName }
            });
            setBreadcrumbsData(company?.data[0]?.businessName || 'Applications Detail', 1);
          }
        });
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleStatusUpdateSuccess = () => {
    getData();
  };

  useEffect(() => {
    defaultHashHandler();
  }, []);

  return (
    <Grid container={true}>
      <Grid
        className={`${style.contentWrapper}`}
        item={true}
        container={true}
        direction="row"
      >
        {applicationDetail && (
          <div className={style.headerWraper}>
            <Grid
              container={true}
              item={true}
              direction="row"
              justify="space-between"
              className={`${style.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
            >
              <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} />
              <Grid item={true} direction="column" xs={12} md={6} lg={6}>
                <List className={style.list}>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Application"
                      secondary={applicationDetail?.applicationCode}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      classes={classes}
                      primary="Company Name"
                      secondary={
                        <span>
                          <Link
                            to={`/brands/${companyName?.brandProfile?.id}`}
                            className={style.titleSubHeading}
                          >
                            <p className={`${style.textTruncate}`}>
                              {companyName?.businessName ? (
                                <Tooltip title={companyName.businessName}>
                                  <span>{companyName.businessName}</span>
                                </Tooltip>
                              ) : (
                                '-'
                              )}
                            </p>
                          </Link>
                        </span>
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Company Code"
                      secondary={applicationDetail?.companyCode}
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Product Name"
                      secondary={applicationDetail?.product?.name}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item={true}
                justify="flex-end"
                xs={12}
                md={6}
                lg={6}
                style={{ display: 'flex', textAlign: 'end' }}
              >
                {applicationDetail?.status && (
                  <ApplicationStatus
                    brandDetail={companyName}
                    applicationCode={applicationDetail?.applicationCode || ''}
                    application={applicationDetail}
                    onStatusUpdateSuccess={handleStatusUpdateSuccess}
                  />
                )}
              </Grid>
            </Grid>
          </div>
        )}
        <Grid
          container={true}
          item={true}
          direction="row"
          justify="space-between"
          className={globalStyles.bodyContentWrapper}
          style={{ height: '100%' }}
        >
          <Grid className={style.formContainer}>
            <div>
              {applicationDetail && (
                <ApplicationDetailComponent
                  application={applicationDetail}
                  id={applicationId}
                  position={2}
                  updateData={getData}
                  setBreadcrumbsData={setBreadcrumbsData}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const defaultArray = [
  { title: 'Applications', level: 0, functions: () => {} },
  { title: 'Applications Detail', level: 1, functions: () => {} }
];
export default React.memo(WithBreadcrumb(ApplicationDetail, defaultArray));
