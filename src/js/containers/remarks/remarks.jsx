/* eslint-disable react/no-multi-comp */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { Field } from 'redux-form';
import { Popover, Grid, ButtonBase, TextField, CircularProgress } from '@material-ui/core';

import RemarkInfo from './components';
import styles from './styles.scss';

const limit = 10;
const renderTextField = ({
  input: { value, onChange },
  meta: { error }
}) => (
  <Grid>
    <TextField
      id="outlined-multiline-static"
      multiline={true}
      rows="3"
      variant="outlined"
      placeholder="Make a comment"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      className={styles.textField}
    />
    {error
      && (
        <Grid className={styles.warning} item={true} xs={12}>
          {error}
        </Grid>
      )}
  </Grid>
);
renderTextField.propTypes = {
  input: PropTypes.shape(),
  meta: PropTypes.shape()
};
renderTextField.defaultProps = {
  input: {},
  meta: {}
};

const Remarks = (props) => {
  const { openDialog, handleClose, handleSubmit, onSubmitRemarks, brandDetail, patronDetail, getRemarks, isProcessing,
    data, setOffsetValue, totalCount, isEditSuccess, initialize, initialValues } = props;
  const [offset, setOffset] = useState(0);
  const scrollbars = useRef(null);

  useEffect(() => {
    if (scrollbars.current && data.length === limit) scrollbars.current.scrollToBottom();
    else if (scrollbars.current) scrollbars.current.scrollTop(200);
  }, [data]);

  useEffect(() => {
    handleScroll();
  }, [Boolean(openDialog)]);

  useEffect(() => {
    if (isEditSuccess) {
      initialize(initialValues);
      setOffset(0);
      handleScroll();
    }
  }, [isEditSuccess]);

  const handleSumbit = (values) => {
    const { type } = props;
    if (values.remarks) {
      let resource = '';
      let resourceId = '';
      if (type === 'brands') {
        resource = 'Application';
        resourceId = brandDetail && brandDetail.id;
      } else if (type === 'patrons') {
        resource = 'InvestorProfile';
        resourceId = patronDetail && patronDetail.id;
      }
      onSubmitRemarks({ ...values, resource, resourceId });
    }
  };

  const handleScroll = () => {
    const { type } = props;
    const scrollTopPosition = (scrollbars.current && scrollbars.current.getScrollTop()) || 0;
    const newOffset = isEditSuccess ? 0 : offset;
    if (((newOffset <= totalCount || newOffset === 0 || (newOffset >= totalCount && totalCount <= limit)) && !isProcessing)
      && scrollTopPosition === 0) {
      let resourceId = '';
      if (type === 'brands') {
        resourceId = brandDetail && brandDetail.id;
      } else if (type === 'patrons') {
        resourceId = patronDetail && patronDetail.id;
      }
      getRemarks({ resourceId, offset: newOffset, limit });
      setOffset(newOffset + limit);
      setOffsetValue(newOffset);
    }
  };

  return (
    <Popover
      open={Boolean(openDialog)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      anchorEl={openDialog}
      onClose={handleClose}
      className={styles.popover}
      classes={{ paper: styles.paper }}
    >

      <Grid>
        <Grid className={styles.headerWrapper} direction="row" justify="space-between">
          <div className={styles.remarkText}> Remarks</div>
          <ButtonBase onClick={handleClose}><img src="/assets/close.svg" alt="" width={15} height={15} /></ButtonBase>
        </Grid>
        <Grid>
          <Scrollbars
            ref={scrollbars}
            onScrollStop={handleScroll}
            bottom={100}
            className={styles.scrollbar}
          >
            <>
              {isProcessing && (
                <div className={styles.progressWrapper}>
                  <CircularProgress />
                </div>
              )}
              {data && data.map((element, index) => (
                <RemarkInfo
                  key={data[data.length - 1 - index].id}
                  // userName={data.length - 1 - index}
                  userName={data[data.length - 1 - index].createdByUser.nickname}
                  date={data[data.length - 1 - index].createdAt && moment(data[data.length - 1 - index].createdAt).format('DD MMM')}
                  content={data[data.length - 1 - index].remark}
                />
              ))}
            </>
          </Scrollbars>
        </Grid>
        <Grid className={styles.formWraper}>
          <form onSubmit={handleSubmit(handleSumbit)}>
            <Field
              component={renderTextField}
              type="textarea"
              name="remarks"
            />
            <Grid className={styles.buttonWrapper}>
              <Grid xs={4} onClick={handleClose}>
                <ButtonBase type="button" className={styles.cancelButton}>Cancel</ButtonBase>
              </Grid>
              <Grid xs={4}><ButtonBase type="submit" className={styles.submitButton}>Submit</ButtonBase></Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Popover>
  );
};

Remarks.propTypes = {
  openDialog: PropTypes.shape(),
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmitRemarks: PropTypes.func.isRequired,
  brandDetail: PropTypes.shape(),
  patronDetail: PropTypes.shape(),
  getRemarks: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape()),
  setOffsetValue: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  isEditSuccess: PropTypes.bool,
  type: PropTypes.string
};

Remarks.defaultProps = {
  openDialog: {},
  brandDetail: {},
  patronDetail: {},
  isProcessing: false,
  data: [],
  totalCount: 0,
  isEditSuccess: false,
  type: ''
};

export default Remarks;
