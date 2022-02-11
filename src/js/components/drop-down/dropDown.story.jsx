import React from 'react';
import { storiesOf } from '@storybook/react';
import Dropdown from './dropDown';

const statusOptions = ['Draft', 'Ready', 'Published', 'Closed', 'Matured'];

storiesOf('Dropdown', module)
  .add('default Dropdown', () => (
    <Dropdown
      options={statusOptions}
      placeholder="Status"
    />
  ));
