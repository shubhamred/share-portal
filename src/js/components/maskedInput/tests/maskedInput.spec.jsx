/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MaskedInput from '../index';

configure({ adapter: new Adapter() });

describe('components/MaskedInput', () => {
  it('should render with default props', () => {
    const component = mount(
      <MaskedInput />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with props', () => {
    const props = {
      value: 0,
      handleChange: jest.fn(),
      label: 'Test Label',
      name: 'label'
    };
    const component = mount(
      <MaskedInput {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with value props', () => {
    const props = {
      value: 1234,
      handleChange: jest.fn(),
      label: 'Test Label'
    };
    const component = mount(
      <MaskedInput {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  // it('should handle on change', () => {
  //   const props = {
  //     value: '1234',
  //     handleChange: jest.fn(),
  //     label: 'Test Label',
  //     name: 'label'
  //   };
  //   const components = mount(
  //     <MaskedInput {...props} />
  //   );
  //   components.find('input').simulate('change');
  //   expect(props.handleChange).toBeCalled();
  // });
});
