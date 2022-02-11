import React from 'react';
import { storiesOf } from '@storybook/react';
import Charges from './charges';

storiesOf('Charges', module)
  .add('Charges-default', () => (
    <div>
      <Charges />
    </div>
  ));
