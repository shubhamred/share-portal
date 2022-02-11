import React, { useEffect, useState } from 'react';
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { formatCurrency, getParameterValuesFromHash } from 'app/utils/utils';
import { DOC_VALIDATION_MARK } from 'app/utils/constants';
import { startCase } from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';
import { disableMouseWheelOnNumbers } from 'app/utils/domOperations';
import DialogComponent from '../../../components/dialogComponent/dialogComponent';
import styles from './styles.scss';
import DealSection from '../components/dealSection';
import Dialog from './components/dialog';
import { Button, Breadcrumb } from '../../../components';
import CloneDealForm from './components/cloneDealDialog';
import { cloneDeal, getDealDocumentStatus, getDealStatus, updateDealPatronList } from '../saga';
import PatronsListDialog from './components/patronsListDialog';
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

const DealDetail = (props) => {
  // console.log(props);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { sectionList, sectionConfig, updateDealStatus, deal, dealStatus, dealSaveStatus, BreadcrumbsArray, setBreadcrumbsData, defaultHashHandler, dealDocValidation } = props;
  const [selectedButton, setSelectedButton] = useState();
  const [selectedSectionKey, setSelectedSectionKey] = useState(0);
  const [openDialog, setOpenDialogstatus] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [dealStatuses, setDealStatuses] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [validateMaxVisible, setValidateMaxVisible] = useState(true);
  const [isCloneDealFormOpen, toggleCloneDealForm] = useState(false);
  const [isPatronsListFormOpen, togglePatronsListForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isDocInitiation = ['Fully Subscribed', 'Document Generate Error'].includes(dealStatus);
  const disableStatusChange = isDocInitiation && (!dealDocValidation?.percentageComplete || dealDocValidation?.percentageComplete < DOC_VALIDATION_MARK);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const paramValues = getParameterValuesFromHash('/deals/:dealId');
  const { dealId } = paramValues;

  // useEffect(() => {
  // if (getConfig) getConfig();
  // if (getDealDetail)   (dealId);
  // if (getAllSections) getAllSections(dealId);
  // }, []);
  useEffect(() => {
    if (props.formSubmitted) {
      if (props.nextTab || props.nextTab === 0) {
        setSelectedSectionKey(props.nextTab);
        props.resetNextTab();
      } else if (selectedButton === 'Save') {
        props.updateDealDetailForm(deal);
        setOpenAlert(true);
        setTimeout(() => {
          setOpenAlert(false);
        }, 2000);
        setSelectedButton();
      }
      props.resetFormSubmitted();
    }
  }, [props.formSubmitted]);

  const onChangeStatusButtonClick = () => {
    setOpenDialogstatus(!openDialog);
  };

  useEffect(() => {
    if (dealStatus) {
      getDealStatus().then((res) => {
        if (res.data) {
          const nextStates = res.data[dealStatus];
          if (nextStates && nextStates?.nextStates) {
            setDealStatuses(nextStates.nextStates);
          } else {
            setDealStatuses([]);
          }
        }
      });
    }
  }, [dealStatus]);

  useEffect(() => {
    const { data } = deal || {};
    if (dealDocValidation?.percentageComplete && (data?.dealCode === dealDocValidation.dealCode)) {
      return;
    }
    if (data?.dealCode) {
      getDealDocumentStatus(data?.dealCode);
    }
  }, [props.deal, dealDocValidation]);

  const handleUpdateStatus = (values) => {
    updateDealStatus(values, dealId).then((res) => {
      if (res.data) {
        dispatch({
          type: 'show',
          payload: `Deal status is updated to ${res.data.status}`,
          msgType: 'success'
        });
      } else {
        const errArr = res.errors || [];
        if (res.fieldsErrors && res.fieldsErrors.length) {
          const errFields = res.fieldsErrors
            .map((err) => err.property)
            .map((err) => startCase(err))
            .join(', ');
          const msg = `Please update ${errFields} to change the deal status to ${values.status}`;
          errArr.push(msg);
        }
        if (!errArr.length) errArr.push(res.message || res.error);
        dispatch({
          type: 'show',
          payload: errArr,
          msgType: 'error'
        });
      }
    });
    setOpenDialogstatus(false);
  };

  const validateMaxVisibleMethod = (fieldCount, sectionVisibleMax) => {
    if (fieldCount > sectionVisibleMax) {
      setValidateMaxVisible(false);
    } else {
      setValidateMaxVisible(true);
    }
  };

  const statusLabel = (
    <div className={styles.statusWrapper}>
      <div className={styles.currentStatus}>{dealStatus}</div>
      <ExpandMoreIcon />
    </div>
  );

  const cloneDealSubmit = (values) => {
    cloneDeal(deal.data.id, values).then((res) => {
      if (res.data) {
        toggleCloneDealForm(false);
        dispatch({
          type: 'show',
          payload: `Successfully Duplicated Deal`,
          msgType: 'success'
        });
        // This is due to the react-router does not reload the components on id change
        history.push(`/`);
        history.push(`/deals/${res.data.id}`);
      }
    });
  };

  const patronsListSubmit = (values) => {
    updateDealPatronList(values).then((res) => {
      if (res.data) {
        togglePatronsListForm(false);
        dispatch({
          type: 'show',
          payload: `Successfully Patrons Added To Deal`,
          msgType: 'success'
        });
      }
    });
  };

  useEffect(() => {
    defaultHashHandler();
    disableMouseWheelOnNumbers();
  }, []);

  useEffect(() => {
    if (deal?.data?.name) {
      setBreadcrumbsData(deal?.data?.name || 'Deals Detail', 1);
    }
  }, [deal]);

  return (
    <Grid container={true} className={styles.wrapper} wrap="nowrap" direction="row">
      {!isPatronsListFormOpen && (
        <Grid item={true} direction="row" container={true}>
          <div className={styles.headerWraper}>
            <Grid
              container={true}
              item={true}
              direction="row"
              justify="space-between"
              className={`${styles.mainDetailsWrapper} ${globalStyles.mainDetailsWrapperSpacing}`}
            >
              <Breadcrumb BreadcrumbsArray={BreadcrumbsArray} />
              <Grid item={true} direction="column" xs={12} md={8} lg={8}>
                <List className={styles.list}>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Deal Name"
                      secondary={
                        <p className={`${styles.textTruncate}`}>
                          {deal.data && deal.data.name ? (
                            <Tooltip title={deal.data.name}>
                              <span>{deal.data.name}</span>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </p>
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText classes={classes} primary="Deal ID" secondary={deal?.data?.dealCode || ''} />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      primary="Brand Name"
                      classes={classes}
                      secondary={
                        <p className={`${styles.textTruncate}`}>
                          {deal.data && deal.data.brandName ? (
                            <Tooltip title={deal.data.brandName}>
                              <span>{deal.data.brandName}</span>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </p>
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Deal Value"
                      secondary={
                        deal.data
                        && deal.data.dealAmount
                        && formatCurrency(deal.data.dealAmount, deal.data && deal.data.dealCurrency)
                      }
                    />
                  </ListItem>
                  <ListItem disableGutters={true}>
                    <ListItemText
                      classes={classes}
                      primary="Private Deal"
                      secondary={
                        <FormControlLabel
                          style={{ marginLeft: '0px' }}
                          control={
                            <Switch
                              size="small"
                              disabled={true}
                              checked={(deal.data && deal.data.isPrivate) || false}
                              name="PrivateDeal"
                              color="primary"
                            />
                          }
                        />
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item={true}
                justify="flex-end"
                xs={12}
                md={4}
                lg={4}
                style={{ display: 'flex', textAlign: 'end' }}
              >
                <div>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    style={{ marginRight: '60px' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted={true}
                    open={open}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        toggleCloneDealForm(true);
                      }}
                    >
                      Duplicate Deal
                    </MenuItem>
                    {deal.data?.isPrivate ? (
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          togglePatronsListForm(true);
                        }}
                      >
                        Patron access
                      </MenuItem>
                    ) : null}
                  </Menu>
                </div>
                <Button
                  label={statusLabel}
                  disabled={!dealStatuses.length || disableStatusChange}
                  onClick={() => onChangeStatusButtonClick()}
                  title={disableStatusChange ? 'Please add/upload required data to initiate the documentation' : ''}
                />
              </Grid>
            </Grid>
          </div>
          <Grid
            className={globalStyles.bodyContentWrapper}
            container={true}
            item={true}
            direction="row"
            justify="space-between"
          >
            <Grid className={styles.formContainer}>
              <DealSection
                validateMaxVisible={(fieldCount, sectionVisibleMax) => validateMaxVisibleMethod(fieldCount, sectionVisibleMax)}
                sectionConfig={sectionConfig}
                selectedIndex={selectedSectionKey}
                sectionList={sectionList}
                setBreadcrumbsData={setBreadcrumbsData}
                position={2}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      {openDialog && (
        <Dialog
          onSubmit={handleUpdateStatus}
          handleClose={() => setOpenDialogstatus(false)}
          statusList={dealStatuses}
          dealStatus={dealStatus}
        />
      )}
      {isCloneDealFormOpen && (
        <DialogComponent title="Duplicate Deal" onClose={() => toggleCloneDealForm(false)}>
          <CloneDealForm deal={deal.data} onSubmit={cloneDealSubmit} />
        </DialogComponent>
      )}
      {isPatronsListFormOpen && (
        // <DialogComponent
        //   title="Patrons who’ll have access to deals"
        //   customWidth="800px !important"
        //   onClose={() => togglePatronsListForm(false)}
        // >
        <PatronsListDialog
          togglePatronsListForm={() => togglePatronsListForm(false)}
          deal={deal.data}
          onSubmit={patronsListSubmit}
        />
        // </DialogComponent>
      )}

      {dealSaveStatus && openAlert && (
        <DialogComponent
          onClose={() => setOpenAlert(false)}
          closeButton={false}
          contentStyle={{ padding: '50px 112px' }}
        >
          <Grid container={true} xs={12} justify="center">
            {dealSaveStatus === 'success' && (
              <div className={styles.saveMessage}>
                <div>Deal saved successfully</div>
                <div className={styles.messageIcon}>
                  <CheckCircleIcon style={{ fill: 'green' }} />
                </div>
              </div>
            )}
            {dealSaveStatus === 'failed' && (
              <div className={styles.saveMessage}>
                <div>Deal save failed</div>
                <div className={styles.messageIcon}>
                  <ErrorIcon style={{ fill: 'red' }} />
                </div>
              </div>
            )}
          </Grid>
        </DialogComponent>
      )}
    </Grid>
  );
};

const defaultArray = [
  { title: 'Deals', level: 0, functions: () => {} },
  { title: 'Deals Detail', level: 1, functions: () => {} }
];
export default WithBreadcrumb(DealDetail, defaultArray);
