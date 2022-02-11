import React from 'react';
import { storiesOf } from '@storybook/react';
import ProfitAndLoss from './profitAndLoss';

storiesOf('ProfitAndLoss', module)
  .add('ProfitAndLoss-default', () => (
    <div>
      <ProfitAndLoss />
    </div>
  ));
