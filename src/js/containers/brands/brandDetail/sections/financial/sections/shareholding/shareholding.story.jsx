import React from 'react';
import { storiesOf } from '@storybook/react';
import Shareholding from './shareholding';

storiesOf('Shareholding', module)
  .add('Shareholding-default', () => (
    <div>
      <Shareholding />
    </div>
  ));
