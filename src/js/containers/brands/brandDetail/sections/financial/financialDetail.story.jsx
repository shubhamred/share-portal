import React from 'react';
import { storiesOf } from '@storybook/react';
import FinancialDetail from './financialDetail';

storiesOf('FinancialDetail', module)
  .add('FinancialDetail-default', () => (
    <div>
      <FinancialDetail />
    </div>
  ));
