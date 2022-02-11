/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Checkbox from '../checkBox';

configure({ adapter: new Adapter() });

const input = {
  onChange: jest.fn(),
  value: []
};
describe('components/checkBox', () => {
  it('Renders default options', () => {
    const component = mount(
      <Checkbox input={input} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      input,
      label: 'Dummy Label',
      hideButton: true,
      values: [{ label: 'label 1', name: 'name 1' }, { label: 'label 2', name: 'name 2' }]
    };
    const component = mount(
      <Checkbox {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with error options', () => {
    const props = {
      input,
      label: 'Dummy Label',
      hideButton: true,
      values: [{ label: 'label 1', name: 'name 1' }, { label: 'label 2', name: 'name 2' }],
      meta: {
        error: 'Sample Error',
        submitFailed: true
      }
    };
    const component = mount(
      <Checkbox {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('handles on change', () => {
    const props = {
      input: {
        ...input,
        value: ['name 1']
      },
      label: 'Dummy Label',
      hideButton: true,
      values: [{ label: 'label 1', name: 'name 1' }, { label: 'label 2', name: 'name 2' }],
      meta: {
        error: 'Sample Error',
        submitFailed: false
      },
      handleCheckBoxValue: jest.fn()
    };
    const component = mount(
      <Checkbox {...props} />
    );
    component.find('input[value="name 2"]').simulate('change');
    expect(props.handleCheckBoxValue).toBeCalled();
    component.find('input[value="name 2"]').simulate('change', { target: { checked: true } });
    expect(props.input.onChange).toBeCalled();
  });
});
