import React from 'react';
import { storiesOf } from '@storybook/react';
import NumberField from './numberField';

storiesOf('NumberField', module)
  .add('default NumberField', () => (
    <NumberField
      label="Label"
      hideButton="true"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '24px' }}
      row={false}
      placeHolder="Placeholder"
    />
  ))
  .add('disabled NumberField', () => (
    <NumberField
      label="Label"
      hideButton="true"
      warningMessage="warningMessage"
      customLabelStyle={{ fontSize: '24px' }}
      row={false}
      placeHolder="Placeholder"
      disabled={true}
    />
  ));
