/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import RadioGroup from '../radioGroup';

configure({ adapter: new Adapter() });

describe('components/RadioGroup', () => {
  it('Renders default options', () => {
    const input = {
      onChange: jest.fn()
    };
    const options = ['ABC', '123'];
    const component = shallow(
      <RadioGroup input={input} options={options} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders disables options', () => {
    const input = {
      onChange: jest.fn()
    };
    const options = ['ABC', '123'];
    const component = shallow(
      <RadioGroup input={input} options={options} disabled={true} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      input: {
        onChange: jest.fn(),
        value: ''
      },
      options: ['ABC', '123'],
      selected: 'ABC',
      label: 'Label',
      hideButton: true
    };
    const component = shallow(
      <RadioGroup {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      input: {
        onChange: jest.fn(),
        value: 'ABC'
      },
      options: ['ABC', '123'],
      selected: 'ABC',
      label: 'Label',
      hideButton: true,
      onHideBtnClick: jest.fn()
    };
    const component = mount(
      <RadioGroup {...props} />
    );
    component.find('.hideBtn').simulate('click');
    expect(props.onHideBtnClick).toBeCalled();
  });
  it('Handles On change', () => {
    const props = {
      input: {
        onChange: jest.fn(),
        value: 'ABC'
      },
      options: ['ABC', '123'],
      selected: 'ABC',
      label: 'Label',
      hideButton: true,
      onHideBtnClick: jest.fn(),
      handleChange: jest.fn()
    };
    const component = mount(
      <RadioGroup {...props} />
    );
    component.find('input[value="123"]').simulate('change');
    expect(props.input.onChange).toBeCalled();
    expect(props.handleChange).toBeCalled();
  });
});
