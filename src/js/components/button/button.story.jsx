import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './button';

storiesOf('Button', module)
  .add('default Button', () => (
    <Button label="label" />
  ))
  .add('disabled Button', () => (
    <Button label="label" />
  ));
