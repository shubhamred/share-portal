import React from 'react';
import { storiesOf } from '@storybook/react';
import SecurityAllotment from './securityAllotment';

storiesOf('SecurityAllotment', module)
  .add('SecurityAllotment-default', () => (
    <div>
      <SecurityAllotment />
    </div>
  ));
