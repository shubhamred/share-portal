import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { TreeViews } from 'app/components';
import styles from '../styles.scss';

const ErrorData = (props) => {
  const { onClose, error } = props;
  const [errorData, setErrorData] = useState([]);

  const sentenceCaseText = (text = '') => {
    const result = text.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  useEffect(() => {
    if (error?.length) {
      let counter = 0;
      const errorArray = [];
      for (let index = 0; index < error.length; index += 1) {
        const errorElem = error[index];
        const messageArray = [];
        if (errorElem?.messages?.length) {
          for (let ind = 0; ind < errorElem.messages.length; ind += 1) {
            const messagesElem = errorElem.messages[ind];
            messageArray.push({
              key: counter,
              label: (
                <Grid container={true}>
                  <Grid item={true} xs="auto" className={styles.pt6}>
                    <FiberManualRecordIcon className={styles.fs7} />
                  </Grid>
                  <Grid className={styles.errorDesc} item={true} xs={11}>
                    {messagesElem}
                  </Grid>
                </Grid>
              )
            });
            counter += 1;
          }
        }

        errorArray.push({
          key: counter,
          label: (
            <Grid className={styles.errorTitle} item={true}>
              {sentenceCaseText(errorElem?.module || '')}
            </Grid>
          ),
          data: messageArray
        });
        counter += 1;
      }
      setErrorData(errorArray);
    }
  }, [error]);
  return (
    <Grid container={true}>
      <Grid item={true} md={12}>
        <TreeViews data={errorData} />
      </Grid>
      <Grid item={true} container={true} md={12} justify="flex-end">
        <Button onClick={onClose}>Close</Button>
      </Grid>
    </Grid>
  );
};

ErrorData.propTypes = {
  error: PropTypes.arrayOf(PropTypes.any),
  onClose: PropTypes.func
};

ErrorData.defaultProps = {
  error: [],
  onClose: () => {}
};

export default ErrorData;
