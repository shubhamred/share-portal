import React, { useContext } from 'react';
import { Context } from 'app/utils/utils';
import style from './styles.scss';
import styles from '../styles.scss';

const AdAccounts = () => {
  const { adsData } = useContext(Context);
  return (
    <div>
      {
        adsData && adsData.length ? (
          adsData.map((item) => {
            const { type, id } = item;
            return (
              <div className={style.flexWrapper}>
                <div>
                  <p className={styles.heading}>Ad Account name</p>
                  <p className={styles.subHeading}>{type}</p>
                </div>
                <div>
                  <p className={styles.heading}>ID</p>
                  <p className={styles.subHeading}>{id}</p>
                </div>
              </div>
            );
          })
        ) : <p>No Accounts Available</p>
      }
    </div>
  );
};
export default AdAccounts;
