import React from 'react';
import PropTypes from 'prop-types';
import { Button, ItemSelector } from '../../../components/index';

import styles from './styles.scss';

const Popper = (props) => {
  const { currentStatus, handleStatusChange, updateStatus, initialStatus } = props;
  let statusOptions;
  switch (initialStatus) {
    case 'Pending':
      statusOptions = ['Pending', 'Received'];
      break;
    case 'Received':
      statusOptions = ['Received', 'Verified'];
      break;
    case 'Verified':
      statusOptions = ['Verified'];
      break;
    default:
      statusOptions = [];
  }
  return (
    <div className={styles.wrapper}>
      <ItemSelector
        options={statusOptions}
        selectedOption={currentStatus}
        handleSelectedOption={(value) => handleStatusChange(value)}
      />
      <Button
        label="Update"
        style={{
          backgroundColor: 'white',
          border: '1px solid #1518AF',
          color: '#1518AF',
          minWidth: '131px',
          height: '32px',
          padding: '0px'
        }}
        onClick={updateStatus}
      />
    </div>
  );
};

Popper.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  handleStatusChange: PropTypes.func,
  updateStatus: PropTypes.func,
  initialStatus: PropTypes.string
};

Popper.defaultProps = {
  handleStatusChange: () => { },
  updateStatus: () => { },
  initialStatus: ''
};

export default Popper;
