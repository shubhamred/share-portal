import React from 'react';
import { storiesOf } from '@storybook/react';
import ShareholdingSummary from './shareholdingSummary';

storiesOf('ShareholdingSummary', module)
  .add('ShareholdingSummary-default', () => (
    <div>
      <ShareholdingSummary />
    </div>
  ));
