/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import EditTextComponent from '../index';

configure({ adapter: new Adapter() });

describe('components/EditText', () => {
  it('should render without props', () => {
    const component = shallow(
      <EditTextComponent />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render with props', () => {
    const props = {
      value: 'Value',
      textStyles: {
        color: 'black'
      },
      onSave: jest.fn()
    };
    const component = mount(
      <EditTextComponent {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with props after edit', () => {
    const props = {
      value: 'Value',
      textStyles: {
        color: 'black'
      },
      onSave: jest.fn()
    };
    const component = mount(
      <EditTextComponent {...props} />
    );
    component.find('button.editBtn').simulate('click');
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should handle save', () => {
    const props = {
      value: 'Value',
      textStyles: {
        color: 'black'
      },
      onSave: jest.fn()
    };
    const component = mount(
      <EditTextComponent {...props} />
    );
    component.find('button.editBtn').simulate('click');
    component.find('input').simulate('change', { target: { value: 'Valus' } });
    component.find('button.saveBtn').simulate('click');
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should handle cancel', () => {
    const props = {
      value: 'Value',
      textStyles: {
        color: 'black'
      },
      onSave: jest.fn()
    };
    const component = mount(
      <EditTextComponent {...props} />
    );
    component.find('button.editBtn').simulate('click');
    component.find('button.cancelBtn').simulate('click');
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
