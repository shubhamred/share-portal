import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import styles from './styles.scss';

const HideButton = (props) => {
  const { visible, onHideBtnClick, isSection } = props;
  const value = isSection ? 'Section ' : '';
  return (
    <div
      className={styles.hideBtn}
      onClick={() => onHideBtnClick()}
      role="presentation"
    >
      <Switch
        size={isSection ? 'medium' : 'small'}
        color="primary"
        checked={visible}
        onChange={onHideBtnClick}
        name="checkedA"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      <div className={styles.hideSection}>
        {!visible ? `${value}Hidden` : `${value}Visible`}
      </div>
    </div>
  );
};

HideButton.propTypes = {
  visible: PropTypes.bool,
  onHideBtnClick: PropTypes.func,
  isSection: PropTypes.bool
};

HideButton.defaultProps = {
  visible: false,
  onHideBtnClick: () => {},
  isSection: false
};

export default HideButton;
