import React from 'react';
import { storiesOf } from '@storybook/react';
import CheckBox from './checkBox';

const onlineChannelList = [{ label: 'Amazon', name: 'Amazon' },
  { label: 'Flipkart', name: 'Flipkart' }, { label: 'Swiggy', name: 'Swiggy' },
  { label: 'Zomato', name: 'Zomato' }, { label: 'Paytm', name: 'Paytm' },
  { label: 'Other', name: 'other' }];

storiesOf('CheckBox', module)

  .add('default CheckBox', () => (
    <CheckBox values={onlineChannelList} />
  ))
  .add('disabled CheckBox', () => (
    <CheckBox values={onlineChannelList} disabled={true} />
  ));
