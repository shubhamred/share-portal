import React from 'react';
import { storiesOf } from '@storybook/react';
import PointList from './pointList';

storiesOf('PointList', module)
  .add('PointList-default', () => (
    <div>
      <PointList />
    </div>
  ));
