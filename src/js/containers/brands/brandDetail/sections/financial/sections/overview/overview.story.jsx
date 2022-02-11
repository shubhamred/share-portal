import React from 'react';
import { storiesOf } from '@storybook/react';
import Overview from './overview';

storiesOf('Overview', module)
  .add('Overview-default', () => (
    <div>
      <Overview />
    </div>
  ));
