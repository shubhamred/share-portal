import React from 'react';
import { storiesOf } from '@storybook/react';
import PhoneInput from './phoneInput';

storiesOf('PhoneInput', module)
  .add('default PhoneInput', () => (
    <PhoneInput />
  ));
