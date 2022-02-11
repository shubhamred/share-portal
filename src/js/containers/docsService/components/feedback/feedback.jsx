import { Grid } from '@material-ui/core';
import React from 'react';
import { Button } from 'app/components';
import styles from './styles.scss';

const Feedback = ({ message = '', ctaText = '', onClose }) => (
  <Grid container={true}>
    <Grid item={true} className={styles.msgContainer}>
      <p className={styles.msgText}>
        {message}
      </p>
    </Grid>
    <Button
      type="button"
      label={ctaText}
      onClick={onClose}
      style={{
        backgroundColor: '#1518AF',
        minWidth: 100,
        width: 'fit-content',
        margin: '30px auto',
        display: 'block'
      }}
    />
  </Grid>
);

export default Feedback;
