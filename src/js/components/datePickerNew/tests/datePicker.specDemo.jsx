import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import DatePickerNew from '../index';

configure({ adapter: new Adapter() });

describe('components/datePicker', () => {
  it('Renders default options', () => {
    const component = mount(
      <DatePickerNew />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      label: 'Dummy label',
      input: {
        value: '13-06-2020'
      }
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <DatePickerNew {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with disabled options', () => {
    const props = {
      label: 'Dummy label',
      input: {
        value: '13-06-2020'
      },
      disabled: true
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <DatePickerNew {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
