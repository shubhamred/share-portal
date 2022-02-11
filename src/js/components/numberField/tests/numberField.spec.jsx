/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NumberField from '../numberField';

configure({ adapter: new Adapter() });

describe('components/NumberField', () => {
  it('Renders default options', () => {
    const input = {
      onChange: jest.fn()
    };
    const component = shallow(
      <NumberField input={input} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      input: {
        onChange: jest.fn()
      },
      label: 'Label',
      row: true,
      disabled: true,
      meta: {
        error: 'Error',
        submitFailed: true
      }
    };

    const component = mount(
      <NumberField {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
