import React from 'react';
import { storiesOf } from '@storybook/react';
import TextArea from './textArea';

storiesOf('TextArea', module)
  .add('default TextArea', () => (
    <TextArea />
  ))
  .add('disabled TextArea', () => (
    <TextArea disabled={true} />
  ));
