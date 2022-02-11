import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from 'app/components';
import styles from './styles.scss';

const StatusFilter = (props) => {
  const { handleBlur, handleCheckBoxValue, statusOptions, style, checkedOptions } = props;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className={styles.filterWrapper} style={style} tabIndex="0" onBlur={handleBlur}>
      <MultiSelect
        listItems={statusOptions}
        handleSelect={handleCheckBoxValue}
        selectedItems={checkedOptions}
        nameOfSelect="Status"
      />
    </div>
  );
};

StatusFilter.propTypes = {
  handleBlur: PropTypes.func,
  handleCheckBoxValue: PropTypes.func
};

StatusFilter.defaultProps = {
  handleBlur: () => { },
  handleCheckBoxValue: () => { }
};

export default StatusFilter;
