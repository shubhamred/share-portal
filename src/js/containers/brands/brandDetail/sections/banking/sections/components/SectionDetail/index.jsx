/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Input, TableCustom } from '../../../../../../../../components/index';
import styles from './styles.scss';

export default function SectionDetail(props) {
  const { title, tableData, inputList } = props;
  const [isTransactionShown, toggleTransactionTable] = React.useState(false);
  return (
    <>
      <Grid item={true} justify="space-between" direction="row" container={true}>
        <Grid item={true} xs={12}>
          <Typography className={`${styles.textColor} ${styles.titleFontSize}`} variant="h6" component="h6" gutterBottom={true}>
            { title }
          </Typography>
        </Grid>
        <Grid container={true} xs={12}>
          {inputList && inputList.map((input) => (
            <Grid item={true} xs={4}>
              <Input {...input} />
            </Grid>
          ))}
        </Grid>
        <Grid className={styles.my1}>
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a className={`${styles.textColor} ${styles.cursorPointer}`} onClick={() => toggleTransactionTable(!isTransactionShown)}>
            {' '}
            {isTransactionShown ? 'Hide Transaction' : 'View Transaction' }
            {' '}
          </a>
        </Grid>
        {isTransactionShown ? (
          <Grid item={true} xs={12}><TableCustom {...tableData} /></Grid>) : null}
      </Grid>
    </>
  );
}
