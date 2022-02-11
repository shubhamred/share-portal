import React from 'react';
import { storiesOf } from '@storybook/react';
import FileList from './fileList';

storiesOf('FileList', module)
  .add('default FileList', () => (
    <FileList />
  ));
