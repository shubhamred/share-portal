import React from 'react';
import { storiesOf } from '@storybook/react';
import BrandsList from './brandList';

storiesOf('BrandsList', module)
  .add('BrandsList-default', () => (
    <div>
      <BrandsList />
    </div>
  ));
