/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import ItemSelector from '../itemSelector';

configure({ adapter: new Adapter() });

describe('components/ItemSelector', () => {
  it('Renders default options', () => {
    const component = shallow(
      <ItemSelector />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with disabled options', () => {
    const props = {
      label: 'Label',
      disabled: true
    };
    const component = shallow(
      <ItemSelector {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      label: 'Label',
      disabled: false,
      placeholder: 'placeholder Item',
      handleSelectedOption: jest.fn(),
      selectedOption: 'Item1',
      options: ['Item1', 'Item2', 'Item3']
    };
    const component = mount(
      <ItemSelector {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('handles onchange', () => {
    const props = {
      label: 'Label',
      disabled: false,
      placeholder: 'placeholder Item',
      handleSelectedOption: jest.fn(),
      selectedOption: 'Item1',
      options: ['Item1', 'Item2', 'Item3']
    };
    const component = mount(
      <ItemSelector {...props} />
    );
    component.find('input').simulate('change');
    expect(props.handleSelectedOption).toBeCalled();
  });
});
