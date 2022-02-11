import React from 'react';
import PropTypes from 'prop-types';
import CancelIcon from '@material-ui/icons/Cancel';
import styles from './styles.scss';

const CloseButton = (props) => {
  const { onCloseButtonClick } = props;
  return (
    <div className={styles.closeButton} onClick={() => onCloseButtonClick()} role="presentation">
      <CancelIcon style={{ fill: '#3b3b3b', fontSize: '20' }} />
      <span style={{ fontWeight: 100 }}>Remove</span>
    </div>
  );
};

CloseButton.propTypes = {
  onCloseButtonClick: PropTypes.func
};

CloseButton.defaultProps = {
  onCloseButtonClick: () => { }
};

export default CloseButton;
