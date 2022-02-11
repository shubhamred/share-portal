import React from 'react';
import { storiesOf } from '@storybook/react';
import RewardList from './rewardList';

storiesOf('RewardList', module)
  .add('RewardList-default', () => (
    <div>
      <RewardList />
    </div>
  ));
