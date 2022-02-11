import React from 'react';
import { storiesOf } from '@storybook/react';
import DealHeader from './dealHeader';

storiesOf('DealHeader', module)
  .add('default DealHeader', () => (
    <DealHeader />
  ));
