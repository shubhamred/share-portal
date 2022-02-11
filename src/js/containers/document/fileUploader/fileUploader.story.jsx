import { storiesOf } from '@storybook/react';
import React from 'react';

import FileUploader from './fileUploader';

storiesOf('FileUploader', module)
  .add('FileUploader-default', () => (
    <div>
      <FileUploader />
    </div>
  ));
