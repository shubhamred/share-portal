import React from 'react';
import { storiesOf } from '@storybook/react';
import BalanceSheet from './balanceSheet';

storiesOf('BalanceSheet', module)
  .add('BalanceSheet-default', () => (
    <div>
      <BalanceSheet />
    </div>
  ));
