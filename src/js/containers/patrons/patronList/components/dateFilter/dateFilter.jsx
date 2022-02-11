import React from 'react';
import PropTypes from 'prop-types';
import { DatePickerNew } from 'app/components';
import DateRangeIcon from '@material-ui/icons/DateRange';
import styles from './styles.scss';

const DateFilter = (props) => {
  const { onDateSelect, handleBlur, style, selectedDate } = props;

  const fromDate = (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <DateRangeIcon style={{ fill: '#707070', fontSize: '20px' }} />
      {selectedDate !== '' ? selectedDate : `Select Date`}
    </div>
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className={styles.filterWrapper} style={style} tabIndex="0" onBlur={handleBlur}>
      <DatePickerNew
        onDateSelect={onDateSelect}
        placeholder={fromDate}
        initialValue={selectedDate}
      />
    </div>
  );
};

DateFilter.propTypes = {
  onDateSelect: PropTypes.func,
  handleBlur: PropTypes.func
};

DateFilter.defaultProps = {
  onDateSelect: () => { },
  handleBlur: () => { }
};

export default DateFilter;
