/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Button
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { DialogComponent, ToolbarComponent, CustomeHeader, Tooltip } from 'app/components';
import { getApplicationsOfBrand } from 'app/containers/applications/saga';
import { formatCurrency, formatDateStandard, getHashPositionValue } from 'app/utils/utils';
import { getProducts } from 'app/containers/products/saga';
import { createDealForm } from 'app/containers/deals/saga';
import ApplicationStatus from 'app/containers/applications/applicationDetail/components/applicationStatus';
import AddApplication from './components/addApplication';
import ApplicationDetail from './components/applicationDetail';
import style from './style.scss';
import CreateForm from '../../forms/createDealForm';
import globalStyles from '../../../../global.scss';

const ApplicationListing = (props) => {
  const { company, companyId, position, setBreadcrumbsData, setApplicationDropDown } = props;
  const [applicationList, setApplicationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogOpen, toggleDialog] = useState(false);
  const [showListing, setApplicationListing] = useState(true);
  const [selectedApplication, setApplication] = useState(10);
  const [appDetail, setAppDetail] = useState(null);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getProducts().then((res) => {
      if (res.data) {
        setProductList(res.data);
      }
    });
  }, []);

  const toolbarActions = [
    {
      label: 'New Application',
      onClick: () => toggleDialog(true)
    }
  ];

  const fetchData = () => {
    getApplicationsOfBrand(companyId).then((res) => {
      if (res.data && res.data.length) {
        const temp = res.data
          .map((app, index) => ({ ...app, title: `Application ${index + 1}` }))
          .reverse();
        setApplicationList(temp);
        const mData = getHashPositionValue(position - 2);
        if (mData) {
          const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
          const TabValue = temp.find((list) => list.title.match(re) !== null);
          if (TabValue) {
            setBreadcrumbsData(TabValue.title, position);
            setAppDetail(TabValue);
            setApplication(TabValue.id);
            setApplicationListing(false);
            setApplicationDropDown(NavbarPopoverEl(temp, TabValue?.applicationCode));
          } else {
            setBreadcrumbsData('Applications', position - 1, true, () => hendleBreadcrumbs(), true);
            setApplicationDropDown(NavbarPopoverEl(temp));
          }
        }
      }
    });
  };

  const NavbarPopoverEl = (mData, names) => {
    const tipEl = (
      <div>
        {mData.map((application, inds) => (
          <ListItem className={`${style.listItemContainer} ${inds < mData.length - 1 ? style.listItemContainerBorder : ''}`} button={true} rel="noopener" onClick={() => handleProductClick(application)}>
            <ListItemText primary={application.applicationCode || 'Application Code'} />
          </ListItem>
        ))}
      </div>
    );
    const renderEl = (
      <div>
        <Tooltip title={tipEl}>
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#1518AF'
            }}
          >
            <>
              {names || 'Application'}
              <ArrowDropDownIcon />
            </>
          </div>
        </Tooltip>
      </div>
    );
    return renderEl;
  };

  useEffect(() => {
    if (companyId) {
      fetchData();
    }
  }, [companyId]);

  useEffect(() => {
    setBreadcrumbsData('Applications', position - 1, false, () => hendleBreadcrumbs());
  }, []);

  const hendleBreadcrumbs = () => {
    setApplicationListing(true);
    setBreadcrumbsData('Applications', position - 1, true, () => hendleBreadcrumbs(), true);
  };

  const handleProductClick = (application) => {
    setBreadcrumbsData(application.title, position, false, () => {}, true);
    setAppDetail(application);
    setApplication(application.id);
    setApplicationListing(false);
    setApplicationList((data) => {
      setApplicationDropDown(NavbarPopoverEl(data, application?.applicationCode));
      return data;
    });
  };

  const handleChange = (event) => {
    setApplication(event.target.value);
    const current = applicationList.find(
      (application) => application.id === event.target.value
    );
    if (current) {
      setBreadcrumbsData(current.title, position);
      setAppDetail(current);
    }
  };

  const createDeal = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {/* <AddCircleIcon style={{ fill: '#ffffff', fontSize: '21px' }} /> */}
      <div style={{ marginLeft: '3px' }}>Create Deal</div>
    </div>
  );

  const handleModalClose = () => {
    toggleDialog(false);
    fetchData();
  };

  const onSubmit = (values) => {
    createDealForm(
      values,
      company.company.businessName,
      company.company.id,
      company.id,
      company.applicationCode,
      company.company.companyCode
    ).then((res) => {
      if (res.data) {
        setOpenDialog(false);
      }
    });
  };

  return (
    <>
      <Grid container={true}>
        {showListing ? (
          <Grid item={true} xs={12}>
            <Grid item={true} xs={12}>
              <CustomeHeader
                pageName="Application List"
                actions={toolbarActions}
                isSearch={false}
                isFilter={false}
              />
            </Grid>
            <Grid className={globalStyles.commonSpacing} item={true} xs={12}>
              <List>
                {applicationList.length ? (
                  applicationList.map((application) => (
                    <ListItem
                      className={style.listItemPadding}
                      key={application.id}
                    >
                      <Grid container={true}>
                        <Grid
                          item={true}
                          xs={7}
                          container={true}
                          alignItems="center"
                        >
                          <Grid item={true}>
                            <p className={style.listItemHeading}>
                              {application.title}
                            </p>
                          </Grid>
                          <Grid item={true}>
                            <p className={style.listItemSubHeading}>
                              {application.applicationCode}
                            </p>
                          </Grid>
                          <Grid item={true}>
                            <p className={`${style.listItemStatus} yellow`}>
                              {application.status}
                            </p>
                          </Grid>
                        </Grid>
                        <Grid
                          item={true}
                          xs={12}
                          container={true}
                          justify="space-between"
                        >
                          <Grid item={true} className={style.listSubContainer}>
                            <p className={style.listItemKey}>
                              Requested Amount:
                            </p>
                            <p className={style.listItemValue}>
                              {formatCurrency(application.requestedAmount)}
                            </p>
                          </Grid>
                          <Grid item={true} className={style.listSubContainer}>
                            <p className={style.listItemKey}>Product:</p>
                            <p className={style.listItemValue}>
                              {application?.product?.name}
                            </p>
                          </Grid>
                          <Grid item={true} className={style.listSubContainer}>
                            <p className={style.listItemKey}>Created At:</p>
                            <p className={style.listItemValue}>
                              {formatDateStandard(application.createdAt)}
                            </p>
                          </Grid>
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="Visit"
                          onClick={() => handleProductClick(application)}
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                ) : (
                  <p>No Applications Available</p>
                )}
              </List>
            </Grid>
          </Grid>
        ) : (
          <Grid container={true}>
            <Grid
              item={true}
              className={globalStyles.commonSpacing}
              xs={12}
              container={true}
              justify="space-between"
            >
              <Grid item={true} xs={7} container={true} alignItems="center">
                {/* <Grid item={true}>
                  <Select value={selectedApplication} onChange={handleChange}>
                    {applicationList.map((application) => (
                      <MenuItem key={application.id} value={application.id}>
                        {application.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid> */}
                <Grid item={true}>
                  <p>{appDetail?.applicationCode}</p>
                </Grid>
              </Grid>
              <Grid item={true} xs="auto">
                <Grid container={true}>
                  <Grid item={true}>
                    <ApplicationStatus
                      brandDetail={company}
                      applicationCode={appDetail?.applicationCode || ''}
                      application={appDetail}
                      onStatusUpdateSuccess={fetchData}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <ApplicationDetail
              application={appDetail}
              updateData={fetchData}
              id={appDetail?.id}
              setBreadcrumbsData={setBreadcrumbsData}
              position={position + 1}
            />
          </Grid>
        )}
      </Grid>
      {dialogOpen && (
        <DialogComponent title="Create application" onClose={handleModalClose}>
          <AddApplication
            company={company}
            productList={productList}
            onClose={handleModalClose}
          />
        </DialogComponent>
      )}
      {openDialog && (
        <DialogComponent onClose={() => setOpenDialog(false)} title="Create Deal">
          <CreateForm onSubmit={onSubmit} brandDetail={company} applicationCode={appDetail?.applicationCode || ''} />
        </DialogComponent>
      )}
    </>
  );
};

export default React.memo(ApplicationListing);
