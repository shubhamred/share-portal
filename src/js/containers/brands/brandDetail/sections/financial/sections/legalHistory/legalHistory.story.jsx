import React from 'react';
import { storiesOf } from '@storybook/react';
import LegalHistory from './legalHistory';

storiesOf('LegalHistory', module)
  .add('LegalHistory-default', () => (
    <div>
      <LegalHistory />
    </div>
  ));
