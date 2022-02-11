import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from './input';

storiesOf('Input', module)
  .add('default Input', () => (
    <Input
      label="Label"
      hideButton="true"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '24px' }}
      row={false}
      placeHolder="Placeholder"
    />
  ))
  .add('Input row', () => (
    <Input
      label="Label"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '24px' }}
      row={true}
      placeHolder="Placeholder"
    />
  ))
  .add('Input without border', () => (
    <Input
      label="Label"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '18px' }}
      customInputStyle={{ border: 'none', borderBottom: '1px solid #acacac' }}
      row={false}
      placeHolder="Placeholder"
    />
  ))
  .add('disabled Input', () => (
    <Input
      label="Label"
      hideButton="true"
      propValue="value"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '24px' }}
      row={false}
      placeHolder="Placeholder"
      disabled={true}
    />
  ));
