import React from 'react';
import { storiesOf } from '@storybook/react';
import LoyaltyDashboard from './loyaltyDashboard';

storiesOf('LoyaltyDashboard', module)
  .add('LoyaltyDashboard-default', () => (
    <div>
      <LoyaltyDashboard />
    </div>
  ));
