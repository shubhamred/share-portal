import React from 'react';
import { storiesOf } from '@storybook/react';
import Adornmentinput from './adornmentInput';

storiesOf('Adornmentinput', module)
  .add('default Adornmentinput', () => (
    <Adornmentinput />
  ))
  .add('disabled Adornmentinput', () => (
    <Adornmentinput disabled={true} value="9" />
  ));
