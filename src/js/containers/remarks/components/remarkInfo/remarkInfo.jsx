import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const RemarkInfo = (props) => {
  const { userName, content, date } = props;
  return (
    <table className={styles.table}>
      <tr>
        <td width="10%"><img src="/assets/userIcon.svg" alt="" width={18} height={18} /></td>
        <td width="60%" className={styles.mainText}>{userName}</td>
        <td width="30%" className={styles.subText}>{date}</td>
      </tr>
      <tr>
        <td width="10%" />
        <td width="60%" className={styles.subText}>{content}</td>
        <td width="30%" />
      </tr>
    </table>
  );
};

RemarkInfo.propTypes = {
  userName: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.string
};

RemarkInfo.defaultProps = {
  userName: '',
  content: '',
  date: ''
};

export default RemarkInfo;
