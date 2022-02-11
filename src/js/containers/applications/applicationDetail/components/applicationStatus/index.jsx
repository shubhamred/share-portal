import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextField
} from '@material-ui/core';
import { DialogComponent } from 'app/components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  getApplicationStatus,
  updateApplicationStatus
} from 'app/containers/applications/saga';
import CreateForm from 'app/containers/brands/brandDetail/forms/createDealForm';
import { createDealForm } from 'app/containers/deals/saga';
import Styles from '../../styles.scss';

const ApplicationStatus = (props) => {
  const [isDialogueOpen, toggleDialogue] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [errorStatus, setErrorStatus] = useState({
    select: false,
    remarks: false
  });
  const [statusList, setStatusList] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [allStatus, setStatus] = useState({});
  const { application, onStatusUpdateSuccess, brandDetail, applicationCode } = props;

  const handleSubmit = () => {
    if (!selectedStatus) {
      setErrorStatus((prevState) => ({ ...prevState, select: true }));
      return;
    }
    if (!remarks || !remarks.length) {
      setErrorStatus((prevState) => ({ ...prevState, remarks: true }));
      return;
    }
    const payload = {
      status: selectedStatus,
      remarks
    };
    updateApplicationStatus(application.id, payload).then((res) => {
      if (res.data) {
        setRemarks('');
        setSelectedStatus('');
        toggleDialogue(false);
        onStatusUpdateSuccess({ ...application, status: selectedStatus });
      }
    });
  };

  const handleStatusChange = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedStatus(value);
    setErrorStatus((prevState) => ({ ...prevState, select: false }));
  };
  const handleRemarkChange = (event) => {
    const {
      target: { value }
    } = event;
    setRemarks(value);
    if (value.length) {
      setErrorStatus((prevState) => ({ ...prevState, remarks: false }));
    } else {
      setErrorStatus((prevState) => ({ ...prevState, remarks: true }));
    }
  };

  const statusHandler = (status, nextData, data) => {
    for (let index = 0; index < status.length; index += 1) {
      if (nextData[status[index]]?.nextStates?.length > 0) {
        statusHandler(nextData[status[index]].nextStates, nextData, [...data, ...status]);
      } else {
        setStatusList([...data, ...status]);
      }
    }
  };

  const handleCancel = () => {
    toggleDialogue(false);
    setRemarks('');
  };

  useEffect(() => {
    if (application?.id) getStatus();
  }, [application]);

  const getStatus = () => {
    getApplicationStatus(application.id).then((res) => {
      if (res.data) {
        if (res?.data['Term Sheet Signed']) {
          statusHandler(res.data['Term Sheet Signed'].nextStates, res.data, ['Term Sheet Signed']);
        }
        setStatus(res.data);
      }
    });
  };

  const onSubmit = (values) => {
    createDealForm(
      values,
      brandDetail.company.businessName,
      brandDetail.company.id,
      application.id,
      application.applicationCode,
      application.companyCode
    ).then((res) => {
      if (res.data) {
        setOpenDialog(false);
      }
    });
  };

  const createDeal = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <div style={{ marginLeft: '3px' }}>Create Deal</div>
    </div>
  );

  return (
    <>
      <Grid item={true} xs="auto">
        {statusList.includes(application?.status || '') && (
          <Button className={Styles.createDealBtn} onClick={() => setOpenDialog(true)}>
            {createDeal}
          </Button>
        )}
        <Button
          endIcon={<ExpandMoreIcon />}
          variant="outlined"
          color="primary"
          disabled={application?.status === 'Fully Repaid'}
          className={`${Styles.btns} ${application?.status === 'Fully Repaid' ? Styles.btnDisabled : ''}`}
          onClick={() => toggleDialogue(true)}
        >
          {application?.status}
        </Button>
      </Grid>
      {isDialogueOpen && (
        <DialogComponent
          onClose={() => toggleDialogue(false)}
          title="Update Application Status"
          customWidth="400px"
        >
          <Grid container={true}>
            <Grid item={true} xs={12} className={Styles.mb15}>
              <FormControl className={Styles.w100}>
                <InputLabel id="application-status-select-label" error={errorStatus.select}>
                  Application Status
                </InputLabel>
                <Select
                  labelId="application-status-select-label"
                  id="application-status-select"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className={Styles.w100}
                >
                  {allStatus[application.status]
                  && allStatus[application.status].nextStates
                    ? allStatus[application.status].nextStates.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12} className={Styles.mb15}>
              <TextField
                error={errorStatus.remarks}
                label="Remarks"
                value={remarks}
                className={Styles.w100}
                onInput={handleRemarkChange}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true} justify="flex-end">
                <Button style={{ marginRight: '20px' }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogComponent>
      )}
      {openDialog && (
        <DialogComponent onClose={() => setOpenDialog(false)} title="Create Deal">
          <CreateForm onSubmit={onSubmit} brandDetail={brandDetail} applicationCode={applicationCode || ''} />
        </DialogComponent>
      )}
    </>
  );
};
export default ApplicationStatus;
