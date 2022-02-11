import React from 'react';
import { storiesOf } from '@storybook/react';
import InvestmentList from './investmentList';

storiesOf('InvestmentList', module)
  .add('InvestmentList-default', () => (
    <div>
      <InvestmentList />
    </div>
  ));
