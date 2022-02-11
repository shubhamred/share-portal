import React from 'react';
import { storiesOf } from '@storybook/react';
import Popper from './popper';

storiesOf('Popper', module)
  .add('default Popper', () => (
    <Popper />
  ));
