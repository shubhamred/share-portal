/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import TextArea from '../textArea';

configure({ adapter: new Adapter() });

describe('components/AdornmentInput', () => {
  it('Renders default options', () => {
    const component = shallow(
      <TextArea />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with Props', () => {
    const props = {
      label: 'Dummy label',
      disabled: true
    };
    const component = shallow(
      <TextArea {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with Error Props', () => {
    const props = {
      label: 'Dummy label',
      disabled: false,
      meta: {
        error: 'Invaild Text',
        submitFailed: true
      }
    };
    const component = shallow(
      <TextArea {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with invalid', () => {
    const props = {
      label: 'Dummy label',
      disabled: false,
      meta: {
        error: 'Invaild Text',
        submitFailed: false,
        invalid: true,
        dirty: true
      }
    };
    const component = mount(
      <TextArea {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with Minimum text', () => {
    const props = {
      label: 'Dummy label',
      disabled: false,
      meta: {
        error: 'Invaild Text',
        submitFailed: false,
        invalid: true,
        dirty: true
      },
      minLength: 10
    };
    const component = mount(
      <TextArea {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Handles on change handler', () => {
    const props = {
      label: 'Dummy label',
      disabled: false,
      input: {
        onChange: jest.fn(),
        value: 'test'
      }
    };
    const component = mount(
      <TextArea {...props} />
    );
    component.find('textarea[value="test"]').simulate('change', { target: { value: 'krishankantsinghal' } });
    expect(props.input.onChange).toBeCalled();
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
