import React from 'react';
import { storiesOf } from '@storybook/react';
import CashFlow from './cashFlow';

storiesOf('CashFlow', module)
  .add('CashFlow-default', () => (
    <div>
      <CashFlow />
    </div>
  ));
